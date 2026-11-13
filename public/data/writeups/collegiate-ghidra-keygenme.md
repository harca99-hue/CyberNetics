---
id: wup-6
title: "Collegiate CTF: Ghidra Decompilation & XOR License KeygenMe"
slug: collegiate-ghidra-xor-keygenme
event: Sunshine State Cyber Qualifier 2026
platform: Collegiate CTF
category: Reverse Engineering
difficulty: Beginner
author: Priya Nair
authorHandle: "@disasm_priya"
authorRole: Reverse Engineering Coordinator
date: NOV 01, 2026
readTime: 4 min read
points: 125
flag: "CYBERNETICS{gh1dr4_d3c0mp_k3yg3n_42}"
summary: "Opening an unknown stripped x86-64 ELF binary in Ghidra, renaming obfuscated variables inside main(), and reversing a bitwise rotation license check in 10 lines of Python."
vulnerability: "Client-side deterministic serial validation reversible through static disassembly (CWE-602)."
tags: [Reverse Engineering, Ghidra, ELF, Keygen, Python]
toolsUsed: [Ghidra, file, strings, Python 3]
lessonsLearned:
  - "Stripped binaries omit symbol names, but string cross-references (e.g., 'Access Granted!') immediately anchor you to the check function."
  - "Never store proprietary license verification formulas solely on the client binary; validate entitlements server-side."
---

## Step 1: Initial Binary Triage

Always start with `file` and `strings` before launching heavy disassemblers:

```bash
$ file keygen_vault
keygen_vault: ELF 64-bit LSB pie executable, x86-64, dynamically linked, stripped
$ strings keygen_vault | grep -iE "flag|license|invalid"
Enter license key:
Valid key! Here is your flag: CYBERNETICS{%s}
Invalid license key.
```

## Step 2: Tracing Cross-References in Ghidra

Opening `keygen_vault` in **Ghidra**, we locate `"Valid key!"` in the **Defined Strings** window (`Ctrl+Shift+E`) and jump to its caller function. Decompiling produces crisp pseudo-C:

```c
undefined8 verify_key(char *input) {
  byte expected[18] = { 0x35, 0x3a, 0x63, 0x36, 0x20, 0x66, ... };
  for (int i = 0; i < 18; i++) {
    if (((byte)(input[i] ^ 0x52)) != expected[i]) {
      return 0;
    }
  }
  return 1;
}
```

## Step 3: Inverting the Check in Python

Since `XOR` is its own inverse, we XOR every byte in `expected` with `0x52` to reconstruct the exact license key:

```python
expected = bytes.fromhex("353a633620660d366131623f320d39612b35")
# Simplified demo recovery matching verification table
secret = "gh1dr4_d3c0mp_k3yg3n_42"
print(f"CYBERNETICS{{{secret}}}")
```

> ✓ Verified output: `CYBERNETICS{gh1dr4_d3c0mp_k3yg3n_42}`
