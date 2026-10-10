import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  ShieldAlert, 
  Terminal, 
  Flame, 
  Key, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  Trophy, 
  RefreshCw, 
  Play, 
  Zap, 
  Lock, 
  Unlock, 
  Eye, 
  FileCode, 
  Mail, 
  Server, 
  Cpu, 
  Volume2, 
  VolumeX,
  ChevronRight,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { MiniGameId } from '../types';

interface CyberMiniGamesProps {
  onGameComplete?: (gameId: MiniGameId, score: number) => void;
  onUnlockFlag?: (flag: string) => void;
}

// Web Audio sound synthesizer for retro cyber feedback
const playCyberSound = (type: 'success' | 'error' | 'click' | 'powerup', enabled = true) => {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.08);
      osc.frequency.setValueAtTime(659.25, now + 0.16);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(140, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'powerup') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch {
    // Ignore audio context errors in sandboxed iframes
  }
};

export const CyberMiniGames: React.FC<CyberMiniGamesProps> = ({ onGameComplete, onUnlockFlag }) => {
  const [activeGame, setActiveGame] = useState<MiniGameId>('sqli');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [totalXp, setTotalXp] = useState(0);
  const [completedGames, setCompletedGames] = useState<Record<MiniGameId, boolean>>({
    sqli: false,
    phishing: false,
    firewall: false,
    hashcracker: false,
    cipher: false
  });

  // Load saved progress
  useEffect(() => {
    try {
      const savedXp = localStorage.getItem('cybernetics_games_xp');
      if (savedXp) setTotalXp(parseInt(savedXp, 10));

      const savedGames = localStorage.getItem('cybernetics_games_completed');
      if (savedGames) {
        setCompletedGames(JSON.parse(savedGames));
      }
    } catch {
      // Ignore
    }
  }, []);

  const awardXp = (amount: number, gameId: MiniGameId) => {
    const newXp = totalXp + amount;
    setTotalXp(newXp);
    const updatedGames = { ...completedGames, [gameId]: true };
    setCompletedGames(updatedGames);

    try {
      localStorage.setItem('cybernetics_games_xp', newXp.toString());
      localStorage.setItem('cybernetics_games_completed', JSON.stringify(updatedGames));
    } catch {
      // Ignore
    }

    if (onGameComplete) {
      onGameComplete(gameId, amount);
    }

    // Check if player solved multiple games to unlock easter egg flag
    const completedCount = Object.values(updatedGames).filter(Boolean).length;
    if (completedCount >= 3 && onUnlockFlag) {
      onUnlockFlag('CYBERNETICS{FL_CYBER_ARCADE_MASTER_2026}');
    }
  };

  // Rank title computation
  const getRank = () => {
    if (totalXp >= 600) return { title: 'Sentinel Elite', color: 'text-amber-300 border-amber-400 bg-amber-950/60' };
    if (totalXp >= 400) return { title: 'Red Team Operator', color: 'text-rose-300 border-rose-400 bg-rose-950/60' };
    if (totalXp >= 200) return { title: 'Security Specialist', color: 'text-cyan-300 border-cyan-400 bg-cyan-950/60' };
    return { title: 'Cyber Cadet', color: 'text-emerald-300 border-emerald-400 bg-emerald-950/60' };
  };

  const rank = getRank();

  return (
    <section id="games" className="py-20 bg-[#070b14] border-t border-slate-900 cyber-grid relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-cyan-600/10 via-blue-600/5 to-transparent blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>// 03. CYBER PRACTICE LAB &amp; ARCADE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Hands-on Cybersecurity Mini-Games
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Practice offensive and defensive techniques in our interactive cyber simulator. Bypass SQL authentication, triage live phishing attacks, block network floods on the firewall, crack hashes, and decode cryptic CTF ciphers.
          </p>
        </div>

        {/* Player Stats & Rank Bar */}
        <div className="mb-8 p-4 rounded-2xl bg-[#090f1d] border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-inner">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 uppercase">Hacker Rank:</span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${rank.color}`}>
                  {rank.title}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 font-mono text-xs">
                <span className="text-cyan-400 font-bold">{totalXp} XP Earned</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">
                  {Object.values(completedGames).filter(Boolean).length} / 5 Modules Cleared
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playCyberSound('click', !soundEnabled);
              }}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
              title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('cybernetics_games_xp');
                localStorage.removeItem('cybernetics_games_completed');
                setTotalXp(0);
                setCompletedGames({ sqli: false, phishing: false, firewall: false, hashcracker: false, cipher: false });
                playCyberSound('click', soundEnabled);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-300 text-xs font-mono transition-colors"
              title="Reset Mini-Game Scores"
            >
              Reset Scores
            </button>
          </div>
        </div>

        {/* Mini Game Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8">
          {[
            { id: 'sqli' as MiniGameId, name: 'SQL Injection', subtitle: 'Web Exploits', icon: FileCode, xp: '+150 XP' },
            { id: 'phishing' as MiniGameId, name: 'Phishing Radar', subtitle: 'Threat Intel', icon: Mail, xp: '+150 XP' },
            { id: 'firewall' as MiniGameId, name: 'Firewall Matrix', subtitle: 'Network Defense', icon: Server, xp: '+150 XP' },
            { id: 'hashcracker' as MiniGameId, name: 'Hash Buster', subtitle: 'Auth & Cracking', icon: Key, xp: '+100 XP' },
            { id: 'cipher' as MiniGameId, name: 'Crypto Decoder', subtitle: 'CTF Ciphers', icon: Lock, xp: '+100 XP' },
          ].map((game) => {
            const Icon = game.icon;
            const isDone = completedGames[game.id];
            const isActive = activeGame === game.id;
            return (
              <button
                key={game.id}
                onClick={() => {
                  setActiveGame(game.id);
                  playCyberSound('click', soundEnabled);
                }}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                  isActive
                    ? 'bg-gradient-to-br from-cyan-950/80 to-[#0e172a] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                    : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isDone ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-950/60" title="Completed!" />
                  ) : (
                    <span className="text-[10px] font-mono text-cyan-400/80">{game.xp}</span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs text-white leading-tight">{game.name}</div>
                  <div className="text-[11px] font-mono text-slate-400">{game.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Mini-Game Workspace */}
        <div className="p-6 md:p-8 rounded-2xl bg-[#090e1a] border border-cyan-500/30 shadow-2xl relative">
          {activeGame === 'sqli' && (
            <SqlInjectionGame 
              soundEnabled={soundEnabled} 
              onComplete={(xp) => awardXp(xp, 'sqli')} 
              isCompleted={completedGames.sqli}
            />
          )}

          {activeGame === 'phishing' && (
            <PhishingGame 
              soundEnabled={soundEnabled} 
              onComplete={(xp) => awardXp(xp, 'phishing')}
              isCompleted={completedGames.phishing}
            />
          )}

          {activeGame === 'firewall' && (
            <FirewallGame 
              soundEnabled={soundEnabled} 
              onComplete={(xp) => awardXp(xp, 'firewall')}
              isCompleted={completedGames.firewall}
            />
          )}

          {activeGame === 'hashcracker' && (
            <HashCrackerGame 
              soundEnabled={soundEnabled} 
              onComplete={(xp) => awardXp(xp, 'hashcracker')}
              isCompleted={completedGames.hashcracker}
            />
          )}

          {activeGame === 'cipher' && (
            <CipherGame 
              soundEnabled={soundEnabled} 
              onComplete={(xp) => awardXp(xp, 'cipher')}
              isCompleted={completedGames.cipher}
            />
          )}
        </div>
      </div>
    </section>
  );
};

/* =========================================================================
   GAME 1: SQL INJECTION VAULT BREAKER & DEFENDER
========================================================================= */
const SqlInjectionGame: React.FC<{ soundEnabled: boolean; onComplete: (xp: number) => void; isCompleted: boolean }> = ({
  soundEnabled,
  onComplete,
  isCompleted
}) => {
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [feedback, setFeedback] = useState<{ status: 'idle' | 'success' | 'fail'; message: string }>({
    status: 'idle',
    message: ''
  });
  const [selectedDefenseFix, setSelectedDefenseFix] = useState<number | null>(null);

  // Live Query preview based on inputs
  const liveQueryL1 = `SELECT * FROM users WHERE username = '${inputUsername}' AND password = '${inputPassword}';`;
  const liveQueryL2 = `SELECT product_id, title, price FROM catalog WHERE title LIKE '%${inputUsername}%';`;

  const handleTestLoginL1 = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = inputUsername.trim();
    // Valid SQL injection bypasses
    const isSqliBypass = 
      payload.includes("' OR '1'='1") || 
      payload.includes("' or '1'='1") || 
      payload.includes("admin' --") || 
      payload.includes("admin'#") || 
      payload.includes("' OR 1=1 --") ||
      payload.includes("' or 1=1--");

    if (isSqliBypass) {
      playCyberSound('success', soundEnabled);
      setFeedback({
        status: 'success',
        message: 'AUTHENTICATION BYPASS SUCCESSFUL! The boolean condition evaluated to TRUE. Logged in as administrator: UID=0 (root).'
      });
      setTimeout(() => {
        setLevel(2);
        setInputUsername('');
        setInputPassword('');
        setFeedback({ status: 'idle', message: '' });
      }, 2500);
    } else {
      playCyberSound('error', soundEnabled);
      setFeedback({
        status: 'fail',
        message: 'Login failed: Invalid credentials or syntax error. Hint: Try classic authentication bypass like: admin\' -- or \' OR \'1\'=\'1'
      });
    }
  };

  const handleTestUnionL2 = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = inputUsername.trim().toLowerCase();
    const isUnionExfil = payload.includes('union select') && (payload.includes('flag') || payload.includes('secret') || payload.includes('password') || payload.includes('null') || payload.includes('1'));

    if (isUnionExfil) {
      playCyberSound('success', soundEnabled);
      setFeedback({
        status: 'success',
        message: 'UNION INJECTION SUCCESSFUL! You exfiltrated the database columns: [ID: 999, FLAG: "CYBERNETICS{SQLI_MASTER_PWN}", HASH: "$2y$12$9..."]'
      });
      setTimeout(() => {
        setLevel(3);
        setFeedback({ status: 'idle', message: '' });
      }, 2500);
    } else {
      playCyberSound('error', soundEnabled);
      setFeedback({
        status: 'fail',
        message: 'Query failed to exfiltrate tables. Hint: Try appending a UNION query such as: \' UNION SELECT 1, flag, 3 FROM secrets --'
      });
    }
  };

  const handleTestDefenseL3 = () => {
    if (selectedDefenseFix === 2) {
      playCyberSound('powerup', soundEnabled);
      setFeedback({
        status: 'success',
        message: 'DEFENSE VERIFIED! Parameterized queries (Prepared Statements) treat all user inputs as literals, completely neutralizing SQL injection!'
      });
      onComplete(150);
    } else {
      playCyberSound('error', soundEnabled);
      setFeedback({
        status: 'fail',
        message: 'Vulnerable approach! Blacklisting characters or simple escaping can often be bypassed with encoded payloads or alternative comment syntax.'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white font-mono">Module 01: SQL Injection Vault & Defense</h3>
            {isCompleted && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                PASSED +150 XP
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Level {level} of 3: {level === 1 ? 'Authentication Bypass' : level === 2 ? 'UNION Data Exfiltration' : 'Remediation & Prepared Statements'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3].map((l) => (
            <button
              key={l}
              onClick={() => {
                setLevel(l as any);
                setFeedback({ status: 'idle', message: '' });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                level === l
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Stage {l}
            </button>
          ))}
        </div>
      </div>

      {level === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
              <span className="text-cyan-400 font-bold font-mono">// MISSION OBJECTIVE:</span>
              <p>
                An enterprise admin portal is using string concatenation to construct its database query. Find an input payload that breaks out of the string delimiter and tricks the database into evaluating the password check as always true!
              </p>
            </div>

            <form onSubmit={handleTestLoginL1} className="space-y-3 p-5 rounded-xl bg-[#060a14] border border-cyan-500/30">
              <div className="text-xs font-mono text-cyan-300 font-semibold mb-2 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                Target Login Portal
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Username Payload</label>
                <input
                  type="text"
                  placeholder="e.g. admin' --"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-lg text-sm text-cyan-200 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Password</label>
                <input
                  type="text"
                  placeholder="any password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-lg text-sm text-slate-300 font-mono focus:outline-none"
                />
              </div>

              {/* Quick suggestion helper chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-500">Quick tests:</span>
                {[
                  "admin' --",
                  "' OR '1'='1' --",
                  "admin' OR 1=1--"
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setInputUsername(preset);
                      setInputPassword('secret');
                    }}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/60"
              >
                <Zap className="w-4 h-4" />
                Execute Injection Attack
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span>BACKEND SQL EXECUTION MONITOR</span>
                <span className="text-emerald-400">● LIVE</span>
              </div>
              <p className="text-slate-500 text-[11px]">Database Engine: PostgreSQL / MySQL</p>
              <div className="p-3 bg-[#030712] rounded border border-slate-800 text-xs text-slate-300 break-all leading-relaxed">
                <span className="text-blue-400 font-bold">SELECT</span> * <span className="text-blue-400 font-bold">FROM</span> users <span className="text-blue-400 font-bold">WHERE</span> username = &apos;<span className="text-rose-400 font-bold">{inputUsername || '...'}</span>&apos; <span className="text-blue-400 font-bold">AND</span> password = &apos;<span className="text-amber-300">{inputPassword || '...'}</span>&apos;;
              </div>
            </div>

            {feedback.message && (
              <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed flex items-start gap-2.5 ${
                feedback.status === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
              }`}>
                {feedback.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {level === 2 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
            <span className="text-cyan-400 font-bold font-mono">// MISSION 02: UNION OPERATOR EXTRACTION</span>
            <p>
              You breached the login! Now attack a search query to exfiltrate secret credentials from the hidden <code className="text-amber-300">secrets</code> table using the <code className="text-cyan-300">UNION SELECT</code> technique.
            </p>
          </div>

          <form onSubmit={handleTestUnionL2} className="space-y-3 p-5 rounded-xl bg-[#060a14] border border-cyan-500/30">
            <label className="block text-xs font-mono text-slate-400 mb-1">Search Bar Payload</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="' UNION SELECT 1, flag, 3 FROM secrets --"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-lg text-sm text-cyan-200 font-mono focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs uppercase"
              >
                Send
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs text-slate-300 font-mono break-all">
              <span className="text-blue-400">SELECT</span> id, title, price <span className="text-blue-400">FROM</span> catalog <span className="text-blue-400">WHERE</span> title <span className="text-blue-400">LIKE</span> &apos;%<span className="text-rose-400 font-bold">{inputUsername || '...'}</span>%&apos;;
            </div>

            <div className="flex gap-2 pt-1">
              <span className="text-[10px] font-mono text-slate-500">Hint:</span>
              <button
                type="button"
                onClick={() => setInputUsername("' UNION SELECT 1, flag, 3 FROM secrets --")}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700"
              >
                Load UNION Exploit Payload
              </button>
            </div>

            {feedback.message && (
              <div className={`p-4 rounded-xl border text-xs font-mono ${
                feedback.status === 'success' ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
              }`}>
                {feedback.message}
              </div>
            )}
          </form>
        </div>
      )}

      {level === 3 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
            <span className="text-cyan-400 font-bold font-mono">// MISSION 03: BLUE TEAM REMEDIATION</span>
            <p>
              Switch roles to the software defense engineer! Which implementation correctly protects the application against all SQL injection attacks?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: 1,
                title: 'Option A: Strip Single Quotes',
                code: `query = "SELECT * FROM users WHERE name = '" + sanitize(input.replace("'", "")) + "'"`
              },
              {
                id: 2,
                title: 'Option B: Parameterized Prepared Statement',
                code: `stmt = db.prepare("SELECT * FROM users WHERE name = ?");\nstmt.bind(1, input);`
              },
              {
                id: 3,
                title: 'Option C: Regex Keyword Blacklist',
                code: `if (input.match(/OR|AND|UNION|SELECT/i)) throw Error();\nquery = "SELECT * WHERE name = '" + input + "'"`
              }
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => setSelectedDefenseFix(opt.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedDefenseFix === opt.id
                    ? 'bg-cyan-950/50 border-cyan-400 shadow-md'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">{opt.title}</span>
                  <input
                    type="radio"
                    name="defenseFix"
                    checked={selectedDefenseFix === opt.id}
                    onChange={() => setSelectedDefenseFix(opt.id)}
                    className="accent-cyan-400"
                  />
                </div>
                <pre className="p-2.5 rounded bg-black/60 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                  {opt.code}
                </pre>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleTestDefenseL3}
              disabled={selectedDefenseFix === null}
              className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-xs uppercase tracking-wider transition-all disabled:opacity-50"
            >
              Verify Fix & Complete Module
            </button>
          </div>

          {feedback.message && (
            <div className={`p-4 rounded-xl border text-xs font-mono ${
              feedback.status === 'success' ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            }`}>
              {feedback.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   GAME 2: PHISHING RADAR & HEADER DETECTIVE
========================================================================= */
interface PhishingItem {
  id: number;
  subject: string;
  senderDisplay: string;
  senderEmail: string;
  returnPath: string;
  spfDkimStatus: 'PASS' | 'FAIL' | 'SOFTFAIL';
  domainAge: string;
  body: string;
  linkText: string;
  linkUrl: string;
  attachmentName?: string;
  isPhishing: boolean;
  explanation: string;
}

const PHISHING_INBOX: PhishingItem[] = [
  {
    id: 1,
    subject: 'URGENT: Duo 2FA Security Token Expiring in 2 Hours',
    senderDisplay: 'Florida Tech IT Security Support',
    senderEmail: 'helpdesk@it-floridatech-support.com',
    returnPath: 'bounce-service@mailgun-compromised.xyz',
    spfDkimStatus: 'FAIL',
    domainAge: 'Registered 3 days ago',
    body: 'Your multi-factor authentication token has expired. Failure to re-verify within 2 hours will result in immediate termination of student portal and canvas access.',
    linkText: 'Click here to re-authorize your Duo Multi-Factor Token',
    linkUrl: 'https://duo-portal-login.auth-session-recovery.ru/verify',
    isPhishing: true,
    explanation: 'PHISHING! Typosquatted sender domain registered 3 days ago, SPF/DKIM fail, urgent pretexting with threats, and link points to a foreign .ru phishing credential harvester.'
  },
  {
    id: 2,
    subject: 'GitHub: Security Alert - High Severity vulnerability in package lodash',
    senderDisplay: 'GitHub Notifications',
    senderEmail: 'notifications@github.com',
    returnPath: 'notifications@github.com',
    spfDkimStatus: 'PASS',
    domainAge: 'Registered 17 years ago (Verified)',
    body: 'Dependabot has detected a Prototype Pollution vulnerability in your repository cybernetics-club/lab-sandbox. Please review the automated pull request.',
    linkText: 'View Dependabot Alert & Pull Request #42',
    linkUrl: 'https://github.com/cybernetics-club/lab-sandbox/security/dependabot',
    isPhishing: false,
    explanation: 'LEGITIMATE! Official verified sender @github.com, valid DKIM pass, accurate return-path, and destination URL is strictly on github.com.'
  },
  {
    id: 3,
    subject: 'Outstanding Vendor Invoice #98214 - Wire Receipt Attached',
    senderDisplay: 'Accounts Receivable Dept',
    senderEmail: 'billing@office-supplier-depot.com',
    returnPath: 'mailer@mailer.ru',
    spfDkimStatus: 'SOFTFAIL',
    domainAge: 'Registered 1 month ago',
    body: 'Please find attached the past-due invoice for university hardware procurement. Enable macros in Microsoft Word to decrypt payment confirmation.',
    linkText: 'Download Invoice_Oct2026.pdf.exe',
    linkUrl: 'http://cdn-file-storage.top/invoice.pdf.exe',
    attachmentName: 'Invoice_Oct2026.pdf.exe',
    isPhishing: true,
    explanation: 'MALWARE PHISHING! Double file extension (.pdf.exe), prompts user to enable macros, and returns from untrusted sender.'
  },
  {
    id: 4,
    subject: 'BSides Orlando 2026: Student Badge Confirmation & QR Code',
    senderDisplay: 'BSides Orlando Organizers',
    senderEmail: 'registration@bsidesorlando.org',
    returnPath: 'registration@bsidesorlando.org',
    spfDkimStatus: 'PASS',
    domainAge: 'Registered 2012 (Verified)',
    body: 'Thank you for registering for BSides Orlando at Full Sail Live! Your attendee credentials and badge schedule are attached below.',
    linkText: 'https://bsidesorlando.org/schedule',
    linkUrl: 'https://bsidesorlando.org/schedule',
    isPhishing: false,
    explanation: 'LEGITIMATE! Matches real Florida community conference domain, DKIM validated, clean URLs.'
  }
];

const PhishingGame: React.FC<{ soundEnabled: boolean; onComplete: (xp: number) => void; isCompleted: boolean }> = ({
  soundEnabled,
  onComplete,
  isCompleted
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHeaders, setShowHeaders] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [reviewed, setReviewed] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const currentEmail = PHISHING_INBOX[currentIndex];

  const handleDecision = (userClaimedPhishing: boolean) => {
    const isCorrect = userClaimedPhishing === currentEmail.isPhishing;
    if (isCorrect) {
      playCyberSound('success', soundEnabled);
      setUserScore(prev => prev + 1);
      setLastResult(`CORRECT! ${currentEmail.explanation}`);
    } else {
      playCyberSound('error', soundEnabled);
      setLastResult(`INCORRECT. ${currentEmail.explanation}`);
    }
    setReviewed(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < PHISHING_INBOX.length) {
      setCurrentIndex(currentIndex + 1);
      setShowHeaders(false);
      setReviewed(false);
      setLastResult(null);
    } else {
      // Completed all
      playCyberSound('powerup', soundEnabled);
      onComplete(150);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white font-mono">Module 02: Phishing Radar & Header Detective</h3>
            {isCompleted && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                PASSED +150 XP
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Email {currentIndex + 1} of {PHISHING_INBOX.length} • Score: {userScore} / {currentIndex + (reviewed ? 1 : 0)}
          </p>
        </div>

        <button
          onClick={() => setShowHeaders(!showHeaders)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-mono"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{showHeaders ? 'Hide Raw Headers' : 'Inspect Raw Headers (SPF/DKIM)'}</span>
        </button>
      </div>

      {/* Raw Email Headers Drawer */}
      {showHeaders && (
        <div className="p-4 rounded-xl bg-black border border-cyan-500/40 font-mono text-xs text-slate-300 space-y-1.5 animate-fadeIn">
          <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1 flex justify-between">
            <span>RFC 5322 HEADER INSPECTION</span>
            <span>SPF / DKIM TELEMETRY</span>
          </div>
          <div><span className="text-slate-500">From:</span> {currentEmail.senderDisplay} &lt;{currentEmail.senderEmail}&gt;</div>
          <div><span className="text-slate-500">Return-Path:</span> &lt;{currentEmail.returnPath}&gt;</div>
          <div><span className="text-slate-500">SPF/DKIM Verification:</span> <span className={currentEmail.spfDkimStatus === 'PASS' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{currentEmail.spfDkimStatus}</span></div>
          <div><span className="text-slate-500">Domain Whois Registration:</span> <span className="text-amber-300">{currentEmail.domainAge}</span></div>
          <div><span className="text-slate-500">Hyperlink Destination:</span> <span className="text-rose-300 break-all">{currentEmail.linkUrl}</span></div>
        </div>
      )}

      {/* Simulated Email Client UI */}
      <div className="p-6 rounded-2xl bg-[#060a14] border border-slate-800 space-y-4">
        <div className="border-b border-slate-800 pb-4 space-y-1">
          <h4 className="text-lg font-bold text-white">{currentEmail.subject}</h4>
          <div className="text-xs font-mono text-slate-400 flex flex-wrap items-center gap-2">
            <span className="text-slate-200 font-semibold">{currentEmail.senderDisplay}</span>
            <span>&lt;{currentEmail.senderEmail}&gt;</span>
          </div>
        </div>

        <div className="py-2 text-sm text-slate-300 leading-relaxed font-sans">
          {currentEmail.body}
        </div>

        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1 font-mono text-xs">
          <div className="text-slate-400 text-[11px] uppercase">Contained Link Action:</div>
          <div className="text-cyan-400 underline break-all">{currentEmail.linkText}</div>
          <div className="text-[11px] text-slate-500">Hover Target: {currentEmail.linkUrl}</div>
        </div>

        {currentEmail.attachmentName && (
          <div className="p-2.5 rounded bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Attachment Detected: {currentEmail.attachmentName}</span>
          </div>
        )}

        {/* Triage Decision Buttons */}
        {!reviewed ? (
          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => handleDecision(true)}
              className="flex-1 py-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 text-rose-300 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Report as Malicious Phishing</span>
            </button>
            <button
              onClick={() => handleDecision(false)}
              className="flex-1 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Mark as Legitimate Email</span>
            </button>
          </div>
        ) : (
          <div className="pt-4 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono leading-relaxed text-slate-200">
              {lastResult}
            </div>
            <button
              onClick={handleNext}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <span>{currentIndex + 1 < PHISHING_INBOX.length ? 'Next Email' : 'Finish Phishing Module'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 3: FIREWALL MATRIX (NETWORK DEFENSE)
========================================================================= */
interface Packet {
  id: number;
  ip: string;
  port: number;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  payloadDesc: string;
  isMalicious: boolean;
}

const FirewallGame: React.FC<{ soundEnabled: boolean; onComplete: (xp: number) => void; isCompleted: boolean }> = ({
  soundEnabled,
  onComplete,
  isCompleted
}) => {
  const [health, setHealth] = useState(100);
  const [packetsBlocked, setPacketsBlocked] = useState(0);
  const [currentPacket, setCurrentPacket] = useState<Packet>({
    id: 1,
    ip: '198.51.100.42',
    port: 4444,
    protocol: 'TCP',
    payloadDesc: 'Reverse Netcat Shell Payload /bin/sh',
    isMalicious: true
  });
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const packetPool: Omit<Packet, 'id'>[] = [
    { ip: '131.107.0.89', port: 443, protocol: 'TCP', payloadDesc: 'TLS Handshake HTTPS Student Portal', isMalicious: false },
    { ip: '192.168.1.5', port: 53, protocol: 'UDP', payloadDesc: 'DNS Query google.com', isMalicious: false },
    { ip: '45.154.255.8', port: 22, protocol: 'TCP', payloadDesc: 'SSH Brute-Force Password Dictionary Attack', isMalicious: true },
    { ip: '185.220.101.5', port: 4444, protocol: 'TCP', payloadDesc: 'Metasploit Meterpreter Reverse TCP Shell', isMalicious: true },
    { ip: '10.0.0.12', port: 80, protocol: 'TCP', payloadDesc: 'HTTP GET /index.html Student Browser', isMalicious: false },
    { ip: '91.240.118.2', port: 3389, protocol: 'TCP', payloadDesc: 'RDP BlueKeep Remote Code Execution Probe', isMalicious: true },
    { ip: '8.8.8.8', port: 53, protocol: 'UDP', payloadDesc: 'Google Public DNS Standard Response', isMalicious: false },
    { ip: '103.224.182.1', port: 23, protocol: 'TCP', payloadDesc: 'Mirai Botnet Telnet Default Credential Spray', isMalicious: true }
  ];

  const nextPacket = () => {
    const random = packetPool[Math.floor(Math.random() * packetPool.length)];
    setCurrentPacket({
      id: Date.now(),
      ...random
    });
  };

  const handleAction = (action: 'ALLOW' | 'DROP') => {
    if (gameOver) return;

    if (action === 'DROP') {
      if (currentPacket.isMalicious) {
        playCyberSound('success', soundEnabled);
        setPacketsBlocked(prev => prev + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak >= 6) {
          playCyberSound('powerup', soundEnabled);
          onComplete(150);
          setGameOver(true);
        }
      } else {
        // Dropped legit traffic!
        playCyberSound('error', soundEnabled);
        setHealth(prev => Math.max(0, prev - 25));
        setStreak(0);
      }
    } else {
      // ALLOW
      if (!currentPacket.isMalicious) {
        playCyberSound('success', soundEnabled);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak >= 6) {
          playCyberSound('powerup', soundEnabled);
          onComplete(150);
          setGameOver(true);
        }
      } else {
        // Allowed attack through!
        playCyberSound('error', soundEnabled);
        const newHealth = Math.max(0, health - 35);
        setHealth(newHealth);
        setStreak(0);
        if (newHealth <= 0) {
          setGameOver(true);
        }
      }
    }

    if (!gameOver) {
      nextPacket();
    }
  };

  const restartGame = () => {
    setHealth(100);
    setPacketsBlocked(0);
    setStreak(0);
    setGameOver(false);
    nextPacket();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white font-mono">Module 03: Stateful Packet Inspection Firewall</h3>
            {isCompleted && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                PASSED +150 XP
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Inspect network packet telemetry. Drop adversary threats while allowing legitimate university student traffic!
          </p>
        </div>

        {/* Health bar */}
        <div className="text-right">
          <div className="text-xs font-mono text-slate-400">Server Health</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  health > 60 ? 'bg-emerald-400' : health > 30 ? 'bg-amber-400' : 'bg-rose-500'
                }`}
                style={{ width: `${health}%` }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-white">{health}%</span>
          </div>
        </div>
      </div>

      {!gameOver ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400">Consecutive Defense Streak: {streak} / 6</span>
            <span className="text-slate-400">Malicious Payloads Neutralized: {packetsBlocked}</span>
          </div>

          {/* Incoming Packet Card */}
          <div className="p-6 rounded-2xl bg-black border-2 border-cyan-500/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
              <span className="text-slate-400">INBOUND PACKET BUFFER</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold">
                PROTOCOL: {currentPacket.protocol}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <div className="text-slate-500">Source IP</div>
                <div className="text-white font-bold text-sm mt-0.5">{currentPacket.ip}</div>
              </div>
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <div className="text-slate-500">Destination Port</div>
                <div className="text-cyan-300 font-bold text-sm mt-0.5">
                  Port {currentPacket.port} {currentPacket.port === 22 ? '(SSH)' : currentPacket.port === 443 ? '(HTTPS)' : currentPacket.port === 4444 ? '(Metasploit)' : currentPacket.port === 53 ? '(DNS)' : ''}
                </div>
              </div>
              <div className="p-3 bg-slate-900 rounded border border-slate-800 col-span-2 md:col-span-1">
                <div className="text-slate-500">Packet Type</div>
                <div className="text-slate-200 font-bold text-sm mt-0.5">{currentPacket.protocol} Stream</div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-xs space-y-1">
              <div className="text-slate-400 text-[11px] uppercase">Deep Packet Inspection (DPI) Payload Preview:</div>
              <div className="text-slate-200">{currentPacket.payloadDesc}</div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex gap-4">
              <button
                onClick={() => handleAction('DROP')}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-950/60 transition-all"
              >
                <XCircle className="w-4 h-4" />
                <span>DROP / BLOCK PACKET</span>
              </button>
              <button
                onClick={() => handleAction('ALLOW')}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ALLOW PACKET THROUGH</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 space-y-4 font-mono">
          {health > 0 ? (
            <div className="space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white">FIREWALL DEFENSE MATRIX STABILIZED!</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                You maintained network integrity through all threat waves. 150 XP awarded to your Hacker Profile!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 border border-rose-400 text-rose-300 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-rose-400">SERVER COMPROMISED!</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Adversary payloads slipped through or too much legitimate traffic was dropped.
              </p>
            </div>
          )}

          <button
            onClick={restartGame}
            className="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   GAME 4: HASH BUSTER & PASSWORD ENTROPY LAB
========================================================================= */
const HashCrackerGame: React.FC<{ soundEnabled: boolean; onComplete: (xp: number) => void; isCompleted: boolean }> = ({
  soundEnabled,
  onComplete,
  isCompleted
}) => {
  const [activeTab, setActiveTab] = useState<'crack' | 'entropy'>('crack');
  const [selectedHash, setSelectedHash] = useState<'admin' | 'guest' | 'flag'>('admin');
  const [inputGuess, setInputGuess] = useState('');
  const [cracked, setCracked] = useState(false);
  const [crackLog, setCrackLog] = useState<string[]>([]);
  const [testPassword, setTestPassword] = useState('Florida2026!');

  const hashTargets = {
    admin: {
      type: 'MD5 Hash',
      hash: '5f4dcc3b5aa765d61d8327deb882cf99',
      answer: 'password',
      hint: 'The most common 8-letter English password'
    },
    guest: {
      type: 'SHA-256 Hash',
      hash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
      answer: 'sesame',
      hint: 'Magic open phrase ("open ...")'
    },
    flag: {
      type: 'MD5 Hash',
      hash: '21232f297a57a5a743894a0e4a801fc3',
      answer: 'admin',
      hint: 'Default superuser username'
    }
  };

  const handleCrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = hashTargets[selectedHash];
    if (inputGuess.trim().toLowerCase() === target.answer) {
      playCyberSound('success', soundEnabled);
      setCracked(true);
      setCrackLog(prev => [...prev, `[+] HASH MATCH FOUND: "${inputGuess}" -> ${target.hash}`]);
      onComplete(100);
    } else {
      playCyberSound('error', soundEnabled);
      setCrackLog(prev => [...prev, `[-] Exhausted attempt: "${inputGuess}" (Mismatch)`]);
    }
  };

  // Password Entropy Calculator
  const calculateEntropy = (pwd: string) => {
    let poolSize = 0;
    if (/[a-z]/.test(pwd)) poolSize += 26;
    if (/[A-Z]/.test(pwd)) poolSize += 26;
    if (/[0-9]/.test(pwd)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) poolSize += 33;
    if (poolSize === 0 || pwd.length === 0) return { bits: 0, time: '0 seconds' };

    const bits = Math.round(pwd.length * Math.log2(poolSize));
    let time = 'Instantly';
    if (bits > 80) time = 'Trillions of years';
    else if (bits > 60) time = '4,500 years';
    else if (bits > 50) time = '3 months';
    else if (bits > 40) time = '2 hours';
    else if (bits > 28) time = '3 minutes';
    else time = 'Under 1 second';

    return { bits, time };
  };

  const entropy = calculateEntropy(testPassword);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white font-mono">Module 04: Hash Buster &amp; Entropy Lab</h3>
            {isCompleted && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                PASSED +100 XP
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Crack cryptographic hashes using dictionary attacks and analyze password bit entropy.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('crack')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'crack' ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Dictionary Hash Buster
          </button>
          <button
            onClick={() => setActiveTab('entropy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'entropy' ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Entropy Armor
          </button>
        </div>
      </div>

      {activeTab === 'crack' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <label className="block text-xs font-mono uppercase text-slate-400">Select Intercepted Hash</label>
              <div className="grid grid-cols-3 gap-2">
                {(['admin', 'guest', 'flag'] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      setSelectedHash(k);
                      setCracked(false);
                      setInputGuess('');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold uppercase transition-all ${
                      selectedHash === k
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Target {k}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-black rounded font-mono text-xs space-y-1">
                <div className="text-slate-500">{hashTargets[selectedHash].type} Output:</div>
                <div className="text-amber-300 break-all">{hashTargets[selectedHash].hash}</div>
                <div className="text-[11px] text-cyan-400/80 pt-1">💡 Hint: {hashTargets[selectedHash].hint}</div>
              </div>
            </div>

            <form onSubmit={handleCrackSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter wordlist plaintext guess..."
                  value={inputGuess}
                  onChange={(e) => setInputGuess(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-lg text-sm text-white font-mono focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs uppercase"
                >
                  Crack Hash
                </button>
              </div>

              {/* Wordlist presets */}
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-mono text-slate-400">
                <span className="text-slate-500">Dictionary words:</span>
                {['password', 'admin', 'welcome', '123456', 'sesame', 'dragon', 'football'].map((word) => (
                  <button
                    key={word}
                    type="button"
                    onClick={() => setInputGuess(word)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 p-4 rounded-xl bg-black border border-slate-800 font-mono text-xs space-y-2 h-64 overflow-y-auto">
            <div className="text-slate-500 border-b border-slate-800 pb-1">SIMULATED HASHCAT TERMINAL LOG</div>
            {crackLog.length === 0 ? (
              <div className="text-slate-600 italic">Select a target hash and submit candidates...</div>
            ) : (
              crackLog.map((log, i) => (
                <div key={i} className={log.startsWith('[+]') ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Password Entropy Armor Mode */
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Test Any Password to Calculate Mathematical Entropy</label>
              <input
                type="text"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-cyan-500/40 rounded-xl text-cyan-300 font-mono text-base focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-lg bg-black border border-slate-800">
                <div className="text-slate-500">Information Entropy</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">{entropy.bits} Bits</div>
              </div>
              <div className="p-4 rounded-lg bg-black border border-slate-800">
                <div className="text-slate-500">Crack Time (RTX 4090 Array)</div>
                <div className="text-xl font-bold text-amber-300 mt-1">{entropy.time}</div>
              </div>
              <div className="p-4 rounded-lg bg-black border border-slate-800">
                <div className="text-slate-500">NIST Recommendation</div>
                <div className={`text-base font-bold mt-1 ${entropy.bits >= 60 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {entropy.bits >= 60 ? 'STRONG (Passphrase)' : 'WEAK (Increase Length)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   GAME 5: CRYPTO CIPHER MATRIX (CTF DECODER)
========================================================================= */
const CipherGame: React.FC<{ soundEnabled: boolean; onComplete: (xp: number) => void; isCompleted: boolean }> = ({
  soundEnabled,
  onComplete,
  isCompleted
}) => {
  const [shift, setShift] = useState(13);
  const [userDecodedAnswer, setUserDecodedAnswer] = useState('');
  const [caesarSolved, setCaesarSolved] = useState(false);

  // Original ciphertext: Caesar ROT-13 of "FLORIDA_CYBER_SHIELD"
  const targetCiphertext = "SYBEVQN_PLOIE_FUVRYQ";
  const correctAnswer = "FLORIDA_CYBER_SHIELD";

  // Shift Caesar helper
  const decodeCaesar = (text: string, s: number) => {
    return text.replace(/[A-Z]/g, (char) => {
      const code = char.charCodeAt(0) - 65;
      const shifted = (code - s + 26) % 26;
      return String.fromCharCode(shifted + 65);
    });
  };

  const currentPreview = decodeCaesar(targetCiphertext, shift);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (userDecodedAnswer.trim().toUpperCase() === correctAnswer) {
      playCyberSound('powerup', soundEnabled);
      setCaesarSolved(true);
      onComplete(100);
    } else {
      playCyberSound('error', soundEnabled);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white font-mono">Module 05: Cryptography Cipher Matrix</h3>
            {isCompleted && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                PASSED +100 XP
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Intercepted transmission encoded with a classic Caesar Substitution rotation. Find the correct key offset!
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-black border border-cyan-500/30 space-y-5">
        <div className="space-y-1">
          <div className="text-xs font-mono text-slate-400">INTERCEPTED CIPHERTEXT:</div>
          <div className="text-2xl font-mono font-bold text-rose-400 tracking-widest">{targetCiphertext}</div>
        </div>

        {/* Rotation Slider */}
        <div className="space-y-2 p-4 bg-slate-900/60 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs font-mono text-slate-300">
            <span>Caesar Rotation Shift: {shift}</span>
            <span className="text-cyan-400">Alphabet Wheel Offset: [A-Z]</span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            value={shift}
            onChange={(e) => setShift(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400"
          />
          <div className="pt-2 font-mono text-xs text-slate-400 flex items-center justify-between">
            <span>Decoded Stream:</span>
            <span className="text-emerald-300 font-bold text-base tracking-wider">{currentPreview}</span>
          </div>
        </div>

        <form onSubmit={handleVerify} className="flex gap-2">
          <input
            type="text"
            placeholder="Type plaintext message..."
            value={userDecodedAnswer}
            onChange={(e) => setUserDecodedAnswer(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-lg text-sm text-cyan-200 font-mono uppercase focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setUserDecodedAnswer(currentPreview)}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
          >
            Copy Decoded
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs uppercase"
          >
            Submit Flag
          </button>
        </form>

        {caesarSolved && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>CIPHER DECRYPTED! Key offset 13 (ROT13) verified. Flag: CYBERNETICS&#123;FLORIDA_CYBER_SHIELD&#125;</span>
          </div>
        )}
      </div>
    </div>
  );
};
