import React, { useState } from 'react';
import { TRACKS } from '../data/clubData';
import { Track, TrackId } from '../types';
import { Terminal, Shield, Cpu, Cloud, Key, CheckCircle, ArrowRight, Clock, Wrench } from 'lucide-react';

interface TracksProps {
  onSelectTrackForJoin: (trackId: TrackId) => void;
}

export const Tracks: React.FC<TracksProps> = ({ onSelectTrackForJoin }) => {
  const [activeTrackId, setActiveTrackId] = useState<TrackId>('offensive');
  const activeTrack = TRACKS.find(t => t.id === activeTrackId) || TRACKS[0];

  const getTrackIcon = (id: TrackId) => {
    switch (id) {
      case 'offensive':
        return <Terminal className="w-5 h-5" />;
      case 'defensive':
        return <Shield className="w-5 h-5" />;
      case 'reverse-engineering':
        return <Cpu className="w-5 h-5" />;
      case 'cloud-sec':
        return <Cloud className="w-5 h-5" />;
      case 'crypto':
        return <Key className="w-5 h-5" />;
      default:
        return <Terminal className="w-5 h-5" />;
    }
  };

  return (
    <section id="tracks" className="py-20 bg-[#090d16] border-t border-slate-900 cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono">
            <span>// 02. SPECIALIZED DIVISIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Choose Your Operational Track
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Members can specialize in one discipline or cross-train across multiple divisions. Every track features student mentors, hands-on VM labs, and competition prep.
          </p>
        </div>

        {/* Track Selection Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {TRACKS.map((track) => {
            const isSelected = track.id === activeTrackId;
            return (
              <button
                key={track.id}
                onClick={() => setActiveTrackId(track.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-cyan-500/15 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {getTrackIcon(track.id)}
                <span>{track.title.split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Active Track Spotlight Card */}
        <div className="relative rounded-3xl bg-[#0b1222] border border-cyan-900/60 p-6 sm:p-10 shadow-2xl overflow-hidden">
          {/* Subtle accent gradient line at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Col: Overview & Project */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${activeTrack.color}`}>
                  {activeTrack.badge}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Meets: {activeTrack.meetingDay}</span>
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {activeTrack.title}
                </h3>
                <p className="text-cyan-300/90 font-mono text-sm mt-1">
                  {activeTrack.tagline}
                </p>
              </div>

              <p className="text-slate-300 text-base leading-relaxed">
                {activeTrack.description}
              </p>

              {/* Sample Lab Project */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-900/40 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Semester Capstone Lab Project</span>
                </div>
                <p className="text-slate-200 text-sm leading-snug">
                  {activeTrack.sampleProject}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => onSelectTrackForJoin(activeTrack.id)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-md transition-all"
                >
                  <span>Apply with Interest in {activeTrack.badge}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Col: Tools & Skills Learned */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              {/* Tool Stack */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Core Tool Arsenal</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeTrack.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-mono text-xs"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Competencies Acquired */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Key Competencies Mastered</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
                  {activeTrack.skillsLearned.map((skill) => (
                    <li key={skill} className="flex items-start gap-2.5">
                      <span className="text-cyan-400 font-mono mt-0.5">▸</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Guidance */}
              <div className="text-[11px] text-slate-400 font-mono border-l-2 border-cyan-500/50 pl-3">
                No prerequisites needed to begin. Track instructors start from baseline setup to advanced penetration or defense.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
