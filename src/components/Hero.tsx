import React from 'react';
import { Terminal, ArrowRight, Zap, Target, Award, Users, ChevronRight, Lock, QrCode, Gamepad2, Radio } from 'lucide-react';
import { useClubData } from '../context/ClubDataContext';

interface HeroProps {
  onOpenJoin: () => void;
  onScrollToGames?: () => void;
  onScrollToTracks: () => void;
  onOpenShare?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onOpenJoin, 
  onScrollToGames,
  onScrollToTracks, 
  onOpenShare 
}) => {
  const { clubSettings } = useClubData();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden cyber-grid">
      {/* Radial ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top telemetry pills */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold">RECRUITMENT OPEN 2026-2027</span>
            <span className="text-cyan-600">•</span>
            <span className="text-slate-400">All Experience Levels Welcome</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 text-xs font-mono">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>Ethical Hacking & Defense Guild</span>
          </div>

          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-700/40 text-cyan-300 text-xs font-mono transition-colors"
            >
              <QrCode className="w-3 h-3 text-cyan-400" />
              <span>Share & QR Code</span>
            </button>
          )}
        </div>

        {/* Main Grid: Headline & Interactive Terminal Preview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              DEFEND THE NET.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                BREAK THE UNKNOWN.
              </span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              <strong className="text-white font-semibold">{clubSettings.name}</strong> is the university&apos;s premier student cybersecurity organization. {clubSettings.tagline} We train collegiate hackers in offensive red teaming, SOC blue team defense, binary reverse engineering, and cloud hardening through weekly hands-on labs and national CTF competitions.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-join-btn"
                onClick={onOpenJoin}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-mono text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.35)] hover:shadow-[0_0_35px_rgba(34,211,238,0.5)] transition-all cursor-pointer"
              >
                <span>JOIN CYBER NETICS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-games-btn"
                onClick={onScrollToGames}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-mono text-sm font-semibold text-white bg-gradient-to-r from-blue-600/30 via-cyan-600/30 to-indigo-600/30 hover:from-blue-600/50 hover:to-cyan-600/50 border border-cyan-400/50 hover:border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
              >
                <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>SOC War Room Sim</span>
              </button>

              <button
                id="hero-tools-btn"
                onClick={() => scrollToSection('tool-vault')}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl font-mono text-sm font-medium text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 shadow-sm transition-all cursor-pointer"
              >
                <span>Open-Source Tools</span>
              </button>

              <button
                onClick={onScrollToTracks}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors px-2 py-1 cursor-pointer"
              >
                <span>View 5 Specialized Tracks</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Meeting location badge */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>General Meeting:</span>
              <span className="text-slate-200 font-medium">{clubSettings.regularMeeting}</span>
            </div>
          </div>

          {/* Right side: Cyber Console Preview Snippet */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#0b1120] border border-cyan-900/50 shadow-2xl p-5 overflow-hidden terminal-glow">
              {/* Terminal header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="ml-2 text-xs font-mono text-slate-400">cybernetics@lab-gw:~$</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  v2.6.4-prod
                </span>
              </div>

              {/* Console log simulation */}
              <div className="space-y-2.5 font-mono text-xs text-slate-300 leading-snug">
                <div className="text-cyan-400">$ whoami</div>
                <div className="text-slate-300">
                  {'> '}Member Candidate // Track: Offensive & Defensive Cyber
                </div>

                <div className="text-cyan-400 pt-1">$ ctf-rank --current</div>
                <div className="text-emerald-400">
                  {'> '}[+] CTFtime Collegiate Rank: {clubSettings.ctfGlobalRank}
                </div>
                <div className="text-slate-400">
                  {'> '}Solved 890+ challenges across Web, Pwn, Crypto, Forensics
                </div>

                <div className="text-cyan-400 pt-1">$ cat /etc/motd</div>
                <div className="p-2.5 rounded bg-cyan-950/40 border border-cyan-800/40 text-cyan-200/90 text-[11px] leading-relaxed">
                  &quot;No prior hacking experience required. From your first Linux command to root shells on enterprise networks, we build cybersecurity leaders together.&quot;
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Simulated SOC Environment</span>
                  <span className="text-emerald-400 font-bold">READY_</span>
                </div>
              </div>

              {/* Quick action button within box */}
              <button
                onClick={onScrollToGames}
                className="mt-4 w-full py-2 bg-gradient-to-r from-cyan-950 to-slate-900 hover:from-cyan-900 hover:to-slate-800 text-cyan-300 text-xs font-mono font-medium rounded-lg border border-cyan-700/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Launch Interactive SOC Incident Simulation</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
              <Users className="w-4 h-4" />
              <span>COMMUNITY</span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">{clubSettings.activeMembersCount}+</div>
            <div className="text-xs text-slate-400 mt-1">Active Student Members</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-1">
              <Award className="w-4 h-4" />
              <span>CTFTIME STANDING</span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">{clubSettings.ctfGlobalRank.replace(' Collegiate', '')}</div>
            <div className="text-xs text-slate-400 mt-1">Collegiate Global CTF Rank</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-mono mb-1">
              <Zap className="w-4 h-4" />
              <span>HANDS-ON LABS</span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">{clubSettings.workshopsCompleted}+</div>
            <div className="text-xs text-slate-400 mt-1">Live Technical Workshops</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-1">
              <Target className="w-4 h-4" />
              <span>CAREER SUCCESS</span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">{clubSettings.internshipPlacementRate}</div>
            <div className="text-xs text-slate-400 mt-1">Sec Internships & Full-Time</div>
          </div>
        </div>
      </div>
    </section>
  );
};
