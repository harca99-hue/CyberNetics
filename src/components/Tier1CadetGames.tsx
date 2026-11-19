import React, { useState, useRef, useEffect } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Code,
  Compass,
  FileCode,
  HelpCircle,
  Lightbulb,
  Lock,
  Mail,
  Network,
  Play,
  Search,
  ShieldAlert,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { WarRoomModuleId } from '../types';
import { WAR_ROOM_DEBRIEFS } from '../data/warRoomDebriefs';

/* ========================================================================= */
/* SHARED: GUIDED HINT TOGGLE & POST-ACTION DEBRIEF CARD                     */
/* ========================================================================= */

export const GuidedHintToggle: React.FC<{
  hints: string[];
  label?: string;
}> = ({ hints, label = 'Guided Hint' }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="px-3 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-700/50 text-amber-300 text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
        <span>{open ? `Hide ${label}` : label}</span>
      </button>

      {open && (
        <div className="p-3.5 rounded-xl bg-amber-950/25 border border-amber-700/50 text-xs font-mono text-amber-100/90 space-y-1.5 animate-fadeIn">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> STEP-BY-STEP GUIDED HINTS:
          </div>
          {hints.map((hint, idx) => (
            <p key={idx} className="text-slate-200 leading-relaxed">
              <span className="text-amber-400 font-bold">{idx + 1}.</span> {hint}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export const PostActionDebrief: React.FC<{
  moduleId: WarRoomModuleId;
  isCompleted: boolean;
}> = ({ moduleId, isCompleted }) => {
  if (!isCompleted) return null;

  const debrief = WAR_ROOM_DEBRIEFS[moduleId];
  if (!debrief) return null;

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#081523] via-[#070f1d] to-[#08131d] border border-emerald-500/45 shadow-[0_0_30px_rgba(16,185,129,0.12)] overflow-hidden">
      {/* Debrief Header */}
      <div className="px-5 py-3.5 bg-emerald-950/40 border-b border-emerald-800/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 font-bold">
              POST-ACTION DEBRIEF // {debrief.tierLabel.toUpperCase()}
            </div>
            <h4 className="text-sm font-bold font-mono text-white">
              Why It Happened &amp; Real-World Remediation
            </h4>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>+{debrief.xp} XP UNLOCKED</span>
        </span>
      </div>

      {/* Three Structured Debrief Columns */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
        {/* 1. Why It Happened (Root Cause) */}
        <div className="p-4 rounded-xl bg-[#050a14] border border-rose-900/50 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-rose-300 font-mono font-bold uppercase tracking-wider text-[11px]">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>1. Why It Happened (Root Cause)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {debrief.whyItHappened.summary}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
            {debrief.whyItHappened.identifiers.map((id) => (
              <span
                key={id}
                className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/50 text-rose-200 font-mono text-[10px]"
              >
                {id}
              </span>
            ))}
          </div>
        </div>

        {/* 2. How to Investigate & Spot It in the Real World */}
        <div className="p-4 rounded-xl bg-[#050a14] border border-cyan-900/50 space-y-2.5">
          <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold uppercase tracking-wider text-[11px]">
            <Search className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>2. How to Investigate &amp; Spot It</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {debrief.howToInvestigate.summary}
          </p>
          <ul className="space-y-2 pt-1 text-slate-300">
            {debrief.howToInvestigate.checks.map((chk, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-cyan-400 font-mono font-bold mt-0.5">›</span>
                <span>{chk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. How to Fix & Practice Further */}
        <div className="p-4 rounded-xl bg-[#050a14] border border-emerald-900/50 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-300 font-mono font-bold uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>3. How to Fix &amp; Practice Further</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {debrief.howToFixAndPractice.summary}
            </p>
            <ul className="space-y-2 pt-1 text-slate-300">
              {debrief.howToFixAndPractice.remediations.map((rem, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Jump Links to Club Resources */}
          <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
              <Compass className="w-3 h-3 text-cyan-400" />
              <span>Continue Training in Cyber Netics:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {debrief.howToFixAndPractice.links.map((lnk) => (
                <button
                  key={lnk.label}
                  type="button"
                  onClick={() => scrollToSection(lnk.sectionId)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/70 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 text-[10px] font-mono transition-colors cursor-pointer"
                >
                  <span>{lnk.label}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* TIER 1 GAME A: PYTHON SECURE CODE PATCHER (APPSEC, +150 XP)               */
/* ========================================================================= */

interface Tier1ModuleProps {
  soundEnabled: boolean;
  isCompleted: boolean;
  onComplete: () => void;
  playSound: (type: 'success' | 'error' | 'click' | 'powerup' | 'alarm' | 'keystroke', enabled?: boolean) => void;
}

interface PythonChallenge {
  id: 'cmdi' | 'sqli' | 'secrets';
  title: string;
  cwe: string;
  vulnerableCode: string;
  testPayloadLabel: string;
  testPayloadInput: string;
  options: {
    id: string;
    label: string;
    code: string;
    isSecure: boolean;
    failOutput: string;
    passOutput: string;
  }[];
  validateCustomCode: (code: string) => { ok: boolean; output: string };
}

const PYTHON_CHALLENGES: PythonChallenge[] = [
  {
    id: 'cmdi',
    title: '1. OS Command Injection (os.system)',
    cwe: 'CWE-78',
    vulnerableCode: `import os

def ping_host(user_host: str):
    # VULNERABLE: Passes unsanitized input straight to /bin/sh
    return os.system("ping -c 1 " + user_host)`,
    testPayloadLabel: 'Malicious Input Payload',
    testPayloadInput: '8.8.8.8; cat /etc/shadow',
    options: [
      {
        id: 'blacklist',
        label: 'Strip semicolons with .replace(";", "")',
        code: `def ping_host(user_host: str):
    cleaned = user_host.replace(";", "")
    return os.system("ping -c 1 " + cleaned)`,
        isSecure: false,
        failOutput: `[-] TEST PAYLOAD BYPASS (Bypassed via '8.8.8.8 && id' / '$()'):
    Blacklist only removed ';'. Shell interpreter still executes chained commands!
    Exit status: VULNERABLE (RCE possible via &&, |, or \`...\`).`,
        passOutput: '',
      },
      {
        id: 'shell-true',
        label: 'Use subprocess.run with shell=True',
        code: `import subprocess

def ping_host(user_host: str):
    return subprocess.run(f"ping -c 1 {user_host}", shell=True)`,
        isSecure: false,
        failOutput: `[-] TEST PAYLOAD EXECUTED 'cat /etc/shadow':
    subprocess.run(..., shell=True) still invokes /bin/sh -c!
    Attacker payload triggered root shadow file read attempt.`,
        passOutput: '',
      },
      {
        id: 'arg-array',
        label: 'Validate IP/Host + subprocess.run([...], shell=False)',
        code: `import ipaddress, subprocess

def ping_host(user_host: str):
    ip = str(ipaddress.ip_address(user_host.strip()))
    return subprocess.run(["ping", "-c", "1", ip], shell=False, check=True)`,
        isSecure: true,
        failOutput: '',
        passOutput: `[+] PAYLOAD TEST PASSED:
    ipaddress.ip_address("8.8.8.8; cat /etc/shadow") -> ValueError rejected!
    Valid IPs execute via execve(["ping", "-c", "1", ip]) with shell=False.
    CWE-78 OS Command Injection patched!`,
      },
    ],
    validateCustomCode: (code: string) => {
      const hasSubprocess = code.includes('subprocess.run') && !code.includes('shell=True');
      const noOsSystem = !code.includes('os.system');
      const usesList = code.includes('[') && code.includes('ping');
      if (hasSubprocess && noOsSystem && usesList) {
        return {
          ok: true,
          output: `[+] CUSTOM PATCH PASSED:
    Detected subprocess.run([...]) without shell=True or os.system().
    Payload "8.8.8.8; cat /etc/shadow" treated strictly as a literal argv argument.`,
        };
      }
      return {
        ok: false,
        output: `[-] CUSTOM PATCH FAILED:
    Ensure os.system() and shell=True are removed and use subprocess.run(["ping", ...], shell=False).`,
      };
    },
  },
  {
    id: 'sqli',
    title: '2. SQL Injection (f-string Interpolation)',
    cwe: 'CWE-89',
    vulnerableCode: `def find_user(cursor, username: str):
    # VULNERABLE: Attacker input alters SQL syntax tree
    query = f"SELECT id, role FROM users WHERE username = '{username}'"
    return cursor.execute(query).fetchone()`,
    testPayloadLabel: 'Auth Bypass SQLi Payload',
    testPayloadInput: "' OR '1'='1' --",
    options: [
      {
        id: 'replace-quote',
        label: 'Remove spaces before interpolating f-string',
        code: `def find_user(cursor, username: str):
    safe = username.replace(" ", "")
    return cursor.execute(f"SELECT id, role FROM users WHERE username = '{safe}'").fetchone()`,
        isSecure: false,
        failOutput: `[-] TEST PAYLOAD BYPASS (Bypassed via "'/**/OR/**/1=1--"):
    Comment tokens /**/ replace whitespace in SQLite/MySQL/Postgres!
    Returned admin row unexpectedly.`,
        passOutput: '',
      },
      {
        id: 'parameterized',
        label: 'Use Parameterized Prepared Statement (?, (username,))',
        code: `def find_user(cursor, username: str):
    query = "SELECT id, role FROM users WHERE username = ?"
    return cursor.execute(query, (username,)).fetchone()`,
        isSecure: true,
        failOutput: '',
        passOutput: `[+] PAYLOAD TEST PASSED:
    SQLite/DB Driver bound "' OR '1'='1' --" as literal string value.
    Prepared AST unchanged -> 0 rows returned, Admin bypass blocked!`,
      },
      {
        id: 'double-quote',
        label: 'Switch single quotes to double quotes',
        code: `def find_user(cursor, username: str):
    return cursor.execute(f'SELECT id, role FROM users WHERE username = "{username}"').fetchone()`,
        isSecure: false,
        failOutput: `[-] TEST PAYLOAD EXECUTED:
    Payload '" OR "1"="1" --' immediately breaks out of double-quoted literals.`,
        passOutput: '',
      },
    ],
    validateCustomCode: (code: string) => {
      const noFstring = !code.includes('f"SELECT') && !code.includes("f'SELECT") && !code.includes('+ username');
      const hasParam = code.includes('?') || code.includes('%s') || code.includes(':username');
      if (noFstring && hasParam && code.includes('cursor.execute')) {
        return {
          ok: true,
          output: `[+] CUSTOM PATCH PASSED:
    Parameterized placeholder detected with tuple binding and zero string interpolation.`,
        };
      }
      return {
        ok: false,
        output: `[-] CUSTOM PATCH FAILED:
    Remove f-string / + concatenation and bind (username,) via '?' or '%s' placeholder.`,
      };
    },
  },
  {
    id: 'secrets',
    title: '3. Hardcoded Signing & Cloud Secrets',
    cwe: 'CWE-798',
    vulnerableCode: `# VULNERABLE: Plaintext secrets committed directly in git repository
JWT_SIGNING_SECRET = "CyberNetics_Prod_Secret_2025!"
AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE"`,
    testPayloadLabel: 'Pre-Commit Secret Scanner',
    testPayloadInput: 'gitleaks detect --source=. --verbose',
    options: [
      {
        id: 'base64',
        label: 'Encode secrets with base64.b64encode',
        code: `import base64
JWT_SIGNING_SECRET = base64.b64decode("Q3liZXJOZXRpY3NfUHJvZF9TZWNyZXRfMjAyNSE=").decode()`,
        isSecure: false,
        failOutput: `[-] GITLEAKS SCAN FAILED:
    Base64 is encoding, not encryption! High-entropy blob decoded automatically by scanners.
    Repository leak alert remains CRITICAL.`,
        passOutput: '',
      },
      {
        id: 'env-vars',
        label: 'Load from os.environ[...] without hardcoded fallback',
        code: `import os

JWT_SIGNING_SECRET = os.environ["JWT_SIGNING_SECRET"]
AWS_ACCESS_KEY_ID = os.environ["AWS_ACCESS_KEY_ID"]`,
        isSecure: true,
        failOutput: '',
        passOutput: `[+] GITLEAKS SCAN CLEAN (0 LEAKS DETECTED):
    Secrets are injected exclusively from runtime environment / KMS vault.
    Fail-fast KeyError prevents silent fallback to insecure defaults!`,
      },
      {
        id: 'default-fallback',
        label: 'Use os.getenv with hardcoded fallback secret',
        code: `import os
JWT_SIGNING_SECRET = os.getenv("JWT_SIGNING_SECRET", "CyberNetics_Prod_Secret_2025!")`,
        isSecure: false,
        failOutput: `[-] GITLEAKS SCAN FAILED:
    Fallback string still embeds the production signing secret directly in source control!`,
        passOutput: '',
      },
    ],
    validateCustomCode: (code: string) => {
      const usesEnv = code.includes('os.environ') || code.includes('os.getenv');
      const leaksKey = code.includes('CyberNetics_Prod_Secret') || code.includes('AKIAIOSFODNN7EXAMPLE');
      if (usesEnv && !leaksKey) {
        return {
          ok: true,
          output: `[+] CUSTOM PATCH PASSED:
    No hardcoded credentials detected. Environment lookup verified cleanly.`,
        };
      }
      return {
        ok: false,
        output: `[-] CUSTOM PATCH FAILED:
    Remove literal secret strings completely and read from os.environ[...].`,
      };
    },
  },
];

export const PythonAppSecPatcherModule: React.FC<Tier1ModuleProps> = ({
  soundEnabled,
  isCompleted,
  onComplete,
  playSound,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [editMode, setEditMode] = useState(false);
  const [customCode, setCustomCode] = useState<Record<string, string>>({});
  const [testLogs, setTestLogs] = useState<Record<string, { ok: boolean; text: string }>>({});
  const [passedMap, setPassedMap] = useState<Record<string, boolean>>({});

  const current = PYTHON_CHALLENGES[activeIdx];
  const debrief = WAR_ROOM_DEBRIEFS['python-appsec-patcher'];

  const handleSelectOption = (optId: string, code: string) => {
    playSound('click', soundEnabled);
    setSelectedOptions((prev) => ({ ...prev, [current.id]: optId }));
    setCustomCode((prev) => ({ ...prev, [current.id]: code }));
  };

  const handleRunPayloadCheck = () => {
    playSound('click', soundEnabled);
    const chosenId = selectedOptions[current.id];
    const edited = customCode[current.id];

    let ok = false;
    let text = '';

    if (editMode && edited) {
      const res = current.validateCustomCode(edited);
      ok = res.ok;
      text = res.output;
    } else if (chosenId) {
      const opt = current.options.find((o) => o.id === chosenId);
      if (opt) {
        ok = opt.isSecure;
        text = opt.isSecure ? opt.passOutput : opt.failOutput;
      }
    } else {
      setTestLogs((prev) => ({
        ...prev,
        [current.id]: { ok: false, text: '[!] Select one of the remediation patches first, or enable Custom Code Editor.' },
      }));
      playSound('error', soundEnabled);
      return;
    }

    setTestLogs((prev) => ({ ...prev, [current.id]: { ok, text } }));

    if (ok) {
      playSound('success', soundEnabled);
      const nextPassed = { ...passedMap, [current.id]: true };
      setPassedMap(nextPassed);

      if (PYTHON_CHALLENGES.every((c) => nextPassed[c.id])) {
        playSound('powerup', soundEnabled);
        onComplete();
      }
    } else {
      playSound('error', soundEnabled);
    }
  };

  const patchedCount = PYTHON_CHALLENGES.filter((c) => passedMap[c.id] || isCompleted).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-700/70 px-2 py-0.5 rounded">
              TIER 1: CADET FOUNDATIONS · APPSEC
            </span>
            <span className="text-xs font-mono text-slate-400">
              PATCHED: {patchedCount} / {PYTHON_CHALLENGES.length} SNIPPETS
            </span>
          </div>
          <h3 className="text-xl font-bold font-mono text-white">Python Secure Code Patcher</h3>
          <p className="text-xs text-slate-400">
            Inspect 3 classic Python security bugs, pick or author the secure remediation, and run the live attack payload verifier to earn +150 XP.
          </p>
        </div>

        <GuidedHintToggle hints={debrief.guidedHints} />
      </div>

      {/* Challenge Step Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {PYTHON_CHALLENGES.map((ch, idx) => {
          const done = Boolean(passedMap[ch.id] || isCompleted);
          const active = idx === activeIdx;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => {
                setActiveIdx(idx);
                playSound('keystroke', soundEnabled);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                active
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : done
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700/60'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <FileCode className="w-3.5 h-3.5" />}
              <span>{ch.title}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Patch Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Vulnerable Source & Payload */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl bg-[#050914] border border-rose-900/50 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-rose-400 font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> VULNERABLE PYTHON SNIPPET ({current.cwe})
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300">
                UNPATCHED
              </span>
            </div>
            <pre className="p-3 rounded-lg bg-[#090f1d] border border-slate-800 text-slate-200 text-[11px] font-mono overflow-x-auto leading-relaxed">
              {current.vulnerableCode}
            </pre>

            <div className="p-2.5 rounded-lg bg-amber-950/25 border border-amber-800/50 text-xs font-mono">
              <span className="text-amber-400 font-bold">{current.testPayloadLabel}: </span>
              <code className="text-amber-200 break-all">{current.testPayloadInput}</code>
            </div>
          </div>

          {/* Payload Test Console */}
          <div className="p-4 rounded-xl bg-[#050914] border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> SANDBOX PAYLOAD TEST OUTPUT
              </span>
              <span>pytest-sec // runner</span>
            </div>
            <pre
              className={`p-3 rounded-lg bg-[#090f1d] border min-h-[110px] text-[11px] whitespace-pre-wrap leading-relaxed ${
                testLogs[current.id]
                  ? testLogs[current.id].ok
                    ? 'border-emerald-700/60 text-emerald-300'
                    : 'border-rose-700/60 text-rose-300'
                  : 'border-slate-800 text-slate-500'
              }`}
            >
              {testLogs[current.id]?.text ||
                'Select a candidate patch on the right and click "Run Test Payload" to verify the fix against adversarial input.'}
            </pre>
          </div>
        </div>

        {/* Right: Patch Selector or Custom Editor */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-[#050914] border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <Code className="w-4 h-4" /> SELECT OR EDIT SECURITY PATCH
              </span>
              <button
                type="button"
                onClick={() => {
                  setEditMode((prev) => !prev);
                  if (!customCode[current.id]) {
                    setCustomCode((prev) => ({ ...prev, [current.id]: current.vulnerableCode }));
                  }
                }}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono text-cyan-300 cursor-pointer"
              >
                {editMode ? 'Switch to Choice Mode' : 'Edit Custom Code'}
              </button>
            </div>

            {!editMode ? (
              <div className="space-y-2.5">
                {current.options.map((opt) => {
                  const isPicked = selectedOptions[current.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id, opt.code)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        isPicked
                          ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.18)]'
                          : 'bg-[#090f1d] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-white">{opt.label}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${isPicked ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'border-slate-700 text-slate-500'}`}>
                          {isPicked ? 'Selected' : 'Select'}
                        </span>
                      </div>
                      <pre className="p-2.5 rounded bg-[#040710] border border-slate-800/80 text-[10px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
                        {opt.code}
                      </pre>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-[11px] font-mono text-slate-400 block">
                  Modify the Python patch below and run the payload checker:
                </label>
                <textarea
                  rows={10}
                  value={customCode[current.id] ?? current.vulnerableCode}
                  onChange={(e) => setCustomCode((prev) => ({ ...prev, [current.id]: e.target.value }))}
                  className="w-full p-3 rounded-xl bg-[#090f1d] border border-slate-700 focus:border-cyan-400 text-xs font-mono text-cyan-200 focus:outline-none leading-relaxed"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleRunPayloadCheck}
              className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Play className="w-4 h-4" />
              <span>RUN TEST PAYLOAD</span>
            </button>

            {passedMap[current.id] && activeIdx < PYTHON_CHALLENGES.length - 1 && (
              <button
                type="button"
                onClick={() => setActiveIdx((idx) => idx + 1)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs cursor-pointer"
              >
                Next Snippet →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Post-Action Debrief */}
      <PostActionDebrief moduleId="python-appsec-patcher" isCompleted={isCompleted} />
    </div>
  );
};

/* ========================================================================= */
/* TIER 1 GAME B: LINUX & CLI DEFENSE LAB (OS HARDENING, +150 XP)            */
/* ========================================================================= */

export const LinuxCliDefenseModule: React.FC<Tier1ModuleProps> = ({
  soundEnabled,
  isCompleted,
  onComplete,
  playSound,
}) => {
  const [envSecured, setEnvSecured] = useState(isCompleted);
  const [beaconKilled, setBeaconKilled] = useState(isCompleted);
  const [cmdInput, setCmdInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'Cyber Netics Linux Hardening Range (Ubuntu 24.04 LTS)',
    'Alert: File permissions drift & suspicious outbound process flagged on node cadet-ops-01.',
    'Type "help" to list commands, "ls -la" to inspect directory, or "ps" to check processes.',
  ]);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const debrief = WAR_ROOM_DEBRIEFS['linux-cli-defense'];
  const TRAINING_FLAG = 'CYBERNETICS{chmod_600_cron_h4rd3n3d}';

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    playSound('keystroke', soundEnabled);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const out: string[] = [`cadet@sec-lab:~/ops$ ${trimmed}`];

    let nextEnvSecured = envSecured;
    let nextBeaconKilled = beaconKilled;

    if (cmd === 'help') {
      out.push(
        'Available Commands:',
        '  ls, ls -la        List directory contents & POSIX permission bits',
        '  cat <file>        Inspect file contents (notes.txt, .env_backup, cron_audit.log)',
        '  chmod 600 <file>  Restrict secret file permissions to owner read/write only',
        '  ps, ps aux        Inspect active running processes',
        '  kill <pid>        Terminate a running process by PID',
        '  grep <word> <f>   Search text inside a file',
        '  pwd | whoami      Print current path / user identity',
        '  clear             Clear terminal output'
      );
    } else if (cmd === 'clear') {
      setHistory([]);
      setCmdInput('');
      return;
    } else if (cmd === 'pwd') {
      out.push('/home/cadet/ops');
    } else if (cmd === 'whoami' || cmd === 'id') {
      out.push('uid=1001(cadet) gid=1001(secops) groups=1001(secops),27(sudo)');
    } else if (cmd === 'ls') {
      const showHidden = args.some((a) => a.includes('a') || a.includes('l'));
      if (showHidden) {
        out.push(
          'total 24',
          'drwxr-x--- 2 cadet secops 4096 Nov 19 07:10 .',
          'drwxr-xr-x 5 root  root   4096 Nov 01 09:00 ..',
          `${envSecured ? '-rw-------' : '-rw-rw-rw-'} 1 cadet secops  182 Nov 19 06:58 .env_backup${envSecured ? '' : '   <-- [!] WORLD-WRITABLE (666)'}`,
          '-rw-r--r-- 1 cadet secops  290 Nov 19 07:02 cron_audit.log',
          '-rwxr-xr-x 1 cadet secops  512 Nov 12 14:20 deploy.sh',
          '-rw-r--r-- 1 cadet secops  194 Nov 19 07:00 notes.txt'
        );
      } else {
        out.push('cron_audit.log  deploy.sh  notes.txt');
      }
    } else if (cmd === 'cat') {
      const target = args[0];
      if (!target) {
        out.push('cat: missing file operand. Try: cat notes.txt');
      } else if (target === 'notes.txt') {
        out.push(
          '[SOC HARDENING BRIEFING]',
          '1. Audit hidden config files in ~/ops and lock down any world-writable credentials.',
          '2. Inspect running processes (ps aux) or cron_audit.log to kill unauthorized C2 beacons.'
        );
      } else if (target === '.env_backup') {
        out.push(
          '# Production Staging Secrets',
          'DB_PASS=St4g1ng_Postgres_99!',
          'API_TOKEN=cyber_live_881204',
          envSecured ? '[Status: Permissions secured (600)]' : '[!] WARNING: Mode is 0666 — any local user can read & overwrite this file!'
        );
      } else if (target === 'cron_audit.log') {
        out.push(
          'Nov 19 06:44:01 CRON[31330]: (cadet) CMD (/tmp/.kworker_beacon --c2 198.51.100.77:4444)',
          'Nov 19 06:45:01 ALERT: Rogue reverse-beacon child spawned at PID 31337'
        );
      } else if (target === 'deploy.sh') {
        out.push('#!/bin/bash', 'systemctl restart nginx', 'echo "Healthcheck OK"');
      } else {
        out.push(`cat: ${target}: No such file or directory`);
      }
    } else if (cmd === 'grep') {
      const term = (args[0] || '').toLowerCase();
      const file = args[1] || '';
      if (!term || !file) {
        out.push('Usage: grep <keyword> <filename>');
      } else if (file === 'cron_audit.log' && ('beacon'.includes(term) || '31337'.includes(term) || 'c2'.includes(term))) {
        out.push('Nov 19 06:44:01 CRON[31330]: (cadet) CMD (/tmp/.kworker_beacon --c2 198.51.100.77:4444)', 'Nov 19 06:45:01 ALERT: Rogue reverse-beacon child spawned at PID 31337');
      } else {
        out.push(`(no matches for "${term}" in ${file})`);
      }
    } else if (cmd === 'ps') {
      out.push(
        'USER       PID %CPU %MEM COMMAND',
        'root         1  0.0  0.1 /sbin/init',
        'www-data   842  0.1  0.4 nginx: worker process',
        'cadet     2044  0.0  0.2 -bash'
      );
      if (!beaconKilled) {
        out.push('cadet    31337 14.2  1.8 /tmp/.kworker_beacon --c2 198.51.100.77:4444   <-- [!] ROGUE C2 BEACON');
      }
    } else if (cmd === 'chmod') {
      const mode = args[0];
      const file = args[1];
      if ((mode === '600' || mode === '0600' || mode === 'go-rw') && file === '.env_backup') {
        nextEnvSecured = true;
        setEnvSecured(true);
        out.push('[+] Permissions updated: .env_backup set to 0600 (-rw-------). Secret exposure remediated!');
        playSound('success', soundEnabled);
      } else {
        out.push('Hint: Restrict .env_backup to owner-only read/write using: chmod 600 .env_backup');
        playSound('error', soundEnabled);
      }
    } else if (cmd === 'kill' || cmd === 'pkill') {
      const targetPid = args[args.length - 1];
      if (targetPid === '31337' || targetPid?.includes('kworker')) {
        nextBeaconKilled = true;
        setBeaconKilled(true);
        out.push('[+] SIGKILL sent to PID 31337 (/tmp/.kworker_beacon). Unauthorized C2 process terminated!');
        playSound('success', soundEnabled);
      } else {
        out.push('kill: target PID not found (inspect active processes with "ps aux").');
        playSound('error', soundEnabled);
      }
    } else {
      out.push(`bash: ${cmd}: command not found (type "help" for available commands)`);
    }

    if (nextEnvSecured && nextBeaconKilled && (!envSecured || !beaconKilled)) {
      out.push(
        '==============================================================',
        '[✓] HOST HARDENING COMPLETE! Both OS vulnerabilities remediated.',
        `[⚑] TRAINING FLAG CAPTURED: ${TRAINING_FLAG}`,
        '=============================================================='
      );
      playSound('powerup', soundEnabled);
      onComplete();
    }

    setHistory((prev) => [...prev, ...out]);
    setCmdInput('');
  };

  const quickCommands = ['ls -la', 'cat notes.txt', 'ps aux', 'chmod 600 .env_backup', 'kill 31337'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-700/70 px-2 py-0.5 rounded">
              TIER 1: CADET FOUNDATIONS · OS HARDENING
            </span>
            <span className="text-xs font-mono text-slate-400">NODE: cadet-ops-01 (Ubuntu 24.04)</span>
          </div>
          <h3 className="text-xl font-bold font-mono text-white">Linux &amp; CLI Defense Lab</h3>
          <p className="text-xs text-slate-400">
            Use core Linux commands (<code className="text-cyan-300">ls -la</code>, <code className="text-cyan-300">cat</code>, <code className="text-cyan-300">ps</code>, <code className="text-cyan-300">chmod</code>, <code className="text-cyan-300">kill</code>) to lock down exposed secrets and kill a rogue C2 beacon (+150 XP).
          </p>
        </div>

        <GuidedHintToggle hints={debrief.guidedHints} />
      </div>

      {/* 2-Objective Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
        <div
          className={`p-3 rounded-xl border flex items-center gap-2.5 ${
            envSecured
              ? 'bg-emerald-950/30 border-emerald-700/60 text-emerald-300'
              : 'bg-[#050914] border-slate-800 text-slate-300'
          }`}
        >
          {envSecured ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Lock className="w-4 h-4 text-amber-400 shrink-0" />}
          <span>Objective 1: Fix world-writable <code className="text-cyan-300">.env_backup</code> via <code className="text-cyan-300">chmod 600</code></span>
        </div>

        <div
          className={`p-3 rounded-xl border flex items-center gap-2.5 ${
            beaconKilled
              ? 'bg-emerald-950/30 border-emerald-700/60 text-emerald-300'
              : 'bg-[#050914] border-slate-800 text-slate-300'
          }`}
        >
          {beaconKilled ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />}
          <span>Objective 2: Identify &amp; terminate rogue process PID via <code className="text-cyan-300">kill</code></span>
        </div>
      </div>

      {/* Interactive Shell Terminal */}
      <div className="rounded-2xl bg-[#040710] border border-cyan-900/50 overflow-hidden shadow-xl">
        <div className="px-4 py-2 bg-[#0b1220] border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-cyan-300 font-bold">cadet@sec-lab:~/ops</span>
          </div>
          <span>{(envSecured && beaconKilled) || isCompleted ? 'HARDENED // FLAG CAPTURED' : 'ACTIVE INCIDENT'}</span>
        </div>

        <div
          ref={outputRef}
          className="p-4 h-64 overflow-y-auto terminal-scroll font-mono text-xs space-y-1 text-slate-200"
        >
          {history.map((line, i) => {
            const isPrompt = line.startsWith('cadet@sec-lab');
            const isSuccess = line.startsWith('[+]') || line.startsWith('[✓]') || line.startsWith('[⚑]');
            const isAlert = line.includes('[!]');
            return (
              <div
                key={i}
                className={
                  isPrompt
                    ? 'text-cyan-400 font-bold pt-1'
                    : isSuccess
                    ? 'text-emerald-300 font-semibold'
                    : isAlert
                    ? 'text-amber-300'
                    : 'text-slate-300'
                }
              >
                {line}
              </div>
            );
          })}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runCommand(cmdInput);
          }}
          className="px-4 py-3 border-t border-slate-800 bg-[#070b14] flex items-center gap-2 font-mono text-xs"
        >
          <span className="text-emerald-400 font-bold shrink-0">cadet@sec-lab:~/ops$</span>
          <input
            type="text"
            value={cmdInput}
            onChange={(e) => setCmdInput(e.target.value)}
            placeholder="Type command (e.g. ls -la, ps aux, chmod 600 .env_backup, kill 31337)..."
            className="flex-1 bg-transparent text-white placeholder:text-slate-600 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] cursor-pointer"
          >
            Run
          </button>
        </form>

        {/* Beginner Quick-Fill Chips */}
        <div className="px-4 py-2 bg-[#050912] border-t border-slate-900 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
          <span className="text-slate-500 mr-1">Quick cmds:</span>
          {quickCommands.map((qc) => (
            <button
              key={qc}
              type="button"
              onClick={() => runCommand(qc)}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 cursor-pointer"
            >
              {qc}
            </button>
          ))}
        </div>
      </div>

      <PostActionDebrief moduleId="linux-cli-defense" isCompleted={isCompleted} />
    </div>
  );
};

/* ========================================================================= */
/* TIER 1 GAME C: PACKET & PHISHING TRIAGE (NETWORK & BLUE TEAM, +150 XP)    */
/* ========================================================================= */

const PHISHING_INDICATORS = [
  { id: 'spf-fail', label: 'Authentication-Results shows spf=fail, dkim=none, dmarc=fail', malicious: true },
  { id: 'reply-to', label: 'Reply-To points to external domain helpdesk-verify@mail-ru-relay.ru', malicious: true },
  { id: 'homoglyph', label: 'Link targets lookalike homoglyph domain flpoIy-login.tk (capital "I" for "l")', malicious: true },
  { id: 'utf8', label: 'Email uses Content-Type: text/html; charset=UTF-8', malicious: false },
  { id: 'timestamp', label: 'SMTP Received timestamp includes -0500 (EST) timezone offset', malicious: false },
];

const TRAFFIC_FLOWS = [
  { id: 'flow-1', src: '10.0.4.12', dst: '104.16.24.4:443', proto: 'TLSv1.3', bytes: '142 KB', proc: 'chrome.exe', note: 'Normal HTTPS CDN fetch', suspicious: false },
  { id: 'flow-2', src: '10.0.4.12', dst: '10.0.0.2:53', proto: 'UDP/DNS', bytes: '1.2 KB', proc: 'svchost.exe', note: 'Internal Active Directory DNS', suspicious: false },
  { id: 'flow-3', src: '10.0.4.88 (WS-LAB-12)', dst: '185.220.101.9:4444', proto: 'TCP [SYN,PSH]', bytes: '48.2 MB', proc: 'powershell.exe', note: 'Persistent outbound reverse shell / data stream', suspicious: true },
  { id: 'flow-4', src: '10.0.2.15', dst: '10.0.1.5:22', proto: 'SSHv2', bytes: '18 KB', proc: 'ssh', note: 'Approved bastion admin session', suspicious: false },
];

export const PacketPhishingTriageModule: React.FC<Tier1ModuleProps> = ({
  soundEnabled,
  isCompleted,
  onComplete,
  playSound,
}) => {
  const [checkedIndicators, setCheckedIndicators] = useState<Record<string, boolean>>({});
  const [socVerdict, setSocVerdict] = useState<'allow' | 'quarantine'>('allow');
  const [part1Solved, setPart1Solved] = useState(isCompleted);
  const [part1Feedback, setPart1Feedback] = useState('');

  const [selectedFlowId, setSelectedFlowId] = useState<string>('');
  const [part2Solved, setPart2Solved] = useState(isCompleted);
  const [part2Feedback, setPart2Feedback] = useState('');

  const debrief = WAR_ROOM_DEBRIEFS['packet-phishing-triage'];

  const toggleIndicator = (id: string) => {
    playSound('keystroke', soundEnabled);
    setCheckedIndicators((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const verifyPhishingPart = () => {
    playSound('click', soundEnabled);
    const maliciousPicked = PHISHING_INDICATORS.filter((i) => i.malicious).every((i) => checkedIndicators[i.id]);
    const noFalsePositives = PHISHING_INDICATORS.filter((i) => !i.malicious).every((i) => !checkedIndicators[i.id]);

    if (maliciousPicked && noFalsePositives && socVerdict === 'quarantine') {
      setPart1Solved(true);
      setPart1Feedback('[+] Phishing header triage confirmed! Spoofed email quarantined across campus mailboxes.');
      playSound('success', soundEnabled);
      if (part2Solved) {
        playSound('powerup', soundEnabled);
        onComplete();
      }
    } else {
      setPart1Feedback('[-] Triage incomplete: select ONLY the 3 malicious indicators (SPF/DKIM/DMARC fail, .ru Reply-To, flpoIy homoglyph) and choose Quarantine.');
      playSound('error', soundEnabled);
    }
  };

  const verifyNetworkPart = () => {
    playSound('click', soundEnabled);
    if (selectedFlowId === 'flow-3') {
      setPart2Solved(true);
      setPart2Feedback('[+] Host WS-LAB-12 isolated and egress port 4444/tcp blocked to 185.220.101.9!');
      playSound('success', soundEnabled);
      if (part1Solved) {
        playSound('powerup', soundEnabled);
        onComplete();
      }
    } else {
      setPart2Feedback('[-] Select the suspicious outbound flow (look for non-standard reverse shell port 4444 from powershell.exe).');
      playSound('error', soundEnabled);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-700/70 px-2 py-0.5 rounded">
              TIER 1: CADET FOUNDATIONS · NETWORK &amp; BLUE TEAM
            </span>
            <span className="text-xs font-mono text-slate-400">
              STAGE: {(part1Solved ? 1 : 0) + (part2Solved ? 1 : 0)} / 2 TRIAGED
            </span>
          </div>
          <h3 className="text-xl font-bold font-mono text-white">Packet &amp; Phishing Triage</h3>
          <p className="text-xs text-slate-400">
            Examine raw SMTP authentication headers to flag a phishing lure, then isolate a malicious outbound C2 network flow (+150 XP).
          </p>
        </div>

        <GuidedHintToggle hints={debrief.guidedHints} />
      </div>

      {/* Part 1: Email Header Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 p-4 rounded-xl bg-[#050914] border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> PART 1: SUSPICIOUS SMTP HEADER &amp; EMAIL LURE
            </span>
            {part1Solved && <span className="text-emerald-400 text-[10px]">✓ QUARANTINED</span>}
          </div>

          <pre className="p-3 rounded-lg bg-[#090f1d] border border-slate-800 text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
{`From: "University IT SSO" <support@flpoly-sec-portal.com>
Reply-To: helpdesk-verify@mail-ru-relay.ru
Return-Path: <bounce@193-29-14-88.vps-mail.net>
Content-Type: text/html; charset=UTF-8
Date: Thu, 19 Nov 2026 07:04:12 -0500
Authentication-Results: mx.campus.edu;
  spf=fail (sender IP 193.29.14.88 not authorized);
  dkim=none (no signature);
  dmarc=fail (p=NONE)

Body Preview:
"URGENT: Your MFA token expires in 2 hours. Re-verify at:"
[ Verify SSO Credentials -> https://flpoIy-login.tk/sso/verify ]`}
          </pre>
        </div>

        <div className="lg:col-span-6 p-4 rounded-xl bg-[#050914] border border-slate-800 space-y-3 font-mono text-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-white font-bold">Flag the 3 True Malicious Indicators:</div>
            <div className="space-y-2">
              {PHISHING_INDICATORS.map((ind) => {
                const checked = Boolean(checkedIndicators[ind.id]);
                return (
                  <label
                    key={ind.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      checked
                        ? 'bg-cyan-950/35 border-cyan-500/60 text-white'
                        : 'bg-[#090f1d] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleIndicator(ind.id)}
                      className="mt-0.5 accent-cyan-400 cursor-pointer"
                    />
                    <span className="text-[11px] leading-snug">{ind.label}</span>
                  </label>
                );
              })}
            </div>

            <div>
              <label className="text-slate-400 block mb-1 text-[11px]">SOC Gateway Action:</label>
              <select
                value={socVerdict}
                onChange={(e) => setSocVerdict(e.target.value as 'allow' | 'quarantine')}
                className="w-full px-3 py-2 rounded-lg bg-[#090f1d] border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="allow">Deliver to Inbox (Mark Safe)</option>
                <option value="quarantine">Quarantine Email &amp; Block Sender Domain</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {part1Feedback && (
              <div
                className={`p-2 rounded text-[11px] border ${
                  part1Solved
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-700/60 text-rose-300'
                }`}
              >
                {part1Feedback}
              </div>
            )}
            <button
              type="button"
              onClick={verifyPhishingPart}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              {part1Solved ? '✓ Part 1 Verified' : 'Verify Phishing Indicators'}
            </button>
          </div>
        </div>
      </div>

      {/* Part 2: Network Packet & Port Activity */}
      <div className="p-4 rounded-xl bg-[#050914] border border-slate-800 space-y-4 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <Network className="w-4 h-4" /> PART 2: LIVE CAMPUS EGRESS FLOW TABLE (CLICK SUSPICIOUS FLOW)
          </span>
          {part2Solved && <span className="text-emerald-400 text-[10px]">✓ PORT 4444 BLOCKED</span>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2 px-2">Select</th>
                <th className="py-2 px-2">Source Host</th>
                <th className="py-2 px-2">Destination : Port</th>
                <th className="py-2 px-2">Protocol</th>
                <th className="py-2 px-2">Process</th>
                <th className="py-2 px-2">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {TRAFFIC_FLOWS.map((flow) => {
                const isSelected = selectedFlowId === flow.id;
                return (
                  <tr
                    key={flow.id}
                    onClick={() => {
                      setSelectedFlowId(flow.id);
                      playSound('keystroke', soundEnabled);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-rose-950/35 text-white' : 'hover:bg-slate-900/60 text-slate-300'
                    }`}
                  >
                    <td className="py-2 px-2">
                      <input
                        type="radio"
                        name="suspicious-flow"
                        checked={isSelected}
                        onChange={() => setSelectedFlowId(flow.id)}
                        className="accent-rose-400"
                      />
                    </td>
                    <td className="py-2 px-2">{flow.src}</td>
                    <td className="py-2 px-2 text-amber-300 font-semibold">{flow.dst}</td>
                    <td className="py-2 px-2">{flow.proto}</td>
                    <td className="py-2 px-2 text-cyan-300">{flow.proc}</td>
                    <td className="py-2 px-2">{flow.bytes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="text-[11px]">
            {part2Feedback ? (
              <span className={part2Solved ? 'text-emerald-300' : 'text-rose-300'}>{part2Feedback}</span>
            ) : (
              <span className="text-slate-400">Select the rogue C2 traffic flow above and isolate the endpoint.</span>
            )}
          </div>
          <button
            type="button"
            onClick={verifyNetworkPart}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 cursor-pointer"
          >
            {part2Solved ? '✓ Host Isolated' : 'Isolate Host & Block Port'}
          </button>
        </div>
      </div>

      <PostActionDebrief moduleId="packet-phishing-triage" isCompleted={isCompleted} />
    </div>
  );
};
