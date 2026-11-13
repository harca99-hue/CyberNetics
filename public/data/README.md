# Cyber Netics — Adding New CTF Writeups (Board Guide)

Executive board members can publish new CTF walkthroughs and exploit writeups without modifying any React or TypeScript files.

## Option A: Drop-in Markdown File (Recommended)

1. Create a `.md` file inside `public/data/writeups/` (for example `public/data/writeups/picoctf-2026-heap.md`).
2. Add YAML-style frontmatter at the top of the file:

```markdown
---
id: wup-7
title: "PicoCTF: Heap Exploitation Basics"
event: PicoCTF 2026
platform: PicoCTF
category: Binary Exploitation
difficulty: Intermediate
author: Your Name
authorHandle: "@yourhandle"
authorRole: CTF Team Member
date: NOV 15, 2026
readTime: 5 min read
points: 250
flag: "picoCTF{example_flag}"
summary: "One-paragraph summary shown on the blog card."
vulnerability: "Use-after-free in custom allocator"
tags: [Heap, UAF, pwntools]
toolsUsed: [gdb, pwntools]
lessonsLearned:
  - "Zero out pointers immediately after free()."
---

## Step 1: Recon

Your markdown walkthrough goes here with fenced code blocks and `inline code`.
```

3. Register the file inside `public/data/writeups.json`:

```json
{
  "id": "wup-7",
  "markdownUrl": "/data/writeups/picoctf-2026-heap.md"
}
```

## Option B: Inline JSON Entry

You can also add a full JSON object directly into the `"writeups"` array in `public/data/writeups.json` using either `"steps": [...]` or `"markdownBody": "## Step 1..."`.
