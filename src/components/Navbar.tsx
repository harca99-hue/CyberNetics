import React, { useState } from 'react';
import { Shield, Terminal, QrCode, Lock, ChevronRight, Menu, X, Sparkles, Gamepad2, Globe, ExternalLink } from 'lucide-react';
import { useClubData } from '../context/ClubDataContext';

interface NavbarProps {
  onOpenJoin: () => void;
  onScrollToTerminal: () => void;
  onScrollToGames?: () => void;
  onOpenShare: () => void;
  onOpenAdmin: () => void;
  hasSolvedFlag: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenJoin, 
  onScrollToTerminal, 
  onScrollToGames,
  onOpenShare, 
  onOpenAdmin, 
  hasSolvedFlag 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { clubSettings, isEditor, isAdmin } = useClubData();

  const officialWebsiteUrl = 'https://cybernetics-club.vercel.app';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header id="site-header" role="banner" className="sticky top-0 z-40 w-full bg-[#090d16]/95 backdrop-blur-md border-b border-cyan-950/60 transition-all">
      {/* Top Header Navigation Bar */}
      <nav 
        id="top-header-navbar" 
        aria-label="Top Header Navigation"
        className="bg-gradient-to-r from-slate-950 via-[#0b1428] to-slate-950 border-b border-cyan-900/40 text-[11px] font-mono py-1.5 px-3 sm:px-6 text-cyan-400/90 flex flex-wrap items-center justify-between gap-2.5 transition-all"
      >
        {/* Left: University & Meeting schedule */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <span className="inline-flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-semibold">{clubSettings.university}</span>
          </span>
          <span className="text-slate-700 hidden md:inline">|</span>
          <span className="hidden md:inline text-slate-400 truncate max-w-sm lg:max-w-md">
            {clubSettings.regularMeeting}
          </span>
          {clubSettings.announcement && (
            <>
              <span className="text-slate-700 hidden xl:inline">|</span>
              <span className="hidden xl:inline text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 truncate max-w-xs">
                {clubSettings.announcement}
              </span>
            </>
          )}
        </div>

        {/* Right: Verified recruit indicator & Official Club Website External Link */}
        <div className="flex items-center gap-2.5 ml-auto shrink-0">
          {hasSolvedFlag && (
            <span className="text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 shrink-0 text-[10px]">
              CTF_VERIFIED
            </span>
          )}

          {/* Official Website Link (Opens in new tab) */}
          <a
            href={officialWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/90 hover:bg-cyan-900/90 text-cyan-300 hover:text-white border border-cyan-500/60 hover:border-cyan-400 text-[11px] font-semibold transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.45)] group shrink-0"
            title="Open official club website at https://cybernetics-club.vercel.app (opens in new tab)"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span className="font-bold tracking-tight">https://cybernetics-club.vercel.app</span>
            <ExternalLink className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </nav>

      {/* Primary Navigation Bar */}
      <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Identifier */}
          <a 
            href={officialWebsiteUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2.5 group shrink-0 whitespace-nowrap"
            title="Visit Cyber Netics website (opens in new tab)"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-slate-900 border border-cyan-500/40 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all shrink-0">
              <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-105 transition-transform" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#090d16]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-white font-mono whitespace-nowrap">
                  {clubSettings.name.toUpperCase().replace(/\s+/g, '_')}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-800/60 whitespace-nowrap shrink-0 font-bold">
                  SEC-OPS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap hidden sm:block">
                Collegiate Cybersecurity Club
              </p>
            </div>
          </a>

          {/* Center: Organized Navigation Capsule (Visible on lg: 1024px+) */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/90 shadow-inner backdrop-blur-md">
            <button 
              onClick={() => scrollToSection('about')}
              className="px-2.5 py-1 rounded-full text-xs font-mono font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('tracks')}
              className="px-2.5 py-1 rounded-full text-xs font-mono font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              Tracks
            </button>
            <button 
              onClick={() => scrollToSection('events')}
              className="px-2.5 py-1 rounded-full text-xs font-mono font-medium text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40 transition-all whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <span>Florida Events</span>
            </button>
            <button
              onClick={onScrollToGames}
              className="px-2.5 py-1 rounded-full text-xs font-mono font-medium text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/50 transition-all whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
              title="Play interactive cybersecurity practice mini-games"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Mini-Games</span>
            </button>
            <button 
              onClick={() => scrollToSection('resources')}
              className="px-2.5 py-1 rounded-full text-xs font-mono font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              Resources
            </button>
            <button 
              onClick={() => scrollToSection('leadership')}
              className="px-2.5 py-1 rounded-full text-xs font-mono font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              Leadership
            </button>
          </nav>

          {/* Right: Actions Cluster (Tools & Buttons) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Interactive Terminal Challenge Button */}
            <button
              onClick={onScrollToTerminal}
              className="hidden lg:inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/50 hover:border-cyan-500 rounded-lg transition-all whitespace-nowrap shrink-0"
              title="Open interactive cyber terminal challenge"
            >
              <Terminal className="w-3.5 h-3.5 shrink-0" />
              <span>terminal.sh</span>
            </button>

            {/* Official Website Direct Link Button */}
            <a
              href={officialWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-mono text-cyan-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500 rounded-lg transition-all whitespace-nowrap shrink-0 group"
              title="Visit official website: https://cybernetics-club.vercel.app (opens in new tab)"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform shrink-0" />
              <span>cybernetics-club.vercel.app</span>
              <ExternalLink className="w-3 h-3 text-cyan-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
            </a>

            {/* Share & QR Code Button */}
            <button
              id="nav-share-qr-button"
              onClick={onOpenShare}
              className="hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-mono text-slate-300 bg-slate-900/80 hover:bg-slate-800 hover:text-white border border-slate-700/60 hover:border-slate-500 rounded-lg transition-all whitespace-nowrap shrink-0"
              title="Share Website & QR Code"
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>QR Code</span>
            </button>

            {/* Join CTA */}
            <button
              id="nav-join-button"
              onClick={onOpenJoin}
              className="inline-flex items-center justify-center gap-1 h-8 px-3 sm:px-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all font-mono whitespace-nowrap shrink-0"
            >
              <span>Join Netics</span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Mobile / Tablet Menu Button (Visible below lg) */}
            <div className="flex lg:hidden items-center gap-1.5 ml-1">
              <a
                href={officialWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 h-8 w-8 flex items-center justify-center text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 rounded-lg shrink-0"
                title="Open official website (https://cybernetics-club.vercel.app)"
              >
                <Globe className="w-4 h-4 shrink-0" />
              </a>
              <button
                onClick={onOpenShare}
                className="sm:hidden p-1.5 h-8 w-8 flex items-center justify-center text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 rounded-lg shrink-0"
                title="QR Code"
              >
                <QrCode className="w-4 h-4 shrink-0" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 h-8 w-8 flex items-center justify-center text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg shrink-0"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4 shrink-0" /> : <Menu className="w-4 h-4 shrink-0" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (visible when menu opened below lg) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0f1d] border-b border-cyan-900/40 px-4 pt-3 pb-6 space-y-3 font-mono text-sm animate-fadeIn">
          {/* External Website Link in Mobile Drawer */}
          <a
            href={officialWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 hover:text-white hover:bg-cyan-900/60 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span className="font-bold">Official Club Website</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-cyan-300 font-mono">
              <span>https://cybernetics-club.vercel.app</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

          <button
            onClick={() => { scrollToSection('about'); setMobileMenuOpen(false); }}
            className="block py-2 text-slate-300 hover:text-cyan-400 text-left w-full cursor-pointer"
          >
            // 01. About Us
          </button>
          <button
            onClick={() => { scrollToSection('tracks'); setMobileMenuOpen(false); }}
            className="block py-2 text-slate-300 hover:text-cyan-400 text-left w-full cursor-pointer"
          >
            // 02. Specialized Tracks
          </button>
          <button
            onClick={() => {
              if (onScrollToGames) onScrollToGames();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 py-2 text-cyan-300 hover:text-white font-mono text-left w-full cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <span>// 03. Cyber Mini-Games</span>
          </button>
          <button
            onClick={() => { scrollToSection('events'); setMobileMenuOpen(false); }}
            className="block py-2 text-slate-300 hover:text-cyan-400 text-left w-full cursor-pointer"
          >
            // 04. Florida Events &amp; CTFs
          </button>
          <button
            onClick={() => { scrollToSection('resources'); setMobileMenuOpen(false); }}
            className="block py-2 text-slate-300 hover:text-cyan-400 text-left w-full cursor-pointer"
          >
            // 05. Learning Resources &amp; Vault
          </button>
          <button
            onClick={() => { scrollToSection('leadership'); setMobileMenuOpen(false); }}
            className="block py-2 text-slate-300 hover:text-cyan-400 text-left w-full cursor-pointer"
          >
            // 06. Executive Board &amp; FAQ
          </button>
          <button
            onClick={() => {
              onScrollToTerminal();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 py-2 text-cyan-400 hover:text-cyan-300 font-mono text-left w-full"
          >
            <Terminal className="w-4 h-4" />
            <span>// 07. Interactive Terminal CTF</span>
          </button>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenShare();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs text-cyan-300 bg-cyan-950/60 border border-cyan-700/50 rounded-lg"
            >
              <QrCode className="w-4 h-4" />
              <span>Share &amp; QR Code</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJoin();
              }}
              className="w-full py-2.5 text-xs uppercase font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg text-center font-mono"
            >
              Join Cyber Netics
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
