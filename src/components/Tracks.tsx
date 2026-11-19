import React, { useState } from 'react';
import { TRACKS } from '../data/clubData';
import { TrackId } from '../types';
import { useMember } from '../context/MemberContext';
import { TrackTryoutPanel } from './TrackTryoutGames';
import {
  Terminal,
  Shield,
  Cpu,
  Cloud,
  Key,
  CheckCircle,
  CheckCircle2,
  ArrowRight,
  Clock,
  Wrench,
  Play,
  Trophy,
  Loader2,
  UserCheck,
} from 'lucide-react';

interface TracksProps {
  onSelectTrackForJoin: (trackId: TrackId) => void;
}

export const Tracks: React.FC<TracksProps> = ({ onSelectTrackForJoin }) => {
  const {
    firebaseUser,
    memberProfile,
    effectiveCompletedTryouts,
    updateMemberTrack,
    completeTrackTryout,
    setIsDashboardOpen,
  } = useMember();

  const [activeTrackId, setActiveTrackId] = useState<TrackId>('offensive');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'tryout'>('overview');
  const [updatingTrack, setUpdatingTrack] = useState(false);
  const [trackNotice, setTrackNotice] = useState<string | null>(null);

  const activeTrack = TRACKS.find((t) => t.id === activeTrackId) || TRACKS[0];
  const isSignedInMember = Boolean(firebaseUser && memberProfile);
  const isCurrentActiveTrack = Boolean(isSignedInMember && memberProfile?.track === activeTrack.id);
  const isTryoutDone = Boolean(effectiveCompletedTryouts[activeTrack.id]);

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

  const handleApplyOrJoinTrack = async () => {
    setTrackNotice(null);
    if (isSignedInMember) {
      if (isCurrentActiveTrack) {
        setTrackNotice(`You are active in ${activeTrack.badge}! Lab sessions meet on ${activeTrack.meetingDay}.`);
        return;
      }
      setUpdatingTrack(true);
      try {
        await updateMemberTrack(activeTrack.id);
        setTrackNotice(`✓ Primary division switched to ${activeTrack.badge} and synced to Firestore!`);
      } catch (err: any) {
        setTrackNotice(err?.message || 'Unable to update track right now.');
      } finally {
        setUpdatingTrack(false);
      }
    } else {
      onSelectTrackForJoin(activeTrack.id);
    }
  };

  const completedTryoutsCount = TRACKS.filter((t) => Boolean(effectiveCompletedTryouts[t.id])).length;

  return (
    <section id="tracks" className="py-20 bg-[#090d16] border-t border-slate-900 cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono">
            <span>// 02. SPECIALIZED DIVISIONS</span>
            {completedTryoutsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                {completedTryoutsCount}/5 TRYOUTS SOLVED
              </span>
            )}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Choose Your Operational Track
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Members can specialize in one discipline or cross-train across multiple divisions. Test your instincts with a 2-minute interactive tryout (+100 XP each) or join a division directly.
          </p>
        </div>

        {/* Track Selection Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {TRACKS.map((track) => {
            const isSelected = track.id === activeTrackId;
            const isMemberDivision = isSignedInMember && memberProfile?.track === track.id;
            const tryoutDone = Boolean(effectiveCompletedTryouts[track.id]);
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => {
                  setActiveTrackId(track.id);
                  setTrackNotice(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/15 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {getTrackIcon(track.id)}
                <span>{track.title.split('&')[0].trim()}</span>
                {isMemberDivision && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                    ACTIVE
                  </span>
                )}
                {tryoutDone && !isMemberDivision && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Track Spotlight Card */}
        <div className="relative rounded-3xl bg-[#0b1222] border border-cyan-900/60 p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden">
          {/* Subtle accent gradient line at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Spotlight Mode Switcher: Overview vs. 2-Minute Tryout Mini-Game */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${activeTrack.color}`}>
                {activeTrack.badge}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Meets: {activeTrack.meetingDay}</span>
              </span>
              {isCurrentActiveTrack && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>✓ Active Track Member</span>
                </span>
              )}
            </div>

            <div className="inline-flex items-center p-1 rounded-xl bg-[#060b16] border border-slate-800 font-mono text-xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveSubTab('overview')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeSubTab === 'overview'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Division Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('tryout')}
                className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSubTab === 'tryout'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-300 hover:text-emerald-300'
                }`}
              >
                {isTryoutDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>2-Min Track Tryout</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {isTryoutDone ? 'SOLVED' : '+100 XP'}
                </span>
              </button>
            </div>
          </div>

          {activeSubTab === 'overview' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Col: Overview & Project */}
              <div className="lg:col-span-7 space-y-6">
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

                {trackNotice && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-600/50 text-emerald-300 text-xs font-mono">
                    {trackNotice}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-1 flex flex-wrap items-center gap-3">
                  {isSignedInMember && isCurrentActiveTrack ? (
                    <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 border border-emerald-500/50">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>✓ Active Track Member ({activeTrack.badge})</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={updatingTrack}
                      onClick={() => void handleApplyOrJoinTrack()}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 shadow-md transition-all cursor-pointer"
                    >
                      {updatingTrack ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Syncing Track to Firestore...</span>
                        </>
                      ) : isSignedInMember ? (
                        <>
                          <UserCheck className="w-4 h-4" />
                          <span>Apply with Interest · Join {activeTrack.badge}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>Apply with Interest in {activeTrack.badge}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveSubTab('tryout')}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-mono text-xs font-bold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/50 transition-all cursor-pointer"
                  >
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>{isTryoutDone ? 'Review Tryout (+100 XP)' : 'Try 2-Min Mini-Game (+100 XP)'}</span>
                  </button>

                  {!isSignedInMember && (
                    <button
                      type="button"
                      onClick={() => setIsDashboardOpen(true)}
                      className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                    >
                      Already a Member? Sign In
                    </button>
                  )}
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
          ) : (
            /* 2-Minute Track Tryout Interactive Mini-Game Panel */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-mono text-white">
                    {activeTrack.title} — 2-Minute Track Tryout
                  </h3>
                  <p className="text-xs text-slate-400">
                    Complete this quick division exercise to unlock <strong className="text-amber-300">+100 XP</strong> in your Member Profile and read the real-world security debrief.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('overview')}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 self-start sm:self-auto cursor-pointer"
                >
                  ← Back to Division Overview
                </button>
              </div>

              <TrackTryoutPanel
                key={activeTrack.id}
                trackId={activeTrack.id}
                isCompleted={isTryoutDone}
                onComplete={() => void completeTrackTryout(activeTrack.id, 100)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
