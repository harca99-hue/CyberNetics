import { Track, ClubEvent, BoardMember, ResourceItem, CtfAchievement } from '../types';

export const CLUB_INFO = {
  name: 'Cyber Netics',
  university: 'Florida Cyber Innovation & Technology Institute',
  established: '2021',
  tagline: 'Defending Florida Systems. Uncovering Exploits. Shaping Cyber Leaders.',
  regularMeeting: 'Every other Friday from 5:00 PM to 7:00 PM — Building 13 Room 105',
  websiteUrl: 'https://cybernetics-club.vercel.app',
  discordInvite: 'https://discord.gg/cybernetics-college',
  githubUrl: 'https://github.com/cybernetics-club',
  ctftimeUrl: 'https://ctftime.org/team/182490',
  contactEmail: 'exec@cybernetics-club.edu',
  activeMembersCount: 240,
  ctfGlobalRank: '#42 Collegiate',
  workshopsCompleted: 68,
  internshipPlacementRate: '94%',
};

export const TRACKS: Track[] = [
  {
    id: 'offensive',
    title: 'Offensive Operations & Red Team',
    tagline: 'Penetration testing, web exploit engineering, and offensive payloads.',
    description: 'Master the mindset and technical arsenal of an ethical attacker. Learn reconnaissance, privilege escalation, Active Directory exploitation, and web vulnerability analysis following industry penetration testing standards.',
    badge: 'Red Team',
    color: 'from-rose-500/20 to-red-600/10 border-rose-500/30 text-rose-400',
    tools: ['Burp Suite Pro', 'Metasploit', 'Nmap', 'BloodHound', 'Impacket', 'Cobalt Strike Lab'],
    skillsLearned: ['Web Sec (OWASP Top 10)', 'Active Directory Kerberoasting', 'Privilege Escalation', 'Custom Exploit Scripts', 'Evasion Basics'],
    sampleProject: 'Constructing an automated vulnerability scanner & breaching an enterprise AD forest in our virtual cyber range.',
    meetingDay: 'Tuesdays 7:00 PM',
  },
  {
    id: 'defensive',
    title: 'Defensive Security & Blue Team (SOC)',
    tagline: 'Incident response, threat hunting, SIEM telemetry, and forensic investigation.',
    description: 'Defend enterprise infrastructure under live simulated cyber warfare. Gain real experience configuring Security Information and Event Management (SIEM), analyzing memory dumps, packet capture inspection, and preparing for the National CCDC competition.',
    badge: 'Blue Team',
    color: 'from-blue-500/20 to-cyan-600/10 border-blue-500/30 text-blue-400',
    tools: ['Splunk', 'Wazuh SIEM', 'Wireshark', 'Suricata IDS', 'Volatility 3', 'Zeek'],
    skillsLearned: ['PCAP Network Forensics', 'Memory & Disk Triage', 'Log Correlation & SIEM Rules', 'Linux/Windows Hardening', 'Incident Response Playbooks'],
    sampleProject: 'Building custom detection rules against simulated ransomware attack vectors in an isolated SOC lab.',
    meetingDay: 'Wednesdays 6:00 PM',
  },
  {
    id: 'reverse-engineering',
    title: 'Reverse Engineering & Binary Exploitation',
    tagline: 'Disassembling unknown binaries, shellcoding, and memory corruption.',
    description: 'Dive beneath high-level languages down to x86/ARM assembly, stack canaries, ROP chains, and Ghidra decompilation. Learn how real-world malware functions and how to craft reliable control-flow hijacks for CTFs.',
    badge: 'Pwn & Rev',
    color: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/30 text-emerald-400',
    tools: ['Ghidra', 'GDB + pwndbg', 'IDA Free', 'x64dbg', 'pwntools (Python)', 'Radare2'],
    skillsLearned: ['Assembly (x86_64)', 'Stack / Heap Overflows', 'Return-Oriented Programming (ROP)', 'Malware Static & Dynamic Triage', 'Decompiler Analysis'],
    sampleProject: 'Reverse engineering a compiled crackme binary to extract hidden flags and bypass license verification logic.',
    meetingDay: 'Mondays 6:30 PM',
  },
  {
    id: 'cloud-sec',
    title: 'Cloud Security & DevSecOps',
    tagline: 'Hardening AWS/GCP, container escapes, IAM auditing, and CI/CD defense.',
    description: 'Modern infrastructure lives in the cloud. We explore misconfigured S3 buckets, privilege escalation in AWS IAM roles, Kubernetes cluster attacks, Terraform policy-as-code, and automated security pipelines.',
    badge: 'Cloud & Infrastructure',
    color: 'from-purple-500/20 to-indigo-600/10 border-purple-500/30 text-purple-400',
    tools: ['AWS / GCP CLI', 'Pacu', 'Prowler', 'Docker / Kube-bench', 'Trivy', 'HashiCorp Terraform'],
    skillsLearned: ['Cloud IAM Privilege Escalation', 'Container Escape Techniques', 'Infrastructure-as-Code Auditing', 'Secrets Leakage Detection', 'Serverless Security'],
    sampleProject: 'Deploying a secure multi-tier microservice architecture guarded by automated CI/CD static application testing (SAST).',
    meetingDay: 'Fridays 5:30 PM',
  },
  {
    id: 'crypto',
    title: 'Applied Cryptography & Privacy',
    tagline: 'Modern cryptographic primitives, mathematical attacks, and privacy protocols.',
    description: 'Explore symmetric/asymmetric algorithms, lattice-based cryptography, elliptic curves, side-channel timing analysis, and breaking broken pseudo-random number generators in CTF challenges.',
    badge: 'Crypto & Math',
    color: 'from-amber-500/20 to-yellow-600/10 border-amber-500/30 text-amber-400',
    tools: ['SageMath', 'Python Cryptography', 'CyberChef', 'Hashcat', 'John the Ripper'],
    skillsLearned: ['RSA Weak Key Attacks', 'Diffie-Hellman & Elliptic Curves', 'Padding Oracle Attacks', 'Frequency Analysis & Polyalphabetic Ciphers', 'Zero-Knowledge Proofs Basics'],
    sampleProject: 'Implementing and subsequently breaking an AES-CBC implementation vulnerable to bit-flipping attacks.',
    meetingDay: 'Thursdays 5:00 PM',
  }
];

export const UPCOMING_EVENTS: ClubEvent[] = [
  {
    id: 'evt-fl-2027-1',
    title: 'BSides St. Pete 2027',
    category: 'Conference',
    eventTypeLabel: 'Training & Conference',
    secondaryCategories: ['Workshop'],
    date: 'Feb 5–6, 2027',
    time: '8:30 AM - 5:30 PM',
    location: 'St. Petersburg / Tampa Bay Hub',
    room: 'Training Labs & Community Tracks',
    city: 'St. Petersburg / Tampa Bay',
    state: 'FL',
    isFloridaEvent: true,
    venueAddress: 'St. Petersburg / Tampa Bay Area, FL',
    difficulty: 'All Levels',
    instructor: 'BSides St. Pete Organizers',
    instructorRole: 'Tampa Bay InfoSec Community',
    description:
      'Community infosec training and conference with hands-on tracks and networking in the Tampa Bay area.',
    prerequisites: ['Open to students, beginners & security practitioners'],
    spotsRemaining: 35,
  },
  {
    id: 'evt-fl-2027-2',
    title: 'Florida Cyber Summit 2027',
    category: 'Conference',
    eventTypeLabel: 'Conference',
    date: 'Mar 2–3, 2027',
    time: '8:00 AM - 5:00 PM',
    location: 'Tampa Convention Hub',
    room: 'Executive Ballroom & Cyber Defense Stage',
    city: 'Tampa',
    state: 'FL',
    isFloridaEvent: true,
    venueAddress: 'Tampa, FL',
    difficulty: 'All Levels',
    instructor: 'Florida Cyber Leadership Coalition',
    instructorRole: 'Threat Defense & Risk Summit',
    description:
      'Florida cyber leadership, threat defense, compliance, and risk summit in Tampa.',
    prerequisites: ['Student ID recommended for collegiate delegation access'],
    spotsRemaining: 30,
  },
  {
    id: 'evt-fl-2027-3',
    title: 'SANS 2027 Orlando',
    category: 'Workshop',
    eventTypeLabel: 'Workshop / Training',
    date: 'Apr 12–17, 2027',
    time: '9:00 AM - 7:00 PM',
    location: 'Hyatt Regency Orlando',
    room: 'Technical Course Suites & NetWars Arena',
    city: 'Orlando',
    state: 'FL',
    isFloridaEvent: true,
    venueAddress: '9801 International Dr, Orlando, FL 32819',
    difficulty: 'All Levels',
    instructor: 'SANS Institute Faculty',
    instructorRole: 'Principal Security Instructors',
    description:
      'Multi-day SANS cybersecurity training week at Hyatt Regency Orlando with technical courses, evening talks, and NetWars.',
    prerequisites: ['Laptop with virtualization support for hands-on labs & NetWars'],
    spotsRemaining: 18,
  },
  {
    id: 'evt-fl-2027-4',
    title: 'BSides South Florida 2027',
    category: 'Conference',
    eventTypeLabel: 'Conference / CTF',
    secondaryCategories: ['CTF', 'Workshop'],
    date: 'May 6, 2027',
    time: '8:30 AM - 6:00 PM',
    location: 'Marriott Harbor Beach Resort & Spa',
    room: 'Main Ballroom, Workshops & CTF Hall',
    city: 'Fort Lauderdale / Miami Metro',
    state: 'FL',
    isFloridaEvent: true,
    venueAddress: '3030 Holiday Dr, Fort Lauderdale, FL 33316',
    difficulty: 'All Levels',
    instructor: 'BSides South Florida Committee',
    instructorRole: 'South Florida Security Community',
    description:
      "South Florida's flagship community security conference at Marriott Harbor Beach Resort & Spa featuring specialized tracks, workshops, and a CTF.",
    prerequisites: ['Bring laptop for hands-on workshops & live CTF track'],
    spotsRemaining: 28,
  },
  {
    id: 'evt-fl-2027-5',
    title: 'SANS ICS Security Summit & Training 2027',
    category: 'Conference',
    eventTypeLabel: 'Conference / Workshop',
    secondaryCategories: ['Workshop'],
    date: 'Jun 7–15, 2027',
    time: '8:30 AM - 5:30 PM',
    location: 'Orlando ICS/OT Summit Center',
    room: 'OT Control Lab & Summit Main Stage',
    city: 'Orlando',
    state: 'FL',
    isFloridaEvent: true,
    venueAddress: 'Orlando, FL',
    difficulty: 'Intermediate',
    instructor: 'SANS ICS Fellows & Critical Infrastructure Leads',
    instructorRole: 'ICS / OT Cyber Defense',
    description:
      'Industrial Control Systems (ICS) and Operational Technology (OT) security summit and training courses in Orlando.',
    prerequisites: ['Foundational networking & industrial protocol familiarity recommended'],
    spotsRemaining: 16,
  },
];

export const BOARD_MEMBERS: BoardMember[] = [
  {
    id: 'board-1',
    name: 'Maya Lin',
    role: 'President',
    major: 'Computer Science (Cybersecurity Specialization)',
    year: 'Senior',
    certifications: ['Security+', 'eJPTv2'],
    focus: 'Enterprise Pentesting & Organization Leadership',
    bio: 'Interned as a security analyst at Mandiant. Passionate about empowering students of all backgrounds to explore ethical security without feeling intimidated.',
    handle: '0xMaya',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'board-2',
    name: 'Alex Chen',
    role: 'Vice President & CTF Captain',
    major: 'Computer Engineering',
    year: 'Senior',
    certifications: ['OSCP', 'CRTO'],
    focus: 'Binary Exploitation & Red Teaming',
    bio: 'Defcon CTF finalist and active bug bounty hunter. Manages our weekly CTF challenge repository and trains our collegiate competition roster.',
    handle: 'NullPointer',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'board-3',
    name: 'Elena Rostova',
    role: 'Head of Defensive Operations',
    major: 'Information Systems & Cybersecurity',
    year: 'Junior',
    certifications: ['CompTIA CySA+', 'BTL1'],
    focus: 'Blue Teaming, Incident Response, SIEM Engineering',
    bio: 'Leads our CCDC defensive team. Spent the last summer hardening cloud Kubernetes workloads at a fintech startup.',
    handle: 'AegisShield',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'board-4',
    name: 'Devon Wright',
    role: 'Director of Education & Workshops',
    major: 'Software Engineering',
    year: 'Junior',
    certifications: ['AWS Certified Security', 'Network+'],
    focus: 'Cloud Architecture & Beginner Curriculum',
    bio: 'Builds beginner-friendly cyber labs and guides newcomers through their first command line scripts, CTF flags, and Linux installations.',
    handle: 'CloudBreaker',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'board-5',
    name: 'Sarah Gomez',
    role: 'Treasurer & Industry Relations',
    major: 'Computer Science & Business',
    year: 'Junior',
    certifications: ['Security+'],
    focus: 'Cyber Governance, Sponsorships & Alumni Network',
    bio: 'Connects Cyber Netics with defense contractors, tech firms, and alumni recruiters. Coordinates our annual tech career mixer and hardware grants.',
    handle: 'CipherByte',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  }
];

export const CTF_ACHIEVEMENTS: CtfAchievement[] = [
  {
    event: 'National Cyber League (NCL) Spring',
    year: '2026',
    rank: 'Top 3% Nationally',
    totalTeams: '3,800+ Students',
    highlight: 'Gold Bracket placement in Cryptography & Log Analysis'
  },
  {
    event: 'Collegiate Cyber Defense Competition (CCDC)',
    year: '2025',
    rank: '2nd Place Regional Finalist',
    totalTeams: '48 Universities',
    highlight: 'Zero critical service downtime under 8 hours of live red team assault'
  },
  {
    event: 'CSAW CTF Qualification Round',
    year: '2025',
    rank: 'Rank #38 Worldwide',
    totalTeams: '1,200+ Teams',
    highlight: 'First blood on the "Quantum-AES" reverse engineering binary challenge'
  },
  {
    event: 'HackTheBox University CTF',
    year: '2024',
    rank: 'Rank #22 Global',
    totalTeams: '950+ Universities',
    highlight: 'Solved 100% of Web & Forensic problem sets'
  }
];

export const CURATED_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'OverTheWire: Bandit Wargame',
    category: 'Platform',
    description: 'The golden standard for mastering Linux command line, file permissions, SSH tunneling, networking fundamentals, and shell scripting.',
    url: 'https://overthewire.org/wargames/bandit/',
    tags: ['Linux', 'Wargames', 'Beginner', 'CLI', 'Free'],
    recommendedFor: 'Every new Cyber Netics recruit & Linux beginners'
  },
  {
    id: 'res-2',
    title: 'PortSwigger Web Security Academy',
    category: 'Platform',
    description: 'Free interactive web vulnerability labs covering SQLi, XSS, CSRF, SSRF, JWT bypass, and business logic flaws by the makers of Burp Suite.',
    url: 'https://portswigger.net/web-security',
    tags: ['Web Sec', 'Burp Suite', 'OWASP', 'Labs', 'Free'],
    recommendedFor: 'Offensive Track & Web Application Security enthusiasts'
  },
  {
    id: 'res-3',
    title: 'PicoCTF by Carnegie Mellon',
    category: 'Platform',
    description: 'A beginner-friendly gamified cyber competition with continuous learning problems across forensics, cryptography, reverse engineering, and binary exploitation.',
    url: 'https://picoctf.org',
    tags: ['CTF', 'Beginner', 'Reverse Eng', 'Crypto', 'Free'],
    recommendedFor: 'Freshmen, first-time CTF players & collegiate qualifiers'
  },
  {
    id: 'res-4',
    title: 'CyberChef — The Cyber Swiss Army Knife',
    category: 'Toolkit',
    description: 'Indispensable browser-based tool by GCHQ for decoding hex, base64, XOR, hashing, data carving, and manipulating complex cryptographic data formats.',
    url: 'https://gchq.github.io/CyberChef/',
    tags: ['Crypto', 'Decoding', 'Utility', 'Deobfuscation', 'Free'],
    recommendedFor: 'All cybersecurity practitioners & CTF competitors'
  },
  {
    id: 'res-5',
    title: 'TryHackMe: Hands-on Cyber Training',
    category: 'Platform',
    description: 'Guided virtual browser-based labs and structured career paths covering offensive penetration testing, defensive SOC analysis, and network fundamentals.',
    url: 'https://tryhackme.com',
    tags: ['Hands-on', 'SOC', 'Red Team', 'Labs', 'Free Tier'],
    recommendedFor: 'Foundational learning & guided walkthrough rooms'
  },
  {
    id: 'res-6',
    title: 'Hack The Box (HTB) Labs & Academy',
    category: 'Platform',
    description: 'Industry-standard penetration testing wargames and live vulnerable virtual machines for active red teaming, privilege escalation, and Active Directory.',
    url: 'https://www.hackthebox.com',
    tags: ['Pentesting', 'Active Directory', 'PrivEsc', 'Wargames', 'Free Tier'],
    recommendedFor: 'Advanced red teamers & OSCP certification prep'
  },
  {
    id: 'res-7',
    title: 'Blue Team Labs Online (BTLO)',
    category: 'Platform',
    description: 'Gamified defensive cybersecurity training platform focusing on real-world incident response, digital forensics, SIEM log analysis, and threat hunting.',
    url: 'https://blueteamlabs.online',
    tags: ['Blue Team', 'DFIR', 'SIEM', 'Threat Hunting', 'Free Tier'],
    recommendedFor: 'Defensive Operations & SOC analyst career track'
  },
  {
    id: 'res-8',
    title: 'DefendTheWeb Interactive Security Platform',
    category: 'Platform',
    description: 'Interactive cybersecurity learning platform with over 60+ challenges, articles, and playground exercises covering security fundamentals and hacking.',
    url: 'https://defendtheweb.net',
    tags: ['Web Sec', 'Logic Flaws', 'Crypto', 'Challenges', 'Free'],
    recommendedFor: 'Hands-on web exploit defense & secure coding'
  },
  {
    id: 'res-pwn-college',
    title: 'pwn.college',
    category: 'Platform',
    description: 'Free collegiate binary exploitation, reverse engineering, and system security curriculum created by ASU cybersecurity faculty.',
    url: 'https://pwn.college/',
    tags: ['Pwn', 'Binary Exploit', 'Reverse Eng', 'Linux', 'Free'],
    recommendedFor: 'Reverse Engineering & Systems Security track learners'
  },
  {
    id: 'res-letsdefend',
    title: 'LetsDefend',
    category: 'Platform',
    description: 'Free-tier browser-based SOC analyst simulator, SIEM alert queue, and incident response playbooks for hands-on threat investigation.',
    url: 'https://letsdefend.io/',
    tags: ['SOC', 'SIEM', 'Blue Team', 'Incident Response', 'Free Tier'],
    recommendedFor: 'Aspiring SOC analysts & Defensive Security operators'
  }
];

export const TERMINAL_EASTER_EGG = {
  challenge: 'Decode this base64 string to claim the rookie hacker flag: Q1lCRVJORVRJQ1N7aDRjazNyXzIwMjZfbjN0aWNzfQ==',
  flag: 'CYBERNETICS{h4ck3r_2026_n3tics}',
  reward: 'Verified Recruit Badge (Unlocks VIP application priority!)'
};

export { MEMBER_SCRIPTS, OPEN_SOURCE_TOOLS } from './writeupsAndToolsData';
