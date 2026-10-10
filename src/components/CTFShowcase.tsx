import React from 'react';
import { CTF_ACHIEVEMENTS, CLUB_INFO } from '../data/clubData';
import { Trophy, Award, Target, ExternalLink, Flag, Flame, CheckCircle2, ShieldAlert } from 'lucide-react';

export const CTFShowcase: React.FC = () => {
  return (
    <section id="ctf" className="py-20 bg-[#070b14] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono mb-3">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>// 05. COMPETITIVE WAR GAMES &amp; STANDINGS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Collegiate CTF &amp; Cyber Defense
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mt-2 leading-relaxed">
              Capture The Flag (CTF) competitions are cybersecurity esports. We battle international universities in jeopardy-style and attack-defense wargames.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={CLUB_INFO.ctftimeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-semibold transition-colors"
            >
              <span>View Official CTFtime Profile</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>
          </div>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Trophy Achievements */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Recent Major Placements</span>
            </h3>

            <div className="space-y-3.5">
              {CTF_ACHIEVEMENTS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                        {item.year}
                      </span>
                      <h4 className="text-base font-bold text-white">{item.event}</h4>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{item.highlight}</p>
                    <span className="text-[11px] text-slate-500 font-mono">Field size: {item.totalTeams}</span>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="inline-block px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-extrabold text-sm">
                      {item.rank}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Challenge Categories & Practice Squad Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#0b1222] border border-cyan-900/50 space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                <Flag className="w-4 h-4 text-rose-400" />
                <span>CTF Disciplines Trained</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Web Vulnerabilities &amp; Exploitation</span>
                    <span className="text-cyan-400">96% Solved</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Binary Exploitation (Pwn / ROP)</span>
                    <span className="text-rose-400">84% Solved</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-500 to-red-500 rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Reverse Engineering (Ghidra / Assembly)</span>
                    <span className="text-emerald-400">88% Solved</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Applied Cryptography &amp; Math</span>
                    <span className="text-amber-400">91% Solved</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full" style={{ width: '91%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Network &amp; Memory Forensics</span>
                    <span className="text-purple-400">94% Solved</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>
              </div>

              {/* Training sessions callout */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Weekly Wargame Sprints:</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Every Friday at 7 PM on Discord voice channels. First-time solvers receive 1-on-1 walkthroughs from seasoned members!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
