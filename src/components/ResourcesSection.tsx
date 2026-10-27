import React, { useState } from 'react';
import { useClubData } from '../context/ClubDataContext';
import { ResourceItem } from '../types';
import { 
  BookOpen, 
  ExternalLink, 
  Search, 
  Bookmark, 
  Terminal, 
  Shield, 
  Zap, 
  Layers, 
  Globe, 
  Sparkles,
  ArrowUpRight,
  Filter
} from 'lucide-react';

export const ResourcesSection: React.FC = () => {
  const { resources } = useClubData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Platform', 'Toolkit', 'Roadmap', 'Cheatsheet'];

  // Spotlight platforms for quick access
  const spotlightPlatforms = [
    { name: 'OverTheWire', label: 'Linux Wargames', url: 'https://overthewire.org/wargames/bandit/', badge: 'FREE' },
    { name: 'PortSwigger Academy', label: 'Web Security Labs', url: 'https://portswigger.net/web-security', badge: 'FREE LABS' },
    { name: 'PicoCTF', label: 'CMU Gamified CTF', url: 'https://picoctf.org', badge: 'FREE' },
    { name: 'CyberChef', label: 'GCHQ Crypto Utility', url: 'https://gchq.github.io/CyberChef/', badge: 'TOOLKIT' },
    { name: 'TryHackMe', label: 'Guided Cyber Rooms', url: 'https://tryhackme.com', badge: 'FREE TIER' },
    { name: 'HackTheBox', label: 'Penetration Testing', url: 'https://www.hackthebox.com', badge: 'FREE TIER' },
    { name: 'Blue Team Labs', label: 'Defensive DFIR & SIEM', url: 'https://blueteamlabs.online', badge: 'FREE TIER' },
    { name: 'DefendTheWeb', label: 'Interactive Challenges', url: 'https://defendtheweb.net', badge: 'FREE' },
  ];

  const filteredResources = resources.filter((res) => {
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.tags && res.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="resources" className="py-20 bg-[#090d16] border-t border-slate-900 cyber-grid relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/50 text-cyan-400 text-xs font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            <span>// 06. LAB REPOSITORIES &amp; PRACTICE VAULT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-mono">
            FREE PRACTICE PLATFORMS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">&amp; TOOL VAULT</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Essential free practice wargames, interactive web security academies, defensive forensics sandboxes, and cryptographic toolkits verified by our executive board.
          </p>
        </div>

        {/* Quick Launch Dock: Free Practice Platforms */}
        <div className="mb-10 p-5 rounded-2xl bg-gradient-to-br from-[#0c1324] via-[#090f1d] to-[#070b16] border border-cyan-900/40 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b border-slate-800/80 gap-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Instant Practice Platform Dock
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                8 Core Labs
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Direct Outbound Access // Open in new tabs
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {spotlightPlatforms.map((plat) => (
              <a
                key={plat.name}
                href={plat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#090e1b] hover:bg-[#0f172a] border border-slate-800 hover:border-cyan-500/60 transition-all flex flex-col justify-between group cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                title={`Launch ${plat.name} (opens in new tab)`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                      {plat.badge}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {plat.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate font-mono">
                    {plat.label}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat === 'All' ? 'All Resources' : cat === 'Platform' ? 'Practice Platforms' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search OverTheWire, PortSwigger, PicoCTF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#0b1222] border border-slate-800/80 hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-lg hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] relative"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded font-semibold border ${
                    item.category === 'Platform'
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60'
                      : item.category === 'Toolkit'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                      : 'bg-purple-950/80 text-purple-300 border-purple-800/60'
                  }`}>
                    {item.category}
                  </span>
                  <Bookmark className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-mono">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                  {item.description}
                </p>

                {/* Target recommendation */}
                <div className="text-[11px] text-slate-300 font-mono bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/90">
                  <span className="text-cyan-400 font-bold">Recommended for: </span>
                  {item.recommendedFor}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 truncate"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Working Outbound Link Button */}
                <a
                  href={item.url || 'https://cybernetics-club.vercel.app'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 text-cyan-300 hover:text-white border border-cyan-800/70 hover:border-cyan-400 text-xs font-mono font-semibold transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)] shrink-0 group cursor-pointer"
                  title={`Open ${item.title} (opens in new tab)`}
                >
                  <span>Launch</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-sm font-mono">
            No resources match your search &ldquo;{searchQuery}&rdquo;. Try another keyword or reset category filter.
          </div>
        )}

        {/* Roadmap & Sponsorship Callout Card */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1120] to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-white font-mono flex items-center gap-2 justify-center sm:justify-start">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Looking for Lab &amp; Certification Sponsorship?</span>
            </h4>
            <p className="text-xs text-slate-400 max-w-xl">
              Through university lab funding and corporate sponsorships, Cyber Netics subsidizes CompTIA Security+, Network+, and eJPT vouchers and provides VIP access to dedicated practice machines.
            </p>
          </div>
          <button
            onClick={() => document.getElementById('leadership')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-4 py-2.5 text-xs font-mono font-bold uppercase rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-cyan-800/60 shrink-0 transition-colors cursor-pointer"
          >
            Inquire with Executive Board
          </button>
        </div>

      </div>
    </section>
  );
};
