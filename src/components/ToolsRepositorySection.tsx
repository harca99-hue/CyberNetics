import React, { useState } from 'react';
import { 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  Search, 
  Code, 
  FileCode, 
  Cpu, 
  Zap, 
  User, 
  Clock, 
  Tag, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle2,
  FolderGit2
} from 'lucide-react';
import { MEMBER_SCRIPTS } from '../data/writeupsAndToolsData';
import { MemberScript } from '../types';

export const ToolsRepositorySection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedScriptId, setExpandedScriptId] = useState<string | null>(null);

  const languages = ['All', 'python', 'bash'];
  const categories = ['All', 'Recon & OSINT', 'Web Exploits', 'Binary & Pwn', 'Forensics & Crypto', 'Defensive & SIEM'];

  const filteredScripts = MEMBER_SCRIPTS.filter(script => {
    const matchesLang = selectedLanguage === 'All' || script.language === selectedLanguage;
    const matchesCat = selectedCategory === 'All' || script.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      script.title.toLowerCase().includes(q) ||
      script.filename.toLowerCase().includes(q) ||
      script.description.toLowerCase().includes(q) ||
      script.tags.some(t => t.toLowerCase().includes(q));
    return matchesLang && matchesCat && matchesSearch;
  });

  const handleCopyCode = (script: MemberScript) => {
    navigator.clipboard.writeText(script.code);
    setCopiedId(script.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadScript = (script: MemberScript) => {
    const blob = new Blob([script.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = script.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="scripts" className="py-20 bg-[#060911] border-t border-slate-900 cyber-grid relative overflow-hidden">
      {/* Target anchor for tools */}
      <div id="tools" className="absolute -top-16 left-0 w-0 h-0" />

      {/* Background Accent Glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/50 text-cyan-400 text-xs font-mono">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>// 07. OPEN-SOURCE CLUB TOOLS &amp; REPOSITORY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-mono">
            CLUB TOOLS <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400">&amp; SCRIPTS REPOSITORY</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Battle-tested automation utilities, privilege escalation checkers, JWT exploiters, and PCAP C2 decoders developed and maintained by Cyber Netics members.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-500 uppercase font-bold mr-1">Language:</span>
            {languages.map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  selectedLanguage === lang
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {lang === 'All' ? 'All Languages' : lang === 'python' ? 'Python 3' : 'Bash / Shell'}
              </button>
            ))}

            <span className="text-xs font-mono text-slate-500 uppercase font-bold ml-2 mr-1">Category:</span>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  selectedCategory === c
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {c === 'All' ? 'All Categories' : c}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search scripts, pwn, jwt, pcap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
            />
          </div>
        </div>

        {/* Scripts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredScripts.map(script => {
            const isExpanded = expandedScriptId === script.id;
            const isCopied = copiedId === script.id;

            return (
              <div
                key={script.id}
                className="p-6 rounded-2xl bg-[#0b1222] border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div className="space-y-4">
                  {/* Top Bar: Filename & Language */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
                        <FileCode className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-white tracking-wide text-sm">{script.filename}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        script.language === 'python'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                          : 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60'
                      }`}>
                        {script.language}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {script.version}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors font-mono mb-1.5">
                      {script.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {script.description}
                    </p>
                  </div>

                  {/* Usage Syntax Snippet */}
                  <div className="p-2.5 rounded-lg bg-[#050914] border border-slate-800 text-[11px] font-mono">
                    <span className="text-emerald-400 font-bold block mb-1">$ Usage Command:</span>
                    <code className="text-slate-300 break-all select-all">{script.usage}</code>
                  </div>

                  {/* Code Preview Block */}
                  <div className="relative rounded-xl overflow-hidden border border-slate-800/90 bg-[#03060d]">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-[#080e1c] border-b border-slate-800 text-[10px] font-mono text-slate-400">
                      <span>Source Preview ({script.code.split('\n').length} lines)</span>
                      <button
                        onClick={() => setExpandedScriptId(isExpanded ? null : script.id)}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Collapse' : 'Expand All'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                    <pre className={`p-3 font-mono text-[11px] text-emerald-200/90 leading-relaxed overflow-x-auto ${
                      isExpanded ? 'max-h-96' : 'max-h-32'
                    }`}>
                      {script.code}
                    </pre>
                  </div>

                  {/* Dependencies & Tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] font-mono">
                    <div className="text-slate-400">
                      <span className="text-slate-500">Dependencies: </span>
                      {script.dependencies.join(', ')}
                    </div>
                    <div className="text-slate-500">
                      Author: <span className="text-slate-300 font-semibold">{script.author}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 mt-5 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {script.tags.slice(0, 3).map(t => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyCode(script)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                      title="Copy full script code to clipboard"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                      <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
                    </button>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownloadScript(script)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer"
                      title={`Download ${script.filename}`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {filteredScripts.length === 0 && (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-sm font-mono">
            No scripts match &ldquo;{searchQuery}&rdquo;. Try another term or select All Languages.
          </div>
        )}

      </div>
    </section>
  );
};
