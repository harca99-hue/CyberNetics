import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FileText,
  Search,
  Terminal,
  Flag,
  User,
  Clock,
  Trophy,
  ChevronRight,
  X,
  Copy,
  Check,
  Sparkles,
  Code,
  Layers,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  FileCode2,
  BookOpen
} from 'lucide-react';
import { CtfWriteup } from '../types';
import { parseWriteupMarkdown } from '../utils/markdownWriteupParser';
import { MarkdownRenderer } from './MarkdownRenderer';

interface RawWriteupManifest {
  updatedAt?: string;
  writeups?: Array<Partial<CtfWriteup> & { markdownUrl?: string }>;
}

const BOARD_TEMPLATE_SNIPPET = `---
id: wup-7
title: "PicoCTF 2026: Challenge Title"
event: PicoCTF 2026
platform: PicoCTF
category: Web Exploitation
difficulty: Intermediate
author: Your Name
authorHandle: "@handle"
authorRole: CTF Team Member
date: NOV 15, 2026
readTime: 5 min read
points: 200
flag: "picoCTF{your_flag_here}"
summary: "Short summary displayed on the writeup card."
vulnerability: "Root cause / CWE summary"
tags: [Web Sec, SQLi, Python]
toolsUsed: [Burp Suite, curl, Python 3]
lessonsLearned:
  - "Key defensive takeaway."
---

## Step 1: Initial Recon

Write your markdown walkthrough here with \`\`\`bash code blocks\`\`\`.`;

function getPlatformBadgeClasses(platform: string): string {
  switch (platform) {
    case 'PicoCTF':
      return 'bg-rose-950/80 text-rose-300 border-rose-800/60';
    case 'HackTheBox':
      return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
    case 'Collegiate CTF':
      return 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60';
    case 'OverTheWire':
      return 'bg-amber-950/80 text-amber-300 border-amber-800/60';
    default:
      return 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60';
  }
}

export const WriteupsBlogSection: React.FC = () => {
  const [writeups, setWriteups] = useState<CtfWriteup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [catalogUpdatedAt, setCatalogUpdatedAt] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalWriteup, setActiveModalWriteup] = useState<CtfWriteup | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedFlag, setCopiedFlag] = useState(false);
  const [showAuthorGuide, setShowAuthorGuide] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const loadWriteups = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setLoadError(null);

    try {
      const res = await fetch('/data/writeups.json', { cache: 'no-cache', signal });
      if (!res.ok) {
        throw new Error(`Unable to load writeups catalog (HTTP ${res.status})`);
      }

      const manifest: RawWriteupManifest = await res.json();
      const entries = Array.isArray(manifest.writeups) ? manifest.writeups : [];
      if (manifest.updatedAt) {
        setCatalogUpdatedAt(manifest.updatedAt);
      }

      const resolvedResults = await Promise.allSettled(
        entries.map(async (entry, idx): Promise<CtfWriteup> => {
          if (entry.markdownUrl) {
            const mdRes = await fetch(entry.markdownUrl, { cache: 'no-cache', signal });
            if (!mdRes.ok) {
              throw new Error(`Failed to load markdown article ${entry.markdownUrl} (${mdRes.status})`);
            }
            const mdText = await mdRes.text();
            return parseWriteupMarkdown(mdText, entry);
          }

          return {
            id: entry.id || `wup-json-${idx + 1}`,
            title: entry.title || 'Untitled CTF Writeup',
            slug: entry.slug || `writeup-${idx + 1}`,
            event: entry.event || 'CTF Competition',
            platform: entry.platform || 'Collegiate CTF',
            category: entry.category || 'Web Exploitation',
            difficulty: entry.difficulty || 'Intermediate',
            author: entry.author || 'Cyber Netics Member',
            authorHandle: entry.authorHandle || '@cybernetics',
            authorRole: entry.authorRole || 'CTF Contributor',
            date: entry.date || 'NOV 2026',
            readTime: entry.readTime || '5 min read',
            points: typeof entry.points === 'number' ? entry.points : 100,
            flag: entry.flag || 'CYBERNETICS{redacted}',
            summary: entry.summary || '',
            tags: Array.isArray(entry.tags) ? entry.tags : [],
            vulnerability: entry.vulnerability || 'Vulnerability analysis & remediation notes.',
            toolsUsed: Array.isArray(entry.toolsUsed) ? entry.toolsUsed : [],
            steps: Array.isArray(entry.steps) ? entry.steps : undefined,
            markdownBody: entry.markdownBody,
            exploitScript: entry.exploitScript,
            lessonsLearned: Array.isArray(entry.lessonsLearned) ? entry.lessonsLearned : [],
            sourceFormat: entry.markdownBody && !entry.steps?.length ? 'markdown' : 'json'
          };
        })
      );

      const loaded: CtfWriteup[] = [];
      for (const item of resolvedResults) {
        if (item.status === 'fulfilled') {
          loaded.push(item.value);
        }
      }

      if (loaded.length === 0 && entries.length > 0) {
        throw new Error('Failed to parse writeup entries from external catalog.');
      }

      setWriteups(loaded);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setLoadError((err as Error).message || 'Could not fetch writeups catalog.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadWriteups(controller.signal);
    return () => controller.abort();
  }, [loadWriteups]);

  const platforms = useMemo(
    () => ['All', ...Array.from(new Set(writeups.map((w) => w.platform)))],
    [writeups]
  );

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(writeups.map((w) => w.category)))],
    [writeups]
  );

  const filteredWriteups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return writeups.filter((w) => {
      const matchesPlatform = selectedPlatform === 'All' || w.platform === selectedPlatform;
      const matchesCategory = selectedCategory === 'All' || w.category === selectedCategory;
      const matchesSearch =
        !q ||
        w.title.toLowerCase().includes(q) ||
        w.summary.toLowerCase().includes(q) ||
        w.author.toLowerCase().includes(q) ||
        w.vulnerability.toLowerCase().includes(q) ||
        w.tags.some((t) => t.toLowerCase().includes(q));
      return matchesPlatform && matchesCategory && matchesSearch;
    });
  }, [writeups, selectedPlatform, selectedCategory, searchQuery]);

  const handleCopyScript = (scriptText: string) => {
    navigator.clipboard.writeText(scriptText);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyFlag = (flagText: string) => {
    navigator.clipboard.writeText(flagText);
    setCopiedFlag(true);
    setTimeout(() => setCopiedFlag(false), 2000);
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(BOARD_TEMPLATE_SNIPPET);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <section id="writeups" className="py-20 bg-[#070b14] border-t border-slate-900 cyber-grid relative overflow-hidden">
      {/* Background Accent Glows */}
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-48 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/50 text-cyan-400 text-xs font-mono">
            <FileText className="w-3.5 h-3.5" />
            <span>// 05. MEMBER WRITEUPS &amp; CTF INTEL BLOG</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-mono">
            MEMBER WRITEUPS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">&amp; CTF LAB CHRONICLES</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Competition solutions, exploit scripts, and methodology notes authored by Cyber Netics competitors — dynamically loaded from external JSON and Markdown writeup files.
          </p>

          {/* Catalog Metadata & Board Publishing Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
              <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{writeups.length} Walkthroughs Loaded</span>
              {catalogUpdatedAt && <span className="text-slate-500">• Updated {catalogUpdatedAt}</span>}
            </span>
            <button
              type="button"
              onClick={() => setShowAuthorGuide((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 text-cyan-300 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{showAuthorGuide ? 'Hide Board Authoring Guide' : 'Add New Writeup (JSON / .md)'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Executive Board Authoring Guide */}
        {showAuthorGuide && (
          <div className="mb-8 p-5 rounded-2xl bg-[#0b1222] border border-cyan-500/40 shadow-xl space-y-3 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Executive Board Publishing Workflow</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Drop a Markdown walkthrough in <code className="text-cyan-300">/public/data/writeups/your-post.md</code> and register its <code className="text-cyan-300">markdownUrl</code> inside <code className="text-cyan-300">/public/data/writeups.json</code> — zero component code edits required.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyTemplate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 font-bold text-[11px] shrink-0 cursor-pointer"
              >
                {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTemplate ? 'Copied .md Template!' : 'Copy .md Template'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-[#050811] border border-slate-800 text-slate-300 text-[11px] overflow-x-auto leading-relaxed">
              {BOARD_TEMPLATE_SNIPPET}
            </pre>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          {/* Platform & Category Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-500 uppercase font-bold mr-1">Platform:</span>
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  selectedPlatform === p
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}

            <span className="text-xs font-mono text-slate-500 uppercase font-bold ml-2 mr-1">Category:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  selectedCategory === c
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
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
              placeholder="Search writeups, tags, pwn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0b1222] border border-slate-800 animate-pulse space-y-4 h-64"
              >
                <div className="flex justify-between">
                  <div className="h-5 w-32 bg-slate-800 rounded" />
                  <div className="h-5 w-24 bg-slate-800 rounded" />
                </div>
                <div className="h-6 w-3/4 bg-slate-800 rounded" />
                <div className="h-14 w-full bg-slate-800/70 rounded" />
                <div className="h-8 w-full bg-slate-800/50 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && loadError && (
          <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-800/60 text-center space-y-3 font-mono">
            <div className="inline-flex items-center gap-2 text-rose-300 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Failed to load external CTF writeups catalog</span>
            </div>
            <p className="text-xs text-slate-400">{loadError}</p>
            <button
              type="button"
              onClick={() => loadWriteups()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-500/30 border border-rose-500/50 text-rose-200 text-xs font-bold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Loading Catalog</span>
            </button>
          </div>
        )}

        {/* Writeups Cards Grid */}
        {!loading && !loadError && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredWriteups.map((wup) => {
              return (
                <div
                  key={wup.id}
                  className="p-6 rounded-2xl bg-[#0b1222] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-lg hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
                >
                  <div className="space-y-3.5">
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded font-bold border text-[11px] ${getPlatformBadgeClasses(wup.platform)}`}>
                          {wup.platform}
                        </span>
                        <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px]">
                          {wup.category}
                        </span>
                        {wup.sourceFormat === 'markdown' && (
                          <span className="text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50 text-[10px]">
                            .MD
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                        <span className="flex items-center gap-1 text-amber-300">
                          <Trophy className="w-3.5 h-3.5" />
                          {wup.points} pts
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {wup.readTime}
                        </span>
                      </div>
                    </div>

                    {/* Title & Summary */}
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-mono mb-2">
                        {wup.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {wup.summary}
                      </p>
                    </div>

                    {/* Vulnerability Highlight */}
                    <div className="p-2.5 rounded-lg bg-[#070b14] border border-slate-800/80 text-[11px] font-mono text-slate-300">
                      <span className="text-cyan-400 font-bold">Vulnerability: </span>
                      <span className="text-slate-300">{wup.vulnerability}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {wup.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Author & Action Footer */}
                  <div className="pt-4 mt-5 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300 font-bold text-xs">
                        {wup.author.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-mono">{wup.author}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{wup.authorRole}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveModalWriteup(wup)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/50 hover:border-cyan-400 text-xs font-mono font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <span>Read Walkthrough</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !loadError && filteredWriteups.length === 0 && (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-sm font-mono">
            No writeups match your active search and filter criteria.
          </div>
        )}
      </div>

      {/* Writeup Detail Modal */}
      {activeModalWriteup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModalWriteup(null);
          }}
        >
          <div className="relative w-full max-w-3xl bg-[#0b1220] border border-cyan-500/40 rounded-2xl shadow-2xl my-8 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-[#080d18] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                    {activeModalWriteup.event} // {activeModalWriteup.category}
                  </span>
                  <h3 className="text-base font-bold text-white font-mono line-clamp-1">
                    {activeModalWriteup.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveModalWriteup(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs font-mono leading-relaxed">
              {/* Meta bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#060a14] border border-slate-800">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300 font-bold">{activeModalWriteup.author}</span>
                  <span className="text-slate-500">({activeModalWriteup.authorHandle})</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <span>Difficulty: <strong className="text-amber-400">{activeModalWriteup.difficulty}</strong></span>
                  <span>Points: <strong className="text-cyan-400">{activeModalWriteup.points} pts</strong></span>
                  <span>Date: <strong>{activeModalWriteup.date}</strong></span>
                </div>
              </div>

              {/* Tools Used */}
              {activeModalWriteup.toolsUsed.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400 font-bold">Tools Used:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModalWriteup.toolsUsed.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-cyan-300 rounded text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary / Approach */}
              {activeModalWriteup.summary && (
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-slate-300 space-y-1.5">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-3.5 h-3.5" /> CHALLENGE SUMMARY &amp; ATTACK VECTOR
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {activeModalWriteup.summary}
                  </p>
                </div>
              )}

              {/* Markdown Walkthrough Body (for .md / markdown-authored writeups) */}
              {activeModalWriteup.markdownBody && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    WALKTHROUGH NOTES
                  </h4>
                  <MarkdownRenderer content={activeModalWriteup.markdownBody} />
                </div>
              )}

              {/* Step-by-step Walkthrough (for structured JSON writeups) */}
              {activeModalWriteup.steps && activeModalWriteup.steps.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    STEP-BY-STEP RECONSTRUCTION
                  </h4>

                  {activeModalWriteup.steps.map((st, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#070c17] border border-slate-800/90 space-y-2.5">
                      <div className="font-bold text-cyan-300 text-xs">
                        {st.title}
                      </div>
                      <p className="text-slate-300 text-xs">
                        {st.description}
                      </p>

                      {st.codeSnippet && (
                        <pre className="p-3 bg-[#03060d] rounded-lg border border-slate-800 text-slate-200 text-[11px] overflow-x-auto leading-relaxed">
                          {st.codeSnippet}
                        </pre>
                      )}

                      {st.output && (
                        <div className="p-2 bg-emerald-950/30 border border-emerald-800/50 rounded text-emerald-300 text-[11px]">
                          ✓ {st.output}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Exploit Script Section */}
              {activeModalWriteup.exploitScript && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2 text-xs">
                      <Code className="w-4 h-4 text-amber-400" />
                      COMPLETE EXPLOIT SCRIPT
                    </span>
                    <button
                      onClick={() => handleCopyScript(activeModalWriteup.exploitScript!)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] cursor-pointer"
                    >
                      {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedScript ? 'Copied Script!' : 'Copy Script'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-[#03060d] rounded-xl border border-slate-800 text-cyan-200 text-[11px] overflow-x-auto max-h-56 leading-relaxed">
                    {activeModalWriteup.exploitScript}
                  </pre>
                </div>
              )}

              {/* Captured Flag */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-600/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">Captured CTF Flag</span>
                    <span className="text-white font-mono font-bold text-xs break-all">{activeModalWriteup.flag}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyFlag(activeModalWriteup.flag)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {copiedFlag ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFlag ? 'Copied!' : 'Copy Flag'}</span>
                </button>
              </div>

              {/* Key Takeaways */}
              {activeModalWriteup.lessonsLearned.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    CORE TAKEAWAYS &amp; DEFENSIVE MITIGATION:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs pl-1">
                    {activeModalWriteup.lessonsLearned.map((l, idx) => (
                      <li key={idx}><span className="text-slate-300">{l}</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-[#080d18] flex items-center justify-between shrink-0 text-xs text-slate-400">
              <span className="font-mono text-[11px]">
                {activeModalWriteup.markdownUrl
                  ? `Source: ${activeModalWriteup.markdownUrl}`
                  : 'Source: /data/writeups.json'}
              </span>
              <button
                onClick={() => setActiveModalWriteup(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-mono font-bold cursor-pointer"
              >
                Close Walkthrough
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
