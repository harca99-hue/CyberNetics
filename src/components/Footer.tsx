import React from 'react';
import { Shield, ArrowUp, ExternalLink, Mail, MapPin, QrCode, Lock, Cloud, Database, Download } from 'lucide-react';
import { useClubData } from '../context/ClubDataContext';

interface FooterProps {
  onOpenShare?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenShare, onOpenAdmin }) => {
  const { clubSettings, isEditor, isAdmin } = useClubData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#05080f] border-t border-slate-900 text-slate-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold text-white font-mono tracking-tight">
                {clubSettings.name.toUpperCase().replace(/\s+/g, '_')}
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The official collegiate cybersecurity and ethical hacking society at {clubSettings.university}. Training defensive operators, red team specialists, and binary researchers since {clubSettings.established}.
            </p>

            <div className="pt-2 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{clubSettings.regularMeeting}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{clubSettings.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Nav Quick Links */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs uppercase tracking-wider text-white font-bold">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => scrollToSection('about')} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Mission &amp; History</button></li>
              <li><button onClick={() => scrollToSection('tracks')} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Specialized Tracks</button></li>
              <li><button onClick={() => scrollToSection('games')} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">SOC War Room</button></li>
              <li><button onClick={() => scrollToSection('writeups')} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Member CTF Writeups</button></li>
              <li><button onClick={() => scrollToSection('resources')} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Practice Platform Vault</button></li>
              <li><button onClick={() => scrollToSection('tool-vault')} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Open-Source Tool Vault</button></li>
              <li><button onClick={() => scrollToSection('scripts')} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Club Tools &amp; Scripts</button></li>
              <li><button onClick={() => scrollToSection('events')} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Florida Cyber Events</button></li>
            </ul>
          </div>

          {/* Socials & Portals */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs uppercase tracking-wider text-white font-bold">Community</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={clubSettings.discordInvite?.startsWith('http://') || clubSettings.discordInvite?.startsWith('https://') ? clubSettings.discordInvite : `https://${clubSettings.discordInvite || 'discord.gg/cybernetics-college'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Discord Community</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href={clubSettings.githubUrl?.startsWith('http://') || clubSettings.githubUrl?.startsWith('https://') ? clubSettings.githubUrl : `https://${clubSettings.githubUrl || 'github.com/cybernetics-club'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href={clubSettings.ctftimeUrl?.startsWith('http://') || clubSettings.ctftimeUrl?.startsWith('https://') ? clubSettings.ctftimeUrl : `https://${clubSettings.ctftimeUrl || 'ctftime.org/team/182490'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <span>CTFtime Ranking</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
            </ul>
          </div>

          {/* Cloud & Club Admin Controls */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5" />
              <span>Cloud &amp; Sharing</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {onOpenShare && (
                <li>
                  <button
                    onClick={onOpenShare}
                    className="text-left text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                  >
                    <QrCode className="w-3 h-3 text-cyan-400" />
                    <span>Share Link &amp; QR Code</span>
                  </button>
                </li>
              )}
              <li>
                <a
                  href="https://console.firebase.google.com/project/sonic-keyword-xggh3/firestore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <Database className="w-3 h-3 text-amber-400" />
                  <span>Google Cloud Firestore</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://console.cloud.google.com/run?project=sonic-keyword-xggh3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <Cloud className="w-3 h-3 text-sky-400" />
                  <span>Google Cloud Run Console</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-600" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Ethics Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-900/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 leading-relaxed font-mono">
          <p className="max-w-2xl">
            Ethical Disclaimer: All tools, attack drills, and vulnerabilities explored by Cyber Netics are conducted under strict academic authorization within isolated virtual laboratories and sanctioned CTFs. Unsanctioned network intrusion is strictly prohibited.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors shrink-0"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 text-[11px] font-mono">
          <div>© {new Date().getFullYear()} {clubSettings.name} (<a href="https://cybernetics-club.vercel.app" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">https://cybernetics-club.vercel.app</a>). Department of Computer Science &amp; Engineering.</div>
          <div className="text-slate-400">Official Portal: <a href="https://cybernetics-club.vercel.app" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">https://cybernetics-club.vercel.app</a> • Google Cloud Firestore Sync</div>
        </div>
      </div>
    </footer>
  );
};
