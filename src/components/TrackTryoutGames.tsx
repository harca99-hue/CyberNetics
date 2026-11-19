import React, { useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Cloud,
  Cpu,
  HelpCircle,
  Key,
  Lightbulb,
  Play,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { TrackId } from '../types';

export interface TrackTryoutProps {
  trackId: TrackId;
  isCompleted: boolean;
  onComplete: () => void;
}

interface TryoutDebriefMeta {
  title: string;
  cweOrMitre: string;
  rootCause: string;
  realWorldDefense: string;
}

const TRYOUT_DEBRIEFS: Record<TrackId, TryoutDebriefMeta> = {
  offensive: {
    title: 'Port Enumeration + SQL Injection Bypass',
    cweOrMitre: 'MITRE T1190 · CWE-89',
    rootCause:
      'Exposing unauthenticated internal APIs on non-standard ports (8080/tcp) combined with string-concatenated SQL queries lets attackers inject tautologies (`OR 1=1 --`) that alter query logic and bypass authentication.',
    realWorldDefense:
      'Bind administrative APIs to private VPC subnets behind mTLS/VPN, and strictly enforce parameterized prepared statements (`db.query("... WHERE user = ?", [user])`) across all database drivers.',
  },
  defensive: {
    title: 'SOC Endpoint & Network Alert Triage',
    cweOrMitre: 'MITRE T1059.001 · T1110',
    rootCause:
      'Attackers commonly hide payload delivery inside Office macros spawning encoded PowerShell (`winword.exe -> powershell.exe -enc`) and probe exposed SSH bastions, while routine DNS/package updates create background noise.',
    realWorldDefense:
      'Correlate abnormal parent-child process trees in Sysmon/EDR logs, enforce SSH key-only auth + fail2ban/rate-limiting on edge bastions, and baseline benign maintenance tasks to reduce analyst alert fatigue.',
  },
  'reverse-engineering': {
    title: 'Symmetric XOR & Bitwise Logic Reversal',
    cweOrMitre: 'CWE-327 · Ghidra Static Analysis',
    rootCause:
      'Hardcoding license verification with invertible arithmetic (`+ 0x10`) and symmetric XOR (`^ 0x5A5A`) lets any reverse engineer work backward mathematically from the target constant (`0x7337`) in seconds.',
    realWorldDefense:
      'Never rely on client-side obfuscated math for authorization or licensing. Validate signed asymmetric tokens (Ed25519/RSA) server-side, and strip debug symbols cleanly in release builds.',
  },
  'cloud-sec': {
    title: 'Cloud IAM Least Privilege & Bucket Hardening',
    cweOrMitre: 'CWE-269 · CWE-732 · MITRE T1078.004',
    rootCause:
      'Granting wildcard `"Action": "*"` on `"Resource": "*"` gives any compromised service account full cloud admin control, while disabling S3 Public Access Blocks exposes sensitive database backups to the internet.',
    realWorldDefense:
      'Scope IAM roles strictly to required actions and resource ARNs, enforce account-wide S3 Block Public Access guardrails, and run automated CSPM scanners (Prowler / Trivy) inside CI/CD pipelines.',
  },
  crypto: {
    title: 'Encoding vs. Encryption & Weak XOR',
    cweOrMitre: 'CWE-327 · CWE-326',
    rootCause:
      'Chaining Base64 and Hex only encodes representation—it adds zero secrecy—and single-byte XOR (`0x2A`) has only 256 possible keys, making brute-force recovery trivial in milliseconds.',
    realWorldDefense:
      'Protect sensitive secrets exclusively with authenticated modern ciphers (AES-256-GCM or ChaCha20-Poly1305) paired with CSPRNG nonces and hardware-backed KMS key management.',
  },
};

const TryoutPostActionDebrief: React.FC<{
  trackId: TrackId;
  isCompleted: boolean;
}> = ({ trackId, isCompleted }) => {
  if (!isCompleted) return null;
  const meta = TRYOUT_DEBRIEFS[trackId];

  return (
    <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#071622] via-[#060e1a] to-[#08131d] border border-emerald-500/45 p-5 space-y-4 shadow-[0_0_25px_rgba(16,185,129,0.12)]">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-800/40">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
            Post-Action Debrief // {meta.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-[10px]">
            {meta.cweOrMitre}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold">
            +100 XP SYNCED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-[#050914] border border-rose-900/50 space-y-1.5">
          <div className="font-mono font-bold text-rose-300 flex items-center gap-1.5 text-[11px] uppercase">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Why It Happened</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{meta.rootCause}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#050914] border border-emerald-900/50 space-y-1.5">
          <div className="font-mono font-bold text-emerald-300 flex items-center gap-1.5 text-[11px] uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Real-World Remediation</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{meta.realWorldDefense}</p>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 1. OFFENSIVE OPERATIONS: NMAP + SQLI TRYOUT                               */
/* ========================================================================= */
const OffensiveTryoutGame: React.FC<{ isCompleted: boolean; onComplete: () => void }> = ({
  isCompleted,
  onComplete,
}) => {
  const [selectedPort, setSelectedPort] = useState<string>(isCompleted ? '8080' : '');
  const [payloadChoice, setPayloadChoice] = useState<string>(isCompleted ? 'sqli' : '');
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const runProbe = () => {
    if (selectedPort !== '8080') {
      setFeedback({
        ok: false,
        msg: '[-] Target port mismatch: Port 22 is key-locked SSH and Port 3306 is filtered. Inspect port 8080/tcp Node API.',
      });
      return;
    }
    if (payloadChoice !== 'sqli') {
      setFeedback({
        ok: false,
        msg: '[-] Probe rejected (HTTP 401): Standard credentials fail, and raw script tags do not bypass SQL authentication.',
      });
      return;
    }
    setFeedback({
      ok: true,
      msg: '[+] HTTP 200 OK — Returned { role: "admin", token: "eyJ...tryout_verified" }! +100 XP unlocked.',
    });
    onComplete();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-6 p-4 rounded-xl bg-[#050914] border border-slate-800 font-mono text-[11px] space-y-3">
          <div className="text-rose-400 font-bold flex items-center gap-1.5">
            <Terminal className="w-4 h-4" /> RECON OUTPUT: nmap -sV 10.10.14.22
          </div>
          <pre className="p-3 rounded-lg bg-[#090f1d] border border-slate-800 text-slate-300 overflow-x-auto leading-relaxed">
{`PORT     STATE    SERVICE    VERSION
22/tcp   open     ssh        OpenSSH 9.2 (pubkey only)
80/tcp   open     http       nginx 1.24 (Static Landing)
8080/tcp open     http-proxy Node.js Express (/api/login)
3306/tcp filtered mysql      Internal DB Only`}
          </pre>

          <div className="text-cyan-400 font-bold">DISCOVERED SOURCE (/api/login):</div>
          <pre className="p-3 rounded-lg bg-[#090f1d] border border-slate-800 text-amber-200 overflow-x-auto leading-relaxed">
{`const q = "SELECT * FROM admins WHERE user = '" + req.body.user + "'";
const row = await db.query(q);`}
          </pre>
        </div>

        <div className="lg:col-span-6 p-4 rounded-xl bg-[#050914] border border-slate-800 font-mono text-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1.5">
                1. Which open port exposes the vulnerable login API?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['22', '80', '8080'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPort(p)}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                      selectedPort === p
                        ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                        : 'bg-[#090f1d] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}/tcp
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1.5">
                2. Pick the SQLi payload that bypasses auth in `req.body.user`:
              </label>
              <div className="space-y-2">
                {[
                  { id: 'xss', label: '<script>alert(1)</script>' },
                  { id: 'sqli', label: "admin' OR '1'='1' --" },
                  { id: 'default', label: 'guest / password123' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPayloadChoice(opt.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-[11px] cursor-pointer transition-all ${
                      payloadChoice === opt.id
                        ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200'
                        : 'bg-[#090f1d] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <code>{opt.label}</code>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {feedback && (
              <div
                className={`p-2.5 rounded-lg border text-[11px] ${
                  feedback.ok
                    ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-700 text-rose-300'
                }`}
              >
                {feedback.msg}
              </div>
            )}
            <button
              type="button"
              onClick={runProbe}
              className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Execute Red Team Probe</span>
            </button>
          </div>
        </div>
      </div>

      <TryoutPostActionDebrief trackId="offensive" isCompleted={isCompleted} />
    </div>
  );
};

/* ========================================================================= */
/* 2. DEFENSIVE SECURITY: 4-EVENT SOC TRIAGE TRYOUT                          */
/* ========================================================================= */
const SOC_EVENTS = [
  {
    id: 'evt-1',
    summary: 'winword.exe spawned powershell.exe -enc SQBFAFgAIAAoAE4AZQB3...',
    host: 'FIN-WS-04',
    malicious: true,
  },
  {
    id: 'evt-2',
    summary: 'svchost.exe UDP/53 DNS query to internal AD controller dc01.corp.local',
    host: 'ENG-WS-11',
    malicious: false,
  },
  {
    id: 'evt-3',
    summary: '194.26.135.8 -> bastion-01:22 (480 failed SSH logins in 60s)',
    host: 'bastion-01',
    malicious: true,
  },
  {
    id: 'evt-4',
    summary: 'Scheduled nightly unattended-upgrades security apt-get update',
    host: 'ubuntu-web-02',
    malicious: false,
  },
];

const DefensiveTryoutGame: React.FC<{ isCompleted: boolean; onComplete: () => void }> = ({
  isCompleted,
  onComplete,
}) => {
  const [verdicts, setVerdicts] = useState<Record<string, 'block' | 'benign'>>(
    isCompleted
      ? { 'evt-1': 'block', 'evt-2': 'benign', 'evt-3': 'block', 'evt-4': 'benign' }
      : {}
  );
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const submitTriage = () => {
    if (SOC_EVENTS.some((e) => !verdicts[e.id])) {
      setFeedback({ ok: false, msg: '[!] Classify all 4 SOC events before submitting.' });
      return;
    }

    const wrong = SOC_EVENTS.filter((e) => (e.malicious ? verdicts[e.id] !== 'block' : verdicts[e.id] !== 'benign'));
    if (wrong.length > 0) {
      setFeedback({
        ok: false,
        msg: `[-] ${wrong.length} event(s) misclassified. Look for Word-spawned encoded PowerShell and high-rate external SSH brute force.`,
      });
      return;
    }

    setFeedback({
      ok: true,
      msg: '[+] 4/4 SOC Triage Accurate! True threats isolated without disrupting internal DNS or patching. +100 XP synced.',
    });
    onComplete();
  };

  return (
    <div className="space-y-4 font-mono">
      <div className="text-xs text-slate-300 flex items-center gap-2">
        <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>Classify each live endpoint/network alert as <strong>Contain / Block</strong> or <strong>Benign</strong>:</span>
      </div>

      <div className="space-y-2.5">
        {SOC_EVENTS.map((evt) => {
          const picked = verdicts[evt.id];
          return (
            <div
              key={evt.id}
              className="p-3.5 rounded-xl bg-[#050914] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="text-[10px] text-cyan-400 font-bold">HOST: {evt.host}</div>
                <div className="text-slate-200 break-words">{evt.summary}</div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setVerdicts((p) => ({ ...p, [evt.id]: 'block' }))}
                  className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
                    picked === 'block'
                      ? 'bg-rose-500/25 border-rose-400 text-rose-200'
                      : 'bg-[#090f1d] border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  Contain / Block
                </button>
                <button
                  type="button"
                  onClick={() => setVerdicts((p) => ({ ...p, [evt.id]: 'benign' }))}
                  className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
                    picked === 'benign'
                      ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                      : 'bg-[#090f1d] border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  Benign
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl border text-xs ${
            feedback.ok
              ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
              : 'bg-rose-950/40 border-rose-700 text-rose-300'
          }`}
        >
          {feedback.msg}
        </div>
      )}

      <button
        type="button"
        onClick={submitTriage}
        className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
      >
        <ShieldCheck className="w-4 h-4" />
        <span>Submit Blue Team Triage</span>
      </button>

      <TryoutPostActionDebrief trackId="defensive" isCompleted={isCompleted} />
    </div>
  );
};

/* ========================================================================= */
/* 3. REVERSE ENGINEERING: DECOMPILED C LICENSE KEY REVERSAL                 */
/* ========================================================================= */
const ReverseEngineeringTryoutGame: React.FC<{ isCompleted: boolean; onComplete: () => void }> = ({
  isCompleted,
  onComplete,
}) => {
  const [keyInput, setKeyInput] = useState(isCompleted ? '0x297D' : '');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const parseKeyNumber = (raw: string): number | null => {
    const t = raw.trim().toLowerCase();
    if (!t) return null;
    if (t.startsWith('0x')) {
      const n = parseInt(t.slice(2), 16);
      return Number.isNaN(n) ? null : n >>> 0;
    }
    if (/^[0-9]+$/.test(t)) {
      return parseInt(t, 10) >>> 0;
    }
    if (/^[0-9a-f]+$/.test(t)) {
      return parseInt(t, 16) >>> 0;
    }
    return null;
  };

  const parsed = parseKeyNumber(keyInput);
  const computedVal = parsed !== null ? ((parsed ^ 0x5a5a) + 0x10) >>> 0 : null;

  const verifyLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsed === null) {
      setFeedback({ ok: false, msg: '[-] Enter a valid hex (e.g., 0x297D) or decimal integer key.' });
      return;
    }
    if (computedVal === 0x7337) {
      setFeedback({
        ok: true,
        msg: `[+] LICENSE VALID! (0x${parsed.toString(16).toUpperCase()} ^ 0x5A5A) + 0x10 == 0x7337. +100 XP unlocked!`,
      });
      onComplete();
    } else {
      setFeedback({
        ok: false,
        msg: `[-] Check Failed: Evaluated to 0x${computedVal!.toString(16).toUpperCase()} (expected 0x7337).`,
      });
    }
  };

  return (
    <div className="space-y-4 font-mono">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-6 p-4 rounded-xl bg-[#050914] border border-slate-800 text-[11px] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> GHIDRA DECOMPILER (verify_license)
            </span>
            <button
              type="button"
              onClick={() => setShowHint((p) => !p)}
              className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-700/50 text-amber-300 text-[10px] inline-flex items-center gap-1 cursor-pointer"
            >
              <Lightbulb className="w-3 h-3" />
              <span>{showHint ? 'Hide Hint' : 'Guided Hint'}</span>
            </button>
          </div>

          <pre className="p-3 rounded-lg bg-[#090f1d] border border-slate-800 text-slate-200 overflow-x-auto leading-relaxed">
{`bool verify_license(uint32_t key) {
    uint32_t val = (key ^ 0x5A5A) + 0x10;
    return (val == 0x7337);
}`}
          </pre>

          {showHint && (
            <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-700/50 text-amber-200 text-[11px] space-y-1">
              <div className="flex items-center gap-1 font-bold">
                <HelpCircle className="w-3.5 h-3.5" /> Inverse Operations:
              </div>
              <p>1. Subtract 0x10 from 0x7337 → <code>0x7327</code></p>
              <p>2. XOR back with 0x5A5A: <code>0x7327 ^ 0x5A5A = 0x297D</code> (or 10621 decimal)</p>
            </div>
          )}
        </div>

        <form
          onSubmit={verifyLicense}
          className="lg:col-span-6 p-4 rounded-xl bg-[#050914] border border-slate-800 text-xs space-y-3 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <label className="text-slate-300 font-bold block">
              Enter valid license key (hex e.g. 0x297D or decimal):
            </label>
            <input
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="0x...."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090f1d] border border-slate-700 focus:border-emerald-400 text-emerald-300 font-bold focus:outline-none"
            />
            <div className="p-2.5 rounded-lg bg-[#090f1d] border border-slate-800 text-[11px] text-slate-400">
              Live Register Probe:{' '}
              <span className="text-cyan-300 font-bold">
                {computedVal !== null ? `val = 0x${computedVal.toString(16).toUpperCase()}` : 'Awaiting valid integer...'}
              </span>{' '}
              (Target: <span className="text-emerald-400 font-bold">0x7337</span>)
            </div>
          </div>

          <div className="space-y-2">
            {feedback && (
              <div
                className={`p-2.5 rounded-lg border text-[11px] ${
                  feedback.ok
                    ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-700 text-rose-300'
                }`}
              >
                {feedback.msg}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Test License Check</span>
            </button>
          </div>
        </form>
      </div>

      <TryoutPostActionDebrief trackId="reverse-engineering" isCompleted={isCompleted} />
    </div>
  );
};

/* ========================================================================= */
/* 4. CLOUD SECURITY: IAM & BUCKET MISCONFIGURATION AUDIT                    */
/* ========================================================================= */
const CloudSecTryoutGame: React.FC<{ isCompleted: boolean; onComplete: () => void }> = ({
  isCompleted,
  onComplete,
}) => {
  const [iamPatch, setIamPatch] = useState<'wildcard' | 'scoped' | 'readall'>(
    isCompleted ? 'scoped' : 'wildcard'
  );
  const [bucketAccess, setBucketAccess] = useState<'public' | 'private'>(
    isCompleted ? 'private' : 'public'
  );
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const runCloudAudit = () => {
    if (iamPatch !== 'scoped') {
      setFeedback({
        ok: false,
        msg: '[-] Prowler Audit FAIL: IAM policy still grants overly broad wildcard privileges across resources.',
      });
      return;
    }
    if (bucketAccess !== 'private') {
      setFeedback({
        ok: false,
        msg: '[-] Prowler Audit FAIL: Backup bucket s3://cybernetics-prod-backups remains publicly readable (AllUsers: READ).',
      });
      return;
    }
    setFeedback({
      ok: true,
      msg: '[+] Prowler CSPM Scan PASSED (0 Critical Findings)! IAM scoped & bucket locked private. +100 XP synced.',
    });
    onComplete();
  };

  return (
    <div className="space-y-4 font-mono">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-6 p-4 rounded-xl bg-[#050914] border border-rose-900/50 text-[11px] space-y-2.5">
          <div className="text-rose-400 font-bold flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> FLAGGED TERRAFORM / IAM AUDIT
          </div>
          <pre className="p-3 rounded-lg bg-[#090f1d] border border-slate-800 text-slate-300 overflow-x-auto leading-relaxed">
{`{
  "Effect": "Allow",
  "Action": "*",            // [!] Admin wildcard
  "Resource": "*"
}
resource "aws_s3_bucket_acl" "backups" {
  bucket = "cybernetics-prod-backups"
  acl    = "public-read"    // [!] Exposed to Internet
}`}
          </pre>
        </div>

        <div className="lg:col-span-6 p-4 rounded-xl bg-[#050914] border border-slate-800 text-xs space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1.5">
                1. Remediate IAM Policy Scope:
              </label>
              <select
                value={iamPatch}
                onChange={(e) => setIamPatch(e.target.value as 'wildcard' | 'scoped' | 'readall')}
                className="w-full px-3 py-2 rounded-lg bg-[#090f1d] border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-purple-400"
              >
                <option value="wildcard">Keep "Action": "*", "Resource": "*" (Admin)</option>
                <option value="readall">Change to "Action": "s3:*", "Resource": "*"</option>
                <option value="scoped">
                  Least Privilege: "Action": ["s3:GetObject"] on "arn:aws:s3:::cybernetics-app-assets/*"
                </option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1.5">
                2. Fix Storage Bucket ACL:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBucketAccess('public')}
                  className={`py-2 px-3 rounded-lg border text-[11px] font-bold cursor-pointer ${
                    bucketAccess === 'public'
                      ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                      : 'bg-[#090f1d] border-slate-800 text-slate-400'
                  }`}
                >
                  acl = "public-read"
                </button>
                <button
                  type="button"
                  onClick={() => setBucketAccess('private')}
                  className={`py-2 px-3 rounded-lg border text-[11px] font-bold cursor-pointer ${
                    bucketAccess === 'private'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-[#090f1d] border-slate-800 text-slate-400'
                  }`}
                >
                  Private + BlockPublicAccess
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {feedback && (
              <div
                className={`p-2.5 rounded-lg border text-[11px] ${
                  feedback.ok
                    ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-700 text-rose-300'
                }`}
              >
                {feedback.msg}
              </div>
            )}
            <button
              type="button"
              onClick={runCloudAudit}
              className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cloud className="w-4 h-4" />
              <span>Run Cloud Security Audit</span>
            </button>
          </div>
        </div>
      </div>

      <TryoutPostActionDebrief trackId="cloud-sec" isCompleted={isCompleted} />
    </div>
  );
};

/* ========================================================================= */
/* 5. APPLIED CRYPTOGRAPHY: BASE64 -> HEX -> XOR DECODER                     */
/* ========================================================================= */
const CIPHER_B64 = 'NjQ2ZjdlNjM2OTc5NzU2MTZmNzM='; // Base64("646f7e63697975616f73")

const xorHexString = (hex: string, keyByte: number): string => {
  const out: string[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.slice(i, i + 2), 16);
    out.push(String.fromCharCode(byte ^ keyByte));
  }
  return out.join('');
};

const CryptoTryoutGame: React.FC<{ isCompleted: boolean; onComplete: () => void }> = ({
  isCompleted,
  onComplete,
}) => {
  const [hexOutput, setHexOutput] = useState<string>(isCompleted ? '646f7e63697975616f73' : '');
  const [xorKey, setXorKey] = useState<number>(isCompleted ? 0x2a : 0x10);
  const [decodedPhrase, setDecodedPhrase] = useState(isCompleted ? 'NETICS_KEY' : '');
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleDecodeB64 = () => {
    try {
      setHexOutput(atob(CIPHER_B64));
    } catch {
      setHexOutput('646f7e63697975616f73');
    }
  };

  const xorPreview = hexOutput ? xorHexString(hexOutput, xorKey) : '';

  const verifyPhrase = (e: React.FormEvent) => {
    e.preventDefault();
    if (decodedPhrase.trim().toUpperCase() === 'NETICS_KEY') {
      setFeedback({
        ok: true,
        msg: '[+] CIPHER CRACKED! Secret phrase "NETICS_KEY" recovered via Base64 -> Hex -> XOR(0x2A). +100 XP synced.',
      });
      onComplete();
    } else {
      setFeedback({
        ok: false,
        msg: '[-] Incorrect phrase. Decode the Base64 string first, then sweep the XOR keys until readable English appears.',
      });
    }
  };

  return (
    <div className="space-y-4 font-mono">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-6 p-4 rounded-xl bg-[#050914] border border-slate-800 text-xs space-y-3">
          <div className="text-amber-400 font-bold flex items-center gap-1.5">
            <Key className="w-4 h-4" /> MINI CYBERCHEF PIPELINE
          </div>
          <div className="p-2.5 rounded-lg bg-[#090f1d] border border-slate-800 text-[11px] break-all">
            <span className="text-slate-400 block mb-1">Intercepted Ciphertext:</span>
            <code className="text-amber-300 font-bold">{CIPHER_B64}</code>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDecodeB64}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-[11px] font-bold cursor-pointer"
            >
              Step 1: From Base64
            </button>
            <span className="text-slate-400 text-[11px]">
              Hex: <code className="text-cyan-300">{hexOutput || '(click Step 1)'}</code>
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-slate-400 text-[11px] block">Step 2: Apply Single-Byte XOR Key on Hex Bytes:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 0x10, label: 'XOR 0x10' },
                { key: 0x2a, label: 'XOR 0x2A' },
                { key: 0x55, label: 'XOR 0x55' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setXorKey(opt.key)}
                  className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold cursor-pointer ${
                    xorKey === opt.key
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-[#090f1d] border-slate-800 text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="p-2.5 rounded-lg bg-[#090f1d] border border-slate-800 text-[11px]">
              <span className="text-slate-500">XOR Output: </span>
              <code className="text-emerald-300 font-bold">{xorPreview || '(decode Base64 first)'}</code>
            </div>
          </div>
        </div>

        <form
          onSubmit={verifyPhrase}
          className="lg:col-span-6 p-4 rounded-xl bg-[#050914] border border-slate-800 text-xs space-y-3 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <label className="text-slate-300 font-bold block">
              Submit the decoded secret phrase:
            </label>
            <input
              type="text"
              value={decodedPhrase}
              onChange={(e) => setDecodedPhrase(e.target.value)}
              placeholder="Enter recovered plaintext phrase..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090f1d] border border-slate-700 focus:border-amber-400 text-amber-300 font-bold focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Multi-layer encoding (Base64 → Hex) often masks simple XOR keys in CTF forensics and malware configs.
            </p>
          </div>

          <div className="space-y-2">
            {feedback && (
              <div
                className={`p-2.5 rounded-lg border text-[11px] ${
                  feedback.ok
                    ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-700 text-rose-300'
                }`}
              >
                {feedback.msg}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify Decoded Secret</span>
            </button>
          </div>
        </form>
      </div>

      <TryoutPostActionDebrief trackId="crypto" isCompleted={isCompleted} />
    </div>
  );
};

/* ========================================================================= */
/* EXPORTED SWITCHER                                                         */
/* ========================================================================= */
export const TrackTryoutPanel: React.FC<TrackTryoutProps> = ({
  trackId,
  isCompleted,
  onComplete,
}) => {
  switch (trackId) {
    case 'offensive':
      return <OffensiveTryoutGame isCompleted={isCompleted} onComplete={onComplete} />;
    case 'defensive':
      return <DefensiveTryoutGame isCompleted={isCompleted} onComplete={onComplete} />;
    case 'reverse-engineering':
      return <ReverseEngineeringTryoutGame isCompleted={isCompleted} onComplete={onComplete} />;
    case 'cloud-sec':
      return <CloudSecTryoutGame isCompleted={isCompleted} onComplete={onComplete} />;
    case 'crypto':
      return <CryptoTryoutGame isCompleted={isCompleted} onComplete={onComplete} />;
    default:
      return null;
  }
};
