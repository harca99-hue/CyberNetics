import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  Shield, 
  Github, 
  Globe, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Cpu,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { OPEN_SOURCE_TOOLS } from '../data/writeupsAndToolsData';
import { OpenSourceTool } from '../types';

export const OpenSourceToolVaultSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedCmdId, setCopiedCmdId] = useState<string | null>(null);

  const categories = [
    'All',
    'Network Recon',
    'Web Exploitation',
    'Reverse Engineering',
    'Memory & DFIR',
    'Active Directory',
    'Packet Analysis',
    'Cracking & Crypto'
  ];

  const filteredTools = OPEN_SOURCE_TOOLS.filter((tool) => {
    const matchesCat = selectedCategory === 'All' || tool.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      tool.name.toLowerCase().includes(q) ||
      tool.tagline.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.installCommand.toLowerCase().includes(q) ||
      tool.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const handleCopyCommand = (toolId: string, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmdId(toolId);
    setTimeout(() => setCopiedCmdId(null), 2000);
  };

  return (
    <section id="tool-vault" className="py-20 bg-[#080c16] border-t border-slate-900 cyber-grid relative overflow-hidden">
      {/* Anchor for open-source-tools */}
      <div id="open-source-tools" className="absolute -top-16 left-0 w-0 h-0" />

      {/* Background Accent Glows */}
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/50 text-cyan-400 text-xs font-mono">
            <Wrench className="w-3.5 h-3.5" />
            <span>// 07. FREE OPEN-SOURCE TOOL VAULT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-mono">
            FREE OPEN-SOURCE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">TOOL VAULT</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Essential battle-tested infosec utilities for network scanning, web fuzzing, reverse engineering, Active Directory graph analysis, and memory forensics with verified official repositories.
          </p>
        </div>

        {/* Quick Spotlight Strip of Essential 6 Tools */}
        <div className="mb-10 p-4 rounded-2xl bg-[#0a101f] border border-cyan-900/40">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              CORE OPEN-SOURCE TOOLKIT
            </span>
            <span className="text-slate-500 text-[11px]">VERIFIED FOSS // NO PAYWALLS</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[
              { name: 'Nmap', role: 'Port Scanner', url: 'https://nmap.org' },
              { name: 'OWASP ZAP', role: 'Web Proxy & DAST', url: 'https://www.zaproxy.org' },
              { name: 'Gobuster', role: 'Directory Brute', url: 'https://github.com/OJ/gobuster' },
              { name: 'Ghidra', role: 'NSA Decompiler', url: 'https://ghidra-sre.org' },
              { name: 'Volatility 3', role: 'Memory Forensics', url: 'https://www.volatilityfoundation.org' },
              { name: 'BloodHound CE', role: 'AD Attack Paths', url: 'https://bloodhound.specterops.io' },
            ].map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#060a14] hover:bg-[#0c1426] border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-sm"
                title={`Visit ${item.name} (opens in new tab)`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 font-mono transition-colors">
                    {item.name}
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{item.role}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Nmap, Ghidra, ZAP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
            />
          </div>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const isCopied = copiedCmdId === tool.id;

            return (
              <div
                key={tool.id}
                className="p-6 rounded-2xl bg-[#0b1222] border border-slate-800/90 hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-lg hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
              >
                <div className="space-y-3.5">
                  {/* Top Bar: Category & License */}
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 text-[11px]">
                      {tool.category}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono">
                      {tool.license}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-mono">
                      {tool.name}
                    </h3>
                    <p className="text-[11px] font-mono text-cyan-400/90 mt-0.5">
                      {tool.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[56px]">
                    {tool.description}
                  </p>

                  {/* Quick Install Snippet */}
                  <div className="p-2.5 rounded-lg bg-[#050914] border border-slate-800 text-[11px] font-mono flex items-center justify-between gap-2">
                    <div className="overflow-x-auto whitespace-nowrap scrollbar-none text-slate-300 flex items-center gap-1.5 flex-1 min-w-0">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{tool.installCommand}</span>
                    </div>
                    <button
                      onClick={() => handleCopyCommand(tool.id, tool.installCommand)}
                      className={`p-1.5 rounded transition-all shrink-0 cursor-pointer ${
                        isCopied 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                      }`}
                      title="Copy install command"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Working Outbound Link Buttons */}
                <div className="pt-4 mt-5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {/* GitHub Outbound Link */}
                  <a
                    href={tool.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-mono font-medium transition-all cursor-pointer group"
                    title={`View ${tool.name} on GitHub (opens in new tab)`}
                  >
                    <Github className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  {/* Official Website / Download Link */}
                  <a
                    href={tool.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer group"
                    title={`Visit Official ${tool.name} Site (opens in new tab)`}
                  >
                    <span>Download</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-sm font-mono">
            No tools match your active filter &ldquo;{searchQuery}&rdquo;.
          </div>
        )}

      </div>
    </section>
  );
};
