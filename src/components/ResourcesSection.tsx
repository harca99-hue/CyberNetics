import React, { useState } from 'react';
import { useClubData } from '../context/ClubDataContext';
import { ResourceItem } from '../types';
import { BookOpen, ExternalLink, Search, Bookmark, Terminal, Compass, Shield } from 'lucide-react';

export const ResourcesSection: React.FC = () => {
  const { resources } = useClubData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Platform', 'Toolkit', 'Roadmap', 'Cheatsheet'];

  const filteredResources = resources.filter((res) => {
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.tags && res.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="resources" className="py-20 bg-[#090d16] border-t border-slate-900 cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            <span>// 06. LAB REPOSITORIES &amp; TOOL VAULT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Curated Cybersecurity Vault
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Essential wargames, forensic toolkits, cheat-sheets, and recommended certifications verified by our senior executive board and alumni mentors.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tools, platforms, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#0b1222] border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50 font-semibold">
                    {item.category}
                  </span>
                  <Bookmark className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                {/* Target recommendation */}
                <div className="text-[11px] text-slate-300 font-mono bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-cyan-400 font-bold">Recommended for: </span>
                  {item.recommendedFor}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <a
                  href="https://cybernetics-club.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800/60 text-xs transition-colors shrink-0 ml-2"
                  title="Visit Resource (opens in new tab)"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Roadmap callout card */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1120] to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-white font-mono flex items-center gap-2 justify-center sm:justify-start">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Looking for Certification Sponsorship?</span>
            </h4>
            <p className="text-xs text-slate-400 max-w-xl">
              Through university lab funding and corporate sponsorships, Cyber Netics subsidizes CompTIA Security+, Network+, and eJPT vouchers for active members.
            </p>
          </div>
          <button
            onClick={() => document.getElementById('leadership')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 shrink-0 transition-colors cursor-pointer"
          >
            Inquire with Executive Board
          </button>
        </div>
      </div>
    </section>
  );
};
