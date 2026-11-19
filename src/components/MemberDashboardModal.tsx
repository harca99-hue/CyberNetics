import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  Shield,
  ShieldCheck,
  Award,
  Flag,
  UserCheck,
  LogOut,
  Cloud,
  Sparkles,
  CheckCircle2,
  Lock,
  Activity,
  FileCode,
  Server,
  Database,
  Binary,
  ChevronRight,
  Edit3,
  Save,
  Loader2,
  AlertCircle,
  Flame,
  Crown,
  Terminal,
  Mail,
} from 'lucide-react';
import {
  useMember,
  RANK_TIERS,
  KNOWN_CTF_FLAGS,
  ALL_TRACK_IDS,
} from '../context/MemberContext';
import { TrackId, WarRoomModuleId } from '../types';

const TRACK_LABELS: { id: TrackId; label: string }[] = [
  { id: 'offensive', label: 'Offensive Security & Red Team' },
  { id: 'defensive', label: 'Defensive SOC & Blue Team' },
  { id: 'reverse-engineering', label: 'Reverse Engineering & Binary Pwn' },
  { id: 'cloud-sec', label: 'Cloud & Kubernetes Security' },
  { id: 'crypto', label: 'Applied Cryptography & Privacy' },
];

const WAR_ROOM_CATALOG: {
  id: WarRoomModuleId;
  title: string;
  tierLabel: string;
  xp: number;
  mitre: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'python-appsec-patcher', title: 'Python Secure Code Patcher', tierLabel: 'Tier 1 · Cadet', xp: 150, mitre: 'CWE-78 / CWE-89', icon: FileCode },
  { id: 'linux-cli-defense', title: 'Linux & CLI Defense Lab', tierLabel: 'Tier 1 · Cadet', xp: 150, mitre: 'CWE-732 / T1053', icon: Terminal },
  { id: 'packet-phishing-triage', title: 'Packet & Phishing Triage', tierLabel: 'Tier 1 · Cadet', xp: 150, mitre: 'T1566 / T1071', icon: Mail },
  { id: 'siem-forensics', title: 'SIEM Log Forensics', tierLabel: 'Tier 2 · SOC Analyst', xp: 250, mitre: 'T1190 / T1059', icon: Activity },
  { id: 'memory-malware', title: 'Memory & C2 Triage', tierLabel: 'Tier 2 · SOC Analyst', xp: 250, mitre: 'T1055 / T1071', icon: Server },
  { id: 'smart-contract', title: 'Smart Contract Audit', tierLabel: 'Tier 2 · SOC Analyst', xp: 200, mitre: 'CWE-841 / SWC-107', icon: Database },
  { id: 'web-exploit-chain', title: 'Web Exploit Chain', tierLabel: 'Tier 3 · Principal', xp: 250, mitre: 'T1190 / T1078', icon: FileCode },
  { id: 'binary-rop', title: 'Binary Analysis & ROP', tierLabel: 'Tier 3 · Principal', xp: 300, mitre: 'T1203 / CWE-121', icon: Binary },
];

export const MemberDashboardModal: React.FC = () => {
  const {
    firebaseUser,
    memberProfile,
    profileLoading,
    needsProfileSetup,
    isDashboardOpen,
    setIsDashboardOpen,
    leaderboard,
    leaderboardLoading,
    myLeaderboardRank,
    syncStatus,
    effectiveXp,
    effectiveCompletedModules,
    effectiveCompletedTryouts,
    effectiveRank,
    signInWithGoogleAndRegister,
    registerOrUpdateProfile,
    signOutMember,
    submitCtfFlag,
    resetWarRoomProgress,
  } = useMember();

  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'leaderboard' | 'profile'>('overview');
  const [authTab, setAuthTab] = useState<'register' | 'leaderboard'>('register');

  // Registration / Edit form fields
  const [profileNameInput, setProfileNameInput] = useState('');
  const [callsignInput, setCallsignInput] = useState('');
  const [trackInput, setTrackInput] = useState<TrackId>('offensive');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // CTF Flag submission
  const [flagInput, setFlagInput] = useState('');
  const [flagFeedback, setFlagFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [flagSubmitting, setFlagSubmitting] = useState(false);

  // Pre-fill form when user authenticates or edits profile
  useEffect(() => {
    if (memberProfile) {
      setProfileNameInput(memberProfile.profileName);
      setCallsignInput(memberProfile.callsign || '');
      setTrackInput(memberProfile.track || 'offensive');
    } else if (firebaseUser && !profileNameInput) {
      setProfileNameInput(firebaseUser.displayName || '');
    }
  }, [memberProfile, firebaseUser]);

  if (!isDashboardOpen) return null;

  const isFullySignedIn = Boolean(firebaseUser && memberProfile);
  const solvedModulesCount = WAR_ROOM_CATALOG.filter((m) => Boolean(effectiveCompletedModules[m.id])).length;
  const totalModulesCount = WAR_ROOM_CATALOG.length;
  const solvedTryoutsCount = ALL_TRACK_IDS.filter((tid) => Boolean(effectiveCompletedTryouts[tid])).length;

  const handleGoogleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);
    try {
      await signInWithGoogleAndRegister(
        profileNameInput.trim()
          ? {
              profileName: profileNameInput.trim(),
              callsign: callsignInput.trim(),
              track: trackInput,
            }
          : undefined
      );
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/popup-blocked') {
        setAuthError('Browser blocked the Google Sign-In popup. Please allow popups for this site and try again.');
      } else if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setAuthError('Sign-in popup was closed before completing authentication.');
      } else {
        setAuthError(err?.message || 'Unable to sign in with Google. Check connection and try again.');
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleCompleteProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!profileNameInput.trim()) {
      setAuthError('Please enter a Student Profile Name.');
      return;
    }
    setAuthSubmitting(true);
    try {
      await registerOrUpdateProfile({
        profileName: profileNameInput.trim(),
        callsign: callsignInput.trim(),
        track: trackInput,
      });
      setSaveMessage('Profile registered & synced to Cloud Firestore!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to save profile.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlagSubmitting(true);
    setFlagFeedback(null);
    try {
      const res = await submitCtfFlag(flagInput);
      setFlagFeedback({ ok: res.ok, message: res.message });
      if (res.ok && (res.xpAwarded ?? 0) > 0) {
        setFlagInput('');
      }
    } catch (err: any) {
      setFlagFeedback({ ok: false, message: err?.message || 'Failed to verify flag.' });
    } finally {
      setFlagSubmitting(false);
    }
  };

  const jumpToWarRoom = () => {
    setIsDashboardOpen(false);
    const el = document.getElementById('games');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      id="member-dashboard-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsDashboardOpen(false);
      }}
    >
      <div className="relative w-full max-w-4xl bg-[#090d16] border border-cyan-500/35 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Top Gradient Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-500" />

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 bg-[#070b13] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              {isFullySignedIn ? <Trophy className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white font-mono truncate">
                  {isFullySignedIn ? `${memberProfile!.profileName} // MEMBER DASHBOARD` : 'CYBER NETICS // MEMBER PORTAL'}
                </h2>
                {isFullySignedIn && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${effectiveRank.badgeColor}`}>
                    LVL {effectiveRank.level} · {effectiveRank.title}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
                <Cloud className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {isFullySignedIn
                    ? syncStatus === 'syncing'
                      ? 'Syncing state to Cloud Firestore...'
                      : 'Cloud Firestore Persistence Active'
                    : 'Sign in with Google & Profile Name to persist XP, rank & SOC lab states'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {firebaseUser && (
              <button
                onClick={signOutMember}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/50 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-700/50 text-xs font-mono transition-colors cursor-pointer"
                title="Sign out of Member Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
            <button
              onClick={() => setIsDashboardOpen(false)}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Member Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        {profileLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-300 font-mono text-sm">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <span>Loading member profile &amp; SOC states from Cloud Firestore...</span>
          </div>
        ) : !firebaseUser || needsProfileSetup ? (
          /* ================= AUTHENTICATION / PROFILE REGISTRATION VIEW ================= */
          <div className="flex-1 overflow-y-auto terminal-scroll p-5 sm:p-6">
            {/* Switch between Registration and Public Leaderboard */}
            <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
              <button
                onClick={() => setAuthTab('register')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  authTab === 'register'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {needsProfileSetup ? 'Complete Cadet Registration' : 'Member Sign Up / Sign In'}
              </button>
              <button
                onClick={() => setAuthTab('leaderboard')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  authTab === 'leaderboard'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Club Leaderboard ({leaderboard.length})</span>
              </button>
            </div>

            {authTab === 'leaderboard' ? (
              <LeaderboardTable
                entries={leaderboard}
                loading={leaderboardLoading}
                currentUid={firebaseUser?.uid}
              />
            ) : (
              <div className="max-w-xl mx-auto space-y-5">
                {/* Pending Session Progress Notice */}
                {(effectiveXp > 0 || solvedModulesCount > 0) && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-xs font-mono text-emerald-200">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Detected <strong>{effectiveXp} XP</strong> ({solvedModulesCount}/{totalModulesCount} labs solved) from your current session! Sign in now to save it permanently to Cloud Firestore.
                    </span>
                  </div>
                )}

                {needsProfileSetup && firebaseUser ? (
                  <form onSubmit={handleCompleteProfileSetup} className="space-y-4 bg-[#0c1324] border border-cyan-800/50 rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
                      <UserCheck className="w-4 h-4" />
                      <span>Step 2: Set Your Student Profile Name</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Signed in as <strong className="text-white">{firebaseUser.email}</strong>. Choose the display name and track you want shown on your Member Dashboard and Club Leaderboard.
                    </p>

                    <ProfileFormFields
                      profileName={profileNameInput}
                      setProfileName={setProfileNameInput}
                      callsign={callsignInput}
                      setCallsign={setCallsignInput}
                      track={trackInput}
                      setTrack={setTrackInput}
                    />

                    {authError && (
                      <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-700/50 text-rose-300 text-xs font-mono flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{authError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={authSubmitting}
                      className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {authSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>Activate Member Profile &amp; Sync Firestore</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleGoogleSignIn} className="space-y-4 bg-[#0c1324] border border-slate-800 rounded-2xl p-5 sm:p-6">
                    <div>
                      <h3 className="text-base font-bold text-white font-mono">
                        Student Cadet Sign-Up &amp; Login
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Enter your Student Profile Name (for new accounts) and authenticate with Google to sync your XP, rank, CTF flags, and SOC simulations to Cloud Firestore.
                      </p>
                    </div>

                    <ProfileFormFields
                      profileName={profileNameInput}
                      setProfileName={setProfileNameInput}
                      callsign={callsignInput}
                      setCallsign={setCallsignInput}
                      track={trackInput}
                      setTrack={setTrackInput}
                      optionalForReturning
                    />

                    {authError && (
                      <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-700/50 text-rose-300 text-xs font-mono flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{authError}</span>
                      </div>
                    )}

                    <button
                      id="member-google-signin-btn"
                      type="submit"
                      disabled={authSubmitting}
                      className="w-full py-3 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-[0_0_24px_rgba(34,211,238,0.3)] cursor-pointer disabled:opacity-60"
                    >
                      {authSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                      <span>Sign In / Register with Google</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="text-[11px] font-mono text-slate-500 text-center pt-1">
                      Returning members: just click Sign In — your existing XP &amp; SOC labs load automatically from Firestore.
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ================= AUTHENTICATED MEMBER DASHBOARD ================= */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Sub-Navigation Tabs */}
            <div className="flex items-center gap-1.5 px-5 sm:px-6 py-2.5 border-b border-slate-800 bg-[#080d18] overflow-x-auto shrink-0">
              {[
                { id: 'overview', label: 'Overview & SOC Progress', icon: Trophy },
                { id: 'achievements', label: `CTF Flags & Badges (${memberProfile!.solvedFlags.length})`, icon: Flag },
                { id: 'leaderboard', label: 'Club Leaderboard', icon: Crown },
                { id: 'profile', label: 'Edit Profile', icon: Edit3 },
              ].map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {saveMessage && (
              <div className="px-6 py-2 bg-emerald-950/60 border-b border-emerald-600/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{saveMessage}</span>
              </div>
            )}

            <div className="flex-1 overflow-y-auto terminal-scroll p-5 sm:p-6 space-y-6">
              {activeTab === 'overview' && (
                <>
                  {/* Top XP & Rank Hero Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Rank Card */}
                    <div className="md:col-span-2 bg-gradient-to-br from-[#0e192e] to-[#080e1c] border border-cyan-500/30 rounded-2xl p-5 space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
                            Current Clearance Rank
                          </span>
                          <div className="flex items-center gap-2.5 mt-1">
                            <h3 className="text-2xl font-black text-white font-mono">
                              {effectiveRank.title}
                            </h3>
                            <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${effectiveRank.badgeColor}`}>
                              LVL {effectiveRank.level}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-1">
                            @{memberProfile!.callsign || 'cadet'} · {TRACK_LABELS.find((tr) => tr.id === memberProfile!.track)?.label || memberProfile!.track}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] font-mono uppercase text-slate-400 block">
                            Total Earned XP
                          </span>
                          <span className="text-3xl font-black text-amber-300 font-mono">
                            {effectiveXp} <span className="text-sm text-amber-500">XP</span>
                          </span>
                        </div>
                      </div>

                      {/* XP Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-300">
                            {effectiveRank.nextTitle
                              ? `Next Rank: ${effectiveRank.nextTitle} (${effectiveRank.nextXp} XP)`
                              : 'Maximum Clearance Achieved!'}
                          </span>
                          <span className="text-cyan-300 font-bold">
                            {effectiveRank.nextTitle ? `${effectiveRank.xpToNext} XP remaining` : '100%'}
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 transition-all duration-500"
                            style={{ width: `${effectiveRank.progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Rank Tier Ladder Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {RANK_TIERS.map((tier) => {
                          const unlocked = effectiveXp >= tier.minXp;
                          return (
                            <span
                              key={tier.level}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                                unlocked
                                  ? tier.badgeColor
                                  : 'text-slate-500 bg-slate-950/60 border-slate-800/80'
                              }`}
                            >
                              L{tier.level}: {tier.title} ({tier.minXp}+)
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Stats Card */}
                    <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-slate-400">Leaderboard Rank</span>
                          <span className="text-lg font-black font-mono text-cyan-300">
                            {myLeaderboardRank ? `#${myLeaderboardRank}` : 'Unranked'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-slate-400">Labs &amp; SOC Modules</span>
                          <span className="text-lg font-black font-mono text-emerald-400">
                            {solvedModulesCount} / {totalModulesCount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-slate-400">Track Tryouts (+100 XP)</span>
                          <span className="text-lg font-black font-mono text-purple-300">
                            {solvedTryoutsCount} / {ALL_TRACK_IDS.length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-slate-400">CTF Flags Verified</span>
                          <span className="text-lg font-black font-mono text-amber-300">
                            {memberProfile!.solvedFlags.length} / {KNOWN_CTF_FLAGS.length}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={jumpToWarRoom}
                        className="w-full py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-200 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Flame className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Launch SOC War Room</span>
                      </button>
                    </div>
                  </div>

                  {/* Persisted SOC Incident Response Simulation States */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        <span>Persisted SOC Incident Response Simulations</span>
                      </h4>
                      {solvedModulesCount > 0 && (
                        <button
                          onClick={async () => {
                            if (window.confirm(`Reset all ${totalModulesCount} lab & SOC simulation completion states in Cloud Firestore?`)) {
                              await resetWarRoomProgress();
                            }
                          }}
                          className="text-[11px] font-mono text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          Reset Simulation States
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {WAR_ROOM_CATALOG.map((mod) => {
                        const Icon = mod.icon;
                        const isDone = Boolean(effectiveCompletedModules[mod.id]);
                        const modState = memberProfile?.moduleStates?.[mod.id];

                        return (
                          <div
                            key={mod.id}
                            className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                              isDone
                                ? 'bg-emerald-950/20 border-emerald-700/50'
                                : 'bg-[#0b1220] border-slate-800/80'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className={`p-1.5 rounded-lg ${isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                {isDone ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-full">
                                    <CheckCircle2 className="w-3 h-3" /> MITIGATED (+{mod.xp} XP)
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-full">
                                    PENDING · +{mod.xp} XP
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-bold text-white font-mono">{mod.title}</span>
                              </div>
                              <div className="text-[11px] font-mono text-cyan-400/90 mt-0.5">{mod.tierLabel} · {mod.mitre}</div>
                              {modState?.stageNotes && (
                                <div className="mt-2 text-[11px] font-mono text-cyan-300/90 bg-slate-950/70 px-2 py-1 rounded border border-slate-800 truncate">
                                  {modState.stageNotes}
                                </div>
                              )}
                            </div>

                            {!isDone && (
                              <button
                                onClick={jumpToWarRoom}
                                className="mt-3 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                              >
                                <span>Engage Simulation</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'achievements' && (
                <div className="space-y-6">
                  {/* CTF Flag Verifier */}
                  <div className="bg-[#0b1222] border border-cyan-800/40 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
                      <Flag className="w-4 h-4" />
                      <span>Submit &amp; Verify Captured CTF Flag</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Found a <code className="text-cyan-300">CYBERNETICS&#123;...&#125;</code> flag inside the Web Exploit Chain console, x86_64 ROP root shell, or Club Entrance challenge? Submit it here to earn bonus XP and persist your badge to Firestore.
                    </p>

                    <form onSubmit={handleFlagSubmit} className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="text"
                        value={flagInput}
                        onChange={(e) => setFlagInput(e.target.value)}
                        placeholder="CYBERNETICS{...}"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#060911] border border-slate-700 focus:border-cyan-400 text-xs font-mono text-white focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={flagSubmitting}
                        className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 disabled:opacity-60"
                      >
                        {flagSubmitting ? 'Verifying...' : 'Verify Flag'}
                      </button>
                    </form>

                    {flagFeedback && (
                      <div
                        className={`p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
                          flagFeedback.ok
                            ? 'bg-emerald-950/50 border-emerald-700/60 text-emerald-300'
                            : 'bg-rose-950/50 border-rose-700/60 text-rose-300'
                        }`}
                      >
                        {flagFeedback.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                        <span>{flagFeedback.message}</span>
                      </div>
                    )}
                  </div>

                  {/* CTF Badges Grid */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Lab &amp; CTF Achievements</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {KNOWN_CTF_FLAGS.map((item) => {
                        const unlocked = memberProfile!.solvedFlags.includes(item.flag);
                        return (
                          <div
                            key={item.id}
                            className={`p-4 rounded-xl border flex items-start gap-3 ${
                              unlocked
                                ? 'bg-amber-950/20 border-amber-600/50'
                                : 'bg-[#0b1220] border-slate-800/80 opacity-75'
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                                unlocked
                                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-500'
                              }`}
                            >
                              {unlocked ? <Trophy className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold font-mono text-white truncate">
                                  {item.title}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-amber-300 shrink-0">
                                  +{item.xpBonus} XP
                                </span>
                              </div>
                              <div className="text-[10px] font-mono text-cyan-400 mt-0.5">{item.category}</div>
                              <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'leaderboard' && (
                <LeaderboardTable
                  entries={leaderboard}
                  loading={leaderboardLoading}
                  currentUid={firebaseUser?.uid}
                />
              )}

              {activeTab === 'profile' && (
                <form onSubmit={handleCompleteProfileSetup} className="max-w-lg mx-auto space-y-4 bg-[#0b1222] border border-slate-800 rounded-2xl p-5">
                  <h4 className="text-sm font-bold font-mono text-white">Update Member Profile</h4>
                  <ProfileFormFields
                    profileName={profileNameInput}
                    setProfileName={setProfileNameInput}
                    callsign={callsignInput}
                    setCallsign={setCallsignInput}
                    track={trackInput}
                    setTrack={setTrackInput}
                  />
                  {authError && (
                    <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-700/50 text-rose-300 text-xs font-mono">
                      {authError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {authSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Changes to Firestore</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- Helper Subcomponents ---------- */

interface ProfileFormFieldsProps {
  profileName: string;
  setProfileName: (v: string) => void;
  callsign: string;
  setCallsign: (v: string) => void;
  track: TrackId;
  setTrack: (v: TrackId) => void;
  optionalForReturning?: boolean;
}

const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({
  profileName,
  setProfileName,
  callsign,
  setCallsign,
  track,
  setTrack,
  optionalForReturning,
}) => (
  <div className="space-y-3">
    <div>
      <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
        Student Profile Name {optionalForReturning ? '(for new registration)' : '*'}
      </label>
      <input
        type="text"
        maxLength={60}
        value={profileName}
        onChange={(e) => setProfileName(e.target.value)}
        placeholder="e.g. Jordan Vance"
        className="w-full px-3.5 py-2.5 bg-[#060911] border border-slate-700 focus:border-cyan-400 rounded-xl text-sm text-white focus:outline-none font-sans"
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
          Hacker Callsign / Handle
        </label>
        <input
          type="text"
          maxLength={40}
          value={callsign}
          onChange={(e) => setCallsign(e.target.value)}
          placeholder="e.g. PacketGhost"
          className="w-full px-3.5 py-2.5 bg-[#060911] border border-slate-700 focus:border-cyan-400 rounded-xl text-sm text-white focus:outline-none font-mono"
        />
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
          Primary Club Track
        </label>
        <select
          value={track}
          onChange={(e) => setTrack(e.target.value as TrackId)}
          className="w-full px-3 py-2.5 bg-[#060911] border border-slate-700 focus:border-cyan-400 rounded-xl text-xs text-white focus:outline-none font-mono"
        >
          {TRACK_LABELS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

interface LeaderboardTableProps {
  entries: ReturnType<typeof useMember>['leaderboard'];
  loading: boolean;
  currentUid?: string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, loading, currentUid }) => {
  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
        <span>Fetching live standings from Cloud Firestore...</span>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="py-12 text-center bg-[#0b1222] border border-slate-800 rounded-2xl p-6 space-y-2">
        <Crown className="w-8 h-8 text-amber-400 mx-auto opacity-80" />
        <p className="text-sm font-mono font-bold text-white">No operators on the leaderboard yet</p>
        <p className="text-xs text-slate-400">
          Sign in with your Student Profile Name and solve a SOC War Room scenario to claim Rank #1!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Live Cyber Netics XP Standings</span>
        </h4>
        <span className="text-[11px] font-mono text-slate-500">Top {entries.length} Operators</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0b1222]">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-[#070b14]">
              <th className="py-2.5 px-3.5">#</th>
              <th className="py-2.5 px-3.5">Member</th>
              <th className="py-2.5 px-3.5">Rank</th>
              <th className="py-2.5 px-3.5 hidden sm:table-cell">SOC Labs</th>
              <th className="py-2.5 px-3.5 hidden sm:table-cell">Flags</th>
              <th className="py-2.5 px-3.5 text-right">XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {entries.map((row, idx) => {
              const isMe = currentUid && row.uid === currentUid;
              return (
                <tr key={row.uid} className={isMe ? 'bg-cyan-950/30' : 'hover:bg-slate-900/40'}>
                  <td className="py-2.5 px-3.5 font-bold text-slate-300">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{row.profileName}</span>
                      {isMe && (
                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">
                          YOU
                        </span>
                      )}
                    </div>
                    {row.callsign && <div className="text-[10px] text-slate-500">@{row.callsign}</div>}
                  </td>
                  <td className="py-2.5 px-3.5 text-cyan-300">{row.rank}</td>
                  <td className="py-2.5 px-3.5 text-emerald-400 hidden sm:table-cell">{row.solvedCount}/{WAR_ROOM_CATALOG.length}</td>
                  <td className="py-2.5 px-3.5 text-amber-300 hidden sm:table-cell">{row.flagsCount}</td>
                  <td className="py-2.5 px-3.5 text-right font-bold text-amber-300">{row.xp} XP</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
