import React from 'react';
import { ShieldCheck, Cpu, Terminal, Compass, Briefcase, FileCode, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CLUB_INFO } from '../data/clubData';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-[#070b14] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono">
            <span>// 01. MISSION & FOUNDATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Bridging Classroom Theory &amp; Real-World Cyber Battlefield
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            University degrees teach algorithmic foundations and computing concepts. Cyber Netics gives students the actual hands-on keyboards experience: breaching vulnerabilities, hunting malware, analyzing packet captures, and defending live enterprise infrastructure.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/90 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Offensive &amp; Red Team</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Learn how vulnerabilities happen in code, web applications, and network topologies so you can remediate them before adversaries exploit them.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Web Pentesting &amp; API Hacking</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Active Directory Breaches</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Custom Python Payloads</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/90 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Blue Team &amp; SOC Defense</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Real defense is an art. We train on enterprise SIEMs (Splunk, Wazuh), dissect network PCAPs, analyze memory dumps, and compete in CCDC.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Incident Response &amp; Hunting</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Forensics &amp; Artifact Triage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Hardening Linux &amp; Windows</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/90 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">CTF Competitions</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Our CTF team competes bi-weekly in collegiate and international capture the flag tournaments, cracking cryptography, binary pwn, and stego.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rank #42 Globally on CTFtime</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Internal Beginner CTFs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Weekly Writeup Discussions</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/90 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Career &amp; Industry Links</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Get resume reviews from alumni working at top tech firms and defense contractors. We host dedicated recruitment mixers and sponsor cert vouchers.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Technical Interview Prep</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Security+ / OSCP Study Groups</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Alumni Mentorship Network</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Ethical Oath Callout Box */}
        <div className="mt-14 p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-slate-950 border border-cyan-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>The Cyber Netics Ethical Conduct Pledge</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  STRICT CODE
                </span>
              </h4>
              <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                We adhere strictly to ethical hacking principles, federal laws (CFAA), and university cybersecurity policies. Club infrastructure and skills are practiced exclusively on authorized internal targets, isolated lab environments, and approved CTF ranges.
              </p>
            </div>
          </div>
          <div className="shrink-0 font-mono text-xs text-cyan-300 bg-cyan-950/80 px-4 py-2 rounded-lg border border-cyan-800/60">
            [STATUS: 100% ETHICAL &amp; AUTHORIZED]
          </div>
        </div>
      </div>
    </section>
  );
};
