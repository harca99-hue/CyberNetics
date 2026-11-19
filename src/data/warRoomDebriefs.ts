import { WarRoomDifficultyTier, WarRoomModuleId } from '../types';

export interface DebriefQuickLink {
  label: string;
  sectionId: 'tool-vault' | 'resources' | 'writeups' | 'scripts';
  badge: string;
}

export interface ModuleDebriefData {
  id: WarRoomModuleId;
  tier: WarRoomDifficultyTier;
  tierLabel: string;
  xp: number;
  whyItHappened: {
    summary: string;
    identifiers: string[];
  };
  howToInvestigate: {
    summary: string;
    checks: string[];
  };
  howToFixAndPractice: {
    summary: string;
    remediations: string[];
    links: DebriefQuickLink[];
  };
  guidedHints: string[];
}

export const WAR_ROOM_DEBRIEFS: Record<WarRoomModuleId, ModuleDebriefData> = {
  'python-appsec-patcher': {
    id: 'python-appsec-patcher',
    tier: 'tier1',
    tierLabel: 'Tier 1: Cadet Foundations',
    xp: 150,
    whyItHappened: {
      summary:
        'Concatenating untrusted user input directly into OS shells, SQL query strings, or shipping plaintext keys in source code turns data into executable instructions or exposes crown-jewel credentials to anyone reading the repo.',
      identifiers: ['CWE-78 (OS Command Injection)', 'CWE-89 (SQL Injection)', 'CWE-798 (Hardcoded Credentials)'],
    },
    howToInvestigate: {
      summary:
        'AppSec engineers catch these patterns early during code review and pre-commit SAST/secret scanning before deployment.',
      checks: [
        'Run `bandit -r .` or Semgrep Python rulesets to flag `os.system()`, `shell=True`, and f-string `cursor.execute()` calls.',
        'Scan commit history with `gitleaks detect` or `trufflehog` to catch leaked API keys and signing secrets.',
        'Inspect runtime APM traces and WAF logs for shell metacharacters (`;`, `&&`, `$()`) or SQL tautologies (`\' OR \'1\'=\'1`).',
      ],
    },
    howToFixAndPractice: {
      summary:
        'Separate code from data at every boundary and externalize secrets into environment variables or a KMS vault.',
      remediations: [
        'Replace `os.system()` / `shell=True` with `subprocess.run([...], shell=False)` plus strict IP/hostname allowlist validation.',
        'Use parameterized queries (`cursor.execute("... WHERE username = ?", (username,))`) so drivers bind inputs strictly as literals.',
        'Inject secrets via `os.environ.get(...)` or cloud secret managers and rotate any committed keys immediately.',
      ],
      links: [
        { label: 'OWASP ZAP & Scanners (Tool Vault)', sectionId: 'tool-vault', badge: 'Tool Vault' },
        { label: 'PortSwigger & AppSec Labs', sectionId: 'resources', badge: 'Practice' },
        { label: 'Club Python Defense Scripts', sectionId: 'scripts', badge: 'Scripts' },
      ],
    },
    guidedHints: [
      'Snippet 1: Shell interpreters parse `;` and `&&`. Pass arguments as a Python list with `shell=False` and validate the host format first.',
      'Snippet 2: Never format or concatenate strings inside SQL. Pass parameters as a separate tuple using `?` placeholders.',
      'Snippet 3: Encoding a secret with Base64 is reversible obfuscation, not security—load secrets from `os.environ` instead.',
    ],
  },

  'linux-cli-defense': {
    id: 'linux-cli-defense',
    tier: 'tier1',
    tierLabel: 'Tier 1: Cadet Foundations',
    xp: 150,
    whyItHappened: {
      summary:
        'Overly permissive file permissions (mode `666` / `-rw-rw-rw-`) allow any local account or compromised service user to read or tamper with environment secrets, while hidden background scripts maintain unauthorized C2 persistence.',
      identifiers: ['CWE-732 (Incorrect Permission Assignment)', 'MITRE T1053 (Scheduled Task / Cron)', 'MITRE T1552 (Unsecured Credentials)'],
    },
    howToInvestigate: {
      summary:
        'Blue team responders baseline file modes, running processes, and scheduled persistence artifacts immediately upon host login.',
      checks: [
        'Run `ls -la` or `find / -perm -0002 -type f 2>/dev/null` to spot world-writable files and sensitive hidden dotfiles.',
        'Audit active processes with `ps aux` or `ss -tulnp` to uncover suspicious binaries running out of `/tmp` or `/dev/shm`.',
        'Inspect `/etc/crontab`, `/var/spool/cron`, and `audit.log` for unauthorized outbound reverse shells or beacons.',
      ],
    },
    howToFixAndPractice: {
      summary:
        'Enforce least-privilege POSIX permissions on secret configs, terminate rogue PIDs, and remove malicious persistence hooks.',
      remediations: [
        'Restrict `.env` and key files exclusively to the owning user (`chmod 600 .env_backup`).',
        'Terminate unauthorized processes (`kill -9 <PID>`) and delete their backing payload after acquiring a forensic hash.',
        'Enable Linux `auditd` rules on `/etc/crontab` and secret directories to alert on permission drift.',
      ],
      links: [
        { label: 'OverTheWire Bandit Practice', sectionId: 'resources', badge: 'Practice' },
        { label: 'Open-Source Forensic Tools', sectionId: 'tool-vault', badge: 'Tool Vault' },
        { label: 'Defensive Linux Scripts', sectionId: 'scripts', badge: 'Scripts' },
      ],
    },
    guidedHints: [
      'Run `ls -la` to spot hidden files—look closely at the permission bits on `.env_backup`.',
      'Use `cat .env_backup` and `ps` (or `ps aux`) to uncover the exposed file issue and the suspicious process PID.',
      'Fix both issues by running `chmod 600 .env_backup` and `kill 31337`.',
    ],
  },

  'packet-phishing-triage': {
    id: 'packet-phishing-triage',
    tier: 'tier1',
    tierLabel: 'Tier 1: Cadet Foundations',
    xp: 150,
    whyItHappened: {
      summary:
        'Attackers combine typosquatted homoglyph domains (`flpoIy-login.tk` using capital `I` for `l`) with mismatched `Reply-To` headers and missing DMARC enforcement to harvest SSO credentials and establish outbound backdoors on non-standard ports.',
      identifiers: ['MITRE T1566.002 (Spearphishing Link)', 'MITRE T1071 (Non-Standard Port C2)', 'RFC 7489 (DMARC Spoofing)'],
    },
    howToInvestigate: {
      summary:
        'SOC analysts correlate SMTP authentication headers (`Authentication-Results`) alongside firewall egress telemetry.',
      checks: [
        'Always inspect raw `Authentication-Results` for `spf=fail`, `dkim=none`, and `dmarc=fail` alongside `Reply-To` domain mismatches.',
        'Compare visible anchor text against the actual destination `href` to spot IDN/homoglyph lookalike domains.',
        'Filter firewall/NetFlow logs or Wireshark (`tcp.port == 4444`) for unusual outbound high-port SYN/PSH traffic from workstations.',
      ],
    },
    howToFixAndPractice: {
      summary:
        'Enforce strict email authentication policies, quarantine deceptive messages, and egress-filter workstations by default.',
      remediations: [
        'Publish strict DNS records (`v=DMARC1; p=reject;`) with aligned SPF & DKIM signing on all organizational domains.',
        'Quarantine flagged emails, purge delivered copies across mailboxes, and block the lookalike domain at the secure email gateway.',
        'Isolate compromised endpoint `WS-LAB-12` via EDR and deny unauthorized outbound ports (`4444/tcp`) at the perimeter firewall.',
      ],
      links: [
        { label: 'Wireshark & Nmap Vault', sectionId: 'tool-vault', badge: 'Tool Vault' },
        { label: 'CTF Forensics & PCAP Writeups', sectionId: 'writeups', badge: 'Writeups' },
        { label: 'SOC & Blue Team Resources', sectionId: 'resources', badge: 'Practice' },
      ],
    },
    guidedHints: [
      'Part 1: Check `Authentication-Results` (`spf=fail`), the external `.ru` `Reply-To` address, and the capital `I` typo in `flpoIy-login.tk`.',
      'Part 2: Port 443 HTTPS and Port 53 internal DNS are normal—look for an outbound workstation connection on a classic Metasploit/netcat port (`4444`).',
    ],
  },

  'siem-forensics': {
    id: 'siem-forensics',
    tier: 'tier2',
    tierLabel: 'Tier 2: SOC Analyst',
    xp: 250,
    whyItHappened: {
      summary:
        'An unsanitized HTTP query parameter (`redirect`) permitted OS command injection on the Nginx edge gateway, allowing a reverse shell (`www-data`), cron persistence, LSASS credential dumping, and LOLBin TLS exfiltration.',
      identifiers: ['CWE-78 (Command Injection)', 'MITRE T1190 (Exploit Public App)', 'MITRE T1003.001 (LSASS Memory)', 'MITRE T1041 (Exfil Over C2)'],
    },
    howToInvestigate: {
      summary:
        'SOC Tier-2 responders correlate web access logs with host EDR/Sysmon process creation and network connection telemetry.',
      checks: [
        'Query SIEM for web worker processes (`nginx`, `httpd`) spawning interactive shells (`/bin/bash`, `/bin/sh`) via Sysmon Event ID 1.',
        'Monitor Sysmon Event ID 10 (`ProcessAccess`) with `0x1FFFFF` (`PROCESS_ALL_ACCESS`) targeting `lsass.exe`.',
        'Flag high-volume outbound transfers initiated by living-off-the-land binaries like `certutil.exe` (Sysmon Event ID 3).',
      ],
    },
    howToFixAndPractice: {
      summary:
        'Patch the edge API parameter parser, harden OS credential protection, and enforce egress allowlists.',
      remediations: [
        'Remove shell execution from `/api/v1/auth/exchange` and validate redirect URLs against a strict origin allowlist.',
        'Enable Windows Credential Guard / RunAsPPL (`LsaCfgFlags`) to block user-mode tools from reading LSASS memory.',
        'Strip malicious cron entries (`/etc/cron.d/svc_sync.sh`), rotate all domain secrets, and sinkhole `82.102.23.119`.',
      ],
      links: [
        { label: 'DFIR & Forensics Writeups', sectionId: 'writeups', badge: 'Writeups' },
        { label: 'Open-Source Tool Vault', sectionId: 'tool-vault', badge: 'Tool Vault' },
        { label: 'SIEM Detection Scripts', sectionId: 'scripts', badge: 'Scripts' },
      ],
    },
    guidedHints: [
      'Filter by `CRITICAL` to narrow the 9 raw events down to the 5 attacker telemetry records.',
      'Initial Access: look at Nginx 500 error (`EVT-102`) or `nginx` spawning `/bin/bash` (`EVT-103`).',
      'Persistence writes to `/etc/crontab` (`EVT-105`), Credential Dump hits `lsass.exe` (`EVT-107`), and Exfiltration uses `certutil.exe` (`EVT-108`).',
    ],
  },

  'memory-malware': {
    id: 'memory-malware',
    tier: 'tier2',
    tierLabel: 'Tier 2: SOC Analyst',
    xp: 250,
    whyItHappened: {
      summary:
        'An attacker injected a reflective Cobalt Strike DLL directly into `rundll32.exe` memory (`PAGE_EXECUTE_READWRITE` unbacked VAD) and obfuscated the C2 beacon configuration with a `0x5A` single-byte XOR mask to evade disk AV scanners.',
      identifiers: ['MITRE T1055 (Process Injection)', 'MITRE T1027 (Obfuscated Strings)', 'MITRE T1071.001 (HTTPS C2 Beacon)'],
    },
    howToInvestigate: {
      summary:
        'DFIR analysts combine live RAM acquisition with Volatility 3 plugins and TLS metadata fingerprinting.',
      checks: [
        'Run `vol.py -f dump.dmp windows.malfind` to hunt for unbacked `PAGE_EXECUTE_READWRITE` regions containing `MZ` PE headers.',
        'Apply single-byte XOR key sweeps (`1768.py` / CyberChef XOR Brute Force) on dumped heap allocations to carve C2 strings.',
        'Correlate JA3 TLS fingerprints and periodic 60s heartbeat beacons (`tcp.port == 8443`) in Wireshark/Zeek logs.',
      ],
    },
    howToFixAndPractice: {
      summary:
        'Neutralize the C2 egress channel, isolate infected workstations, and deploy behavioral EDR memory guards.',
      remediations: [
        'Block `telemetry-sync-service.top` and `185.220.101.5` across DNS sinkholes and perimeter firewalls.',
        'Quarantine `WS-EXEC-FL04`, revoke user Kerberos/SSO tokens, and hunt across the fleet for the same JA3 hash.',
        'Enable Attack Surface Reduction (ASR) rules restricting `rundll32.exe` from spawning suspicious child `cmd.exe` processes.',
      ],
      links: [
        { label: 'Volatility 3 HTB Writeup', sectionId: 'writeups', badge: 'Writeups' },
        { label: 'Volatility 3 in Tool Vault', sectionId: 'tool-vault', badge: 'Tool Vault' },
        { label: 'DFIR Automation Scripts', sectionId: 'scripts', badge: 'Scripts' },
      ],
    },
    guidedHints: [
      'Tab 1 highlights PID `5180` (`rundll32.exe`) with unbacked `PAGE_EXECUTE_READWRITE` memory.',
      'Tab 2: Test the candidate XOR keys until readable ASCII text starting with `C2=...` appears (`0x5A`).',
      'Tab 3: Paste the decoded C2 domain `telemetry-sync-service.top` (or IP `185.220.101.5`) into the emergency sinkhole block.',
    ],
  },

  'smart-contract': {
    id: 'smart-contract',
    tier: 'tier2',
    tierLabel: 'Tier 2: SOC Analyst',
    xp: 200,
    whyItHappened: {
      summary:
        '`withdrawFunds()` sends ETH via low-level `msg.sender.call{value: amount}("")` on Line 14 *before* updating `balances[msg.sender] -= amount` on Line 16. A malicious contract `fallback()` re-enters `withdrawFunds()` recursively before the balance check changes.',
      identifiers: ['CWE-841 (Improper Enforcement of Behavioral Workflow)', 'SWC-107 (Reentrancy)', 'Checks-Effects-Interactions Violation'],
    },
    howToInvestigate: {
      summary:
        'Web3 security auditors inspect external call ordering and run symbolic/static analyzers before mainnet deployment.',
      checks: [
        'Run `slither .` or Mythril (`myth analyze`) to automatically flag state writes occurring after `.call{value:...}`.',
        'Trace EVM call-stack depth during unit tests (Foundry/Hardhat) to test malicious `receive()`/`fallback()` re-entry.',
        'Monitor on-chain mempool alerts for nested internal transactions hitting withdrawal functions multiple times per tx.',
      ],
    },
    howToFixAndPractice: {
      summary:
        'Follow the Checks-Effects-Interactions pattern strictly and wrap value-transfer functions with OpenZeppelin `ReentrancyGuard`.',
      remediations: [
        'Update storage (`balances[msg.sender] -= amount;`) *before* executing any external `.call{value: amount}("")`.',
        'Inherit OpenZeppelin `ReentrancyGuard` and apply the `nonReentrant` mutex modifier to `withdrawFunds()`.',
        'Consider pull-over-push payment patterns and add adversarial reentrancy Foundry fuzz tests in CI.',
      ],
      links: [
        { label: 'Practice Platforms & Web3 Vault', sectionId: 'resources', badge: 'Practice' },
        { label: 'Ghidra & Static Audit Vault', sectionId: 'tool-vault', badge: 'Tool Vault' },
        { label: 'Member Security Writeups', sectionId: 'writeups', badge: 'Writeups' },
      ],
    },
    guidedHints: [
      'Inspect `withdrawFunds`: click Line 14 (`msg.sender.call{value: amount}("")`) to flag the external call executed before Line 16 updates `balances`.',
      'Click the amber "START EXPLOIT TRANSACTION" button 4 times to watch the call depth drain the vault.',
      'Once drained, click "APPLY OPENZEPPELIN NONREENTRANT HOTFIX" to certify the fix.',
    ],
  },

  'web-exploit-chain': {
    id: 'web-exploit-chain',
    tier: 'tier3',
    tierLabel: 'Tier 3: Principal Responder',
    xp: 250,
    whyItHappened: {
      summary:
        'Three chained flaws amplified each other into Remote Code Execution: an unauthenticated object lookup (IDOR) leaked internal API structure, the JWT middleware accepted unsigned `alg: "none"` tokens, and the uploader trusted PNG magic bytes (`finfo()`) on `.php.png` filenames.',
      identifiers: ['CWE-639 (IDOR / BOLA)', 'CWE-347 (JWT alg:none Downgrade)', 'CWE-434 (Unrestricted File Upload)'],
    },
    howToInvestigate: {
      summary:
        'Principal responders audit authorization consistency across APIs, inspect JWT header validation code, and review web server MIME handler rules.',
      checks: [
        'Replay API requests in Burp Suite / OWASP ZAP swapping object IDs (`ACC-0001`) across low-privilege sessions.',
        'Fuzz JWT `alg` headers with `jwt_tool` to ensure `alg: none` and HS256/RS256 confusion attacks are rejected.',
        'Inspect Apache/Nginx upload handler configs for double-extension execution (`AddHandler` matching `.php.` inside filenames).',
      ],
    },
    howToFixAndPractice: {
      summary:
        'Eliminate every link in the exploit chain so no single bug grants administrative execution.',
      remediations: [
        'Enforce server-side ownership checks (`record.ownerId == session.userId`) on every `/api/v2/*` endpoint.',
        'Pin a single strict verification algorithm list (`algorithms=["HS256"]`) in JWT verification and reject empty signatures.',
        'Store uploads with randomized UUID filenames on non-executable object storage (S3/GCS) and disable script execution in `/uploads`.',
      ],
      links: [
        { label: 'HTB OmniVault Full Writeup', sectionId: 'writeups', badge: 'Writeups' },
        { label: 'OWASP ZAP & Burp Toolkit', sectionId: 'tool-vault', badge: 'Tool Vault' },
        { label: 'PortSwigger Web Security Academy', sectionId: 'resources', badge: 'Practice' },
      ],
    },
    guidedHints: [
      'Stage 1 (IDOR): Query `ACC-0001` (or click "Fill Admin ID") to discover `/internal/v3/firmware-upload`.',
      'Stage 2 (JWT): Switch Role to `cluster-admin` AND Algorithm to `none` to strip HMAC verification.',
      'Stage 3 (Polyglot): Select `PNG_MAGIC`, set Filename ending in `.php.png` (e.g., `backdoor.php.png`), keep `image/png` MIME, and keep PHP `system()` payload.',
    ],
  },

  'binary-rop': {
    id: 'binary-rop',
    tier: 'tier3',
    tierLabel: 'Tier 3: Principal Responder',
    xp: 300,
    whyItHappened: {
      summary:
        'Unbounded `gets()` allowed input larger than the 64-byte stack allocation to overwrite saved RBP (8 bytes) and the saved RIP return address (`72` bytes offset). Even with NX enabled preventing stack shellcode, reusing executable `.text` gadgets (`pop rdi; ret`) yielded `system("/bin/sh")`.',
      identifiers: ['CWE-121 (Stack Buffer Overflow)', 'CWE-242 (Use of Inherently Dangerous gets())', 'MITRE T1203 (Binary Exploitation)'],
    },
    howToInvestigate: {
      summary:
        'Binary defenders and exploit developers audit compiled ELF mitigations and disassembly before shipping native daemons.',
      checks: [
        'Run `checksec --file=./gatekeeper_daemon` to verify Stack Canaries, NX, Full RELRO, and PIE status.',
        'Search source/disassembly with Ghidra or `objdump` for unsafe unbounded functions (`gets`, `strcpy`, `sprintf`, `scanf("%s")`).',
        'Use GDB-PEDA/pwndbg `cyclic` patterns to measure exact stack frame offsets during fuzzing.',
      ],
    },
    howToFixAndPractice: {
      summary:
        'Remove unbounded C string functions and compile production binaries with full hardware/compiler exploit mitigations.',
      remediations: [
        'Replace `gets()` with bounds-checked `fgets(buf, sizeof(buf), stdin)` (POSIX removed `gets` in C11).',
        'Compile with stack smashing protection (`-fstack-protector-strong`), PIE (`-fPIE -pie`), and Full RELRO (`-Wl,-z,relro,-z,now`).',
        'Isolate native C/C++ daemons inside seccomp/AppArmor sandboxes so even a crash cannot yield `uid=0`.',
      ],
      links: [
        { label: 'PicoCTF ret2win Writeup', sectionId: 'writeups', badge: 'Writeups' },
        { label: 'Ghidra in Tool Vault', sectionId: 'tool-vault', badge: 'Tool Vault' },
        { label: 'Pwn Offset Finder Script', sectionId: 'scripts', badge: 'Scripts' },
      ],
    },
    guidedHints: [
      'Step 1 (Offset): `sub rsp, 0x40` allocates 64 bytes + 8 bytes for saved RBP = `72` bytes to reach RIP.',
      'Step 2 (Gadget Chain Order): Add exactly 5 blocks in order -> [1] Padding (72 bytes) -> [2] `pop rdi ; ret` -> [3] `"/bin/sh"` pointer -> [4] `ret` (16-byte alignment) -> [5] `system@plt`.',
      'After dispatching, run `cat flag.txt` in the root shell to grab the binary flag!',
    ],
  },
};
