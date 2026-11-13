import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  query,
  orderBy,
  limit,
  handleFirestoreError,
  OperationType,
  User,
} from '../firebase';
import {
  LeaderboardEntry,
  MemberGameProfile,
  ModuleProgressState,
  TrackId,
  WarRoomModuleId,
} from '../types';

export interface RankTierInfo {
  title: string;
  level: number;
  minXp: number;
  nextTitle: string | null;
  nextXp: number | null;
  progressPercent: number;
  xpToNext: number;
  badgeColor: string;
}

export const RANK_TIERS = [
  { level: 1, minXp: 0, title: 'Recruit Cadet', badgeColor: 'text-slate-300 bg-slate-800/80 border-slate-600' },
  { level: 2, minXp: 250, title: 'SOC Tier-1 Analyst', badgeColor: 'text-cyan-300 bg-cyan-950/70 border-cyan-600/60' },
  { level: 3, minXp: 500, title: 'Threat Hunter', badgeColor: 'text-emerald-300 bg-emerald-950/70 border-emerald-600/60' },
  { level: 4, minXp: 750, title: 'Red Team Operator', badgeColor: 'text-purple-300 bg-purple-950/70 border-purple-600/60' },
  { level: 5, minXp: 1100, title: 'SOC War Room Director', badgeColor: 'text-amber-300 bg-amber-950/70 border-amber-500/70' },
];

export function calculateRankInfo(xp: number): RankTierInfo {
  let current = RANK_TIERS[0];
  let next: (typeof RANK_TIERS)[number] | null = RANK_TIERS[1];

  for (let i = 0; i < RANK_TIERS.length; i++) {
    if (xp >= RANK_TIERS[i].minXp) {
      current = RANK_TIERS[i];
      next = RANK_TIERS[i + 1] || null;
    }
  }

  if (!next) {
    return {
      title: current.title,
      level: current.level,
      minXp: current.minXp,
      nextTitle: null,
      nextXp: null,
      progressPercent: 100,
      xpToNext: 0,
      badgeColor: current.badgeColor,
    };
  }

  const span = next.minXp - current.minXp;
  const gained = Math.max(0, xp - current.minXp);
  const progressPercent = Math.min(100, Math.round((gained / span) * 100));

  return {
    title: current.title,
    level: current.level,
    minXp: current.minXp,
    nextTitle: next.title,
    nextXp: next.minXp,
    progressPercent,
    xpToNext: Math.max(0, next.minXp - xp),
    badgeColor: current.badgeColor,
  };
}

export interface CtfFlagMeta {
  flag: string;
  id: string;
  title: string;
  category: string;
  xpBonus: number;
  description: string;
}

export const KNOWN_CTF_FLAGS: CtfFlagMeta[] = [
  {
    flag: 'CYBERNETICS{h4ck3r_2026_n3tics}',
    id: 'FLAG_RECRUIT_CIPHER',
    title: 'Recruit Entrance Cipher',
    category: 'Cryptography',
    xpBonus: 100,
    description: 'Decoded the Cyber Netics Base64 recruit entrance beacon.',
  },
  {
    flag: 'CYBERNETICS{WEB_CHAIN_IDOR_JWT_POLYGLOT_PWNED}',
    id: 'FLAG_WEB_EXPLOIT_CHAIN',
    title: 'Web Exploit Chain Vault',
    category: 'Web Exploitation',
    xpBonus: 150,
    description: 'Pivoted IDOR -> forged HS256 JWT -> bypassed polyglot MIME filter.',
  },
  {
    flag: 'CYBERNETICS{ROP_CHAIN_RET2LIBC_x86_64_PWNED_2025}',
    id: 'FLAG_BINARY_ROP',
    title: 'x86_64 ROP Root Shell',
    category: 'Binary Exploitation',
    xpBonus: 150,
    description: 'Constructed aligned System V AMD64 ROP chain to read root flag.txt.',
  },
  {
    flag: 'CYBERNETICS{SOC_TIER3_WAR_ROOM_DIRECTOR_2025}',
    id: 'FLAG_WAR_ROOM_DIRECTOR',
    title: 'Tier-3 War Room Director',
    category: 'Full Spectrum SOC',
    xpBonus: 200,
    description: 'Mitigated all 5 SOC Incident Response War Room simulations.',
  },
];

export const DEFAULT_COMPLETED_MODULES: Record<WarRoomModuleId, boolean> = {
  'siem-forensics': false,
  'web-exploit-chain': false,
  'memory-malware': false,
  'smart-contract': false,
  'binary-rop': false,
};

export interface RegistrationPayload {
  profileName: string;
  callsign?: string;
  track: TrackId;
}

interface MemberContextType {
  firebaseUser: User | null;
  memberProfile: MemberGameProfile | null;
  authReady: boolean;
  profileLoading: boolean;
  needsProfileSetup: boolean;
  isDashboardOpen: boolean;
  setIsDashboardOpen: (open: boolean) => void;
  leaderboard: LeaderboardEntry[];
  leaderboardLoading: boolean;
  myLeaderboardRank: number | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncError: string | null;

  // Effective War Room State (Firestore if signed in, session state before sign-in)
  effectiveXp: number;
  effectiveCompletedModules: Record<WarRoomModuleId, boolean>;
  effectiveModuleStates: Partial<Record<WarRoomModuleId, ModuleProgressState>>;
  effectiveRank: RankTierInfo;

  // Auth & Registration
  signInWithGoogleAndRegister: (pendingProfile?: RegistrationPayload) => Promise<void>;
  registerOrUpdateProfile: (payload: RegistrationPayload) => Promise<void>;
  signOutMember: () => Promise<void>;

  // Persisted Game & CTF Actions
  completeWarRoomModule: (modId: WarRoomModuleId, xpEarned: number, stageNotes?: string) => Promise<void>;
  saveModuleStageNotes: (modId: WarRoomModuleId, stageNotes: string) => Promise<void>;
  submitCtfFlag: (flagInput: string) => Promise<{ ok: boolean; message: string; xpAwarded?: number }>;
  resetWarRoomProgress: () => Promise<void>;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

const sanitizeIdSlug = (raw: string, fallback: string) => {
  const cleaned = raw.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '');
  return cleaned.slice(0, 40) || fallback;
};

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [memberProfile, setMemberProfile] = useState<MemberGameProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);

  // Pre-auth session state so guests can play immediately and merge on sign-in
  const [sessionXp, setSessionXp] = useState<number>(0);
  const [sessionCompletedModules, setSessionCompletedModules] = useState<Record<WarRoomModuleId, boolean>>(
    DEFAULT_COMPLETED_MODULES
  );
  const [sessionModuleStates, setSessionModuleStates] = useState<Partial<Record<WarRoomModuleId, ModuleProgressState>>>({});
  const [sessionFlags, setSessionFlags] = useState<string[]>([]);

  // Store pending registration input if user clicks Google Sign-In with a chosen profile name
  const [pendingReg, setPendingReg] = useState<RegistrationPayload | null>(null);

  // 1. Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthReady(true);
      if (!user) {
        setMemberProfile(null);
        setNeedsProfileSetup(false);
        setProfileLoading(false);
      }
    });
    return () => unsub();
  }, []);

  // 2. Real-time Firestore Listener for Authenticated Member Profile
  useEffect(() => {
    if (!authReady || !firebaseUser) return;

    setProfileLoading(true);
    const profilePath = `member_profiles/${firebaseUser.uid}`;
    const profileRef = doc(db, 'member_profiles', firebaseUser.uid);

    const unsub = onSnapshot(
      profileRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as MemberGameProfile;
          setMemberProfile({
            ...data,
            completedModules: { ...DEFAULT_COMPLETED_MODULES, ...(data.completedModules || {}) },
            moduleStates: data.moduleStates || {},
            solvedFlags: data.solvedFlags || [],
            achievements: data.achievements || [],
          });
          setNeedsProfileSetup(false);
          setProfileLoading(false);
          setSyncStatus('synced');
        } else {
          // If user provided pending registration details before Google sign-in, auto-create profile
          if (pendingReg && pendingReg.profileName.trim().length > 0) {
            try {
              await createInitialProfileInFirestore(firebaseUser, pendingReg);
              setPendingReg(null);
            } catch (err) {
              console.error('Auto-create profile failed:', err);
              setNeedsProfileSetup(true);
            }
          } else {
            setMemberProfile(null);
            setNeedsProfileSetup(true);
          }
          setProfileLoading(false);
        }
      },
      (error) => {
        setProfileLoading(false);
        setSyncStatus('error');
        setLastSyncError(error.message);
        handleFirestoreError(error, OperationType.GET, profilePath);
      }
    );

    return () => unsub();
  }, [authReady, firebaseUser, pendingReg]);

  // 3. Real-time Public Leaderboard Listener (Zero PII)
  useEffect(() => {
    const leaderboardQuery = query(collection(db, 'leaderboard'), orderBy('xp', 'desc'), limit(25));
    const unsub = onSnapshot(
      leaderboardQuery,
      (snapshot) => {
        const rows: LeaderboardEntry[] = snapshot.docs.map((d) => d.data() as LeaderboardEntry);
        setLeaderboard(rows);
        setLeaderboardLoading(false);
      },
      (error) => {
        setLeaderboardLoading(false);
        console.warn('Leaderboard subscription notice:', error.message);
      }
    );
    return () => unsub();
  }, []);

  // Helper: Atomic write to member_profiles & leaderboard
  const writeProfileAndLeaderboard = useCallback(
    async (
      user: User,
      nextProfile: Omit<MemberGameProfile, 'createdAt' | 'updatedAt'>,
      isNewDoc: boolean,
      existingCreatedAt?: unknown
    ) => {
      const uid = user.uid;
      setSyncStatus('syncing');
      setLastSyncError(null);

      const solvedCount = Object.values(nextProfile.completedModules).filter(Boolean).length;
      const flagsCount = nextProfile.solvedFlags.length;

      const batch = writeBatch(db);
      const profileRef = doc(db, 'member_profiles', uid);
      const leaderboardRef = doc(db, 'leaderboard', uid);

      const profileDocPayload: Record<string, unknown> = {
        uid,
        profileName: nextProfile.profileName.trim().slice(0, 60),
        callsign: (nextProfile.callsign || '').trim().slice(0, 40),
        track: nextProfile.track,
        xp: Math.max(0, Math.min(100000, nextProfile.xp)),
        rank: nextProfile.rank.slice(0, 60),
        completedModules: nextProfile.completedModules,
        moduleStates: nextProfile.moduleStates,
        solvedFlags: nextProfile.solvedFlags.slice(0, 50),
        achievements: nextProfile.achievements.slice(0, 50),
        updatedAt: serverTimestamp(),
      };

      if (isNewDoc) {
        if (user.email) {
          profileDocPayload.email = user.email.slice(0, 150);
        }
        profileDocPayload.createdAt = serverTimestamp();
      } else {
        if (nextProfile.email) {
          profileDocPayload.email = nextProfile.email.slice(0, 150);
        }
        profileDocPayload.createdAt = existingCreatedAt || serverTimestamp();
      }

      const leaderboardPayload: Record<string, unknown> = {
        uid,
        profileName: nextProfile.profileName.trim().slice(0, 60),
        callsign: (nextProfile.callsign || '').trim().slice(0, 40),
        track: nextProfile.track,
        xp: Math.max(0, Math.min(100000, nextProfile.xp)),
        rank: nextProfile.rank.slice(0, 60),
        solvedCount,
        flagsCount,
        updatedAt: serverTimestamp(),
      };

      try {
        if (isNewDoc) {
          batch.set(profileRef, profileDocPayload);
          batch.set(leaderboardRef, leaderboardPayload);
        } else {
          // Ensure leaderboard doc exists even if profile existed before leaderboard was introduced
          const lbSnap = await getDoc(leaderboardRef);
          batch.set(profileRef, profileDocPayload, { merge: true });
          if (lbSnap.exists()) {
            batch.update(leaderboardRef, leaderboardPayload);
          } else {
            batch.set(leaderboardRef, leaderboardPayload);
          }
        }
        await batch.commit();
        setSyncStatus('synced');
      } catch (err: any) {
        setSyncStatus('error');
        setLastSyncError(err?.message || 'Firestore write failed');
        handleFirestoreError(err, isNewDoc ? OperationType.CREATE : OperationType.UPDATE, `member_profiles/${uid}`);
      }
    },
    []
  );

  // Create initial profile merging any pre-auth session progress
  const createInitialProfileInFirestore = useCallback(
    async (user: User, payload: RegistrationPayload) => {
      const cleanName = payload.profileName.trim().slice(0, 60) || user.displayName || 'Cyber Cadet';
      const cleanCallsign =
        (payload.callsign || '').trim().slice(0, 40) || sanitizeIdSlug(cleanName, 'Agent_Zero');

      const mergedModules: Record<WarRoomModuleId, boolean> = {
        ...DEFAULT_COMPLETED_MODULES,
        ...sessionCompletedModules,
      };
      const mergedStates: Partial<Record<WarRoomModuleId, ModuleProgressState>> = {
        ...sessionModuleStates,
      };
      const mergedFlags = Array.from(new Set(sessionFlags));
      const mergedXp = sessionXp;
      const rankInfo = calculateRankInfo(mergedXp);

      const initialAchievements: string[] = [];
      (Object.keys(mergedModules) as WarRoomModuleId[]).forEach((modId) => {
        if (mergedModules[modId]) {
          initialAchievements.push(`WAR_ROOM_${modId.toUpperCase()}`);
        }
      });
      if (Object.values(mergedModules).every(Boolean)) {
        initialAchievements.push('SOC_WAR_ROOM_DIRECTOR');
      }

      await writeProfileAndLeaderboard(
        user,
        {
          uid: user.uid,
          profileName: cleanName,
          callsign: cleanCallsign,
          email: user.email || undefined,
          track: payload.track || 'offensive',
          xp: mergedXp,
          rank: rankInfo.title,
          completedModules: mergedModules,
          moduleStates: mergedStates,
          solvedFlags: mergedFlags,
          achievements: Array.from(new Set(initialAchievements)),
        },
        true
      );
    },
    [sessionCompletedModules, sessionFlags, sessionModuleStates, sessionXp, writeProfileAndLeaderboard]
  );

  const signInWithGoogleAndRegister = useCallback(async (pendingProfile?: RegistrationPayload) => {
    if (pendingProfile && pendingProfile.profileName.trim().length > 0) {
      setPendingReg(pendingProfile);
    }
    const result = await signInWithPopup(auth, googleProvider);
    const signedInUser = result.user;

    // Check if profile already exists
    const profileRef = doc(db, 'member_profiles', signedInUser.uid);
    try {
      const snap = await getDoc(profileRef);
      if (!snap.exists()) {
        if (pendingProfile && pendingProfile.profileName.trim().length > 0) {
          await createInitialProfileInFirestore(signedInUser, pendingProfile);
          setPendingReg(null);
        } else {
          setNeedsProfileSetup(true);
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `member_profiles/${signedInUser.uid}`);
    }
  }, [createInitialProfileInFirestore]);

  const registerOrUpdateProfile = useCallback(
    async (payload: RegistrationPayload) => {
      if (!firebaseUser) {
        throw new Error('Please sign in with Google first to save your profile to Cloud Firestore.');
      }

      const cleanName = payload.profileName.trim().slice(0, 60);
      if (!cleanName) {
        throw new Error('Profile name cannot be empty.');
      }
      const cleanCallsign =
        (payload.callsign || '').trim().slice(0, 40) || sanitizeIdSlug(cleanName, 'Agent_Zero');

      if (!memberProfile) {
        await createInitialProfileInFirestore(firebaseUser, {
          ...payload,
          profileName: cleanName,
          callsign: cleanCallsign,
        });
        setNeedsProfileSetup(false);
      } else {
        await writeProfileAndLeaderboard(
          firebaseUser,
          {
            ...memberProfile,
            profileName: cleanName,
            callsign: cleanCallsign,
            track: payload.track,
          },
          false,
          memberProfile.createdAt
        );
      }
    },
    [firebaseUser, memberProfile, createInitialProfileInFirestore, writeProfileAndLeaderboard]
  );

  const signOutMember = useCallback(async () => {
    await signOut(auth);
    setMemberProfile(null);
    setNeedsProfileSetup(false);
    setSyncStatus('idle');
  }, []);

  // Persist War Room simulation completion to Firestore
  const completeWarRoomModule = useCallback(
    async (modId: WarRoomModuleId, xpEarned: number, stageNotes?: string) => {
      if (firebaseUser && memberProfile) {
        const alreadyDone = Boolean(memberProfile.completedModules[modId]);
        const nextCompleted: Record<WarRoomModuleId, boolean> = {
          ...memberProfile.completedModules,
          [modId]: true,
        };
        const nextStates: Partial<Record<WarRoomModuleId, ModuleProgressState>> = {
          ...memberProfile.moduleStates,
          [modId]: {
            completed: true,
            xpEarned: alreadyDone ? (memberProfile.moduleStates[modId]?.xpEarned ?? xpEarned) : xpEarned,
            completedAt: memberProfile.moduleStates[modId]?.completedAt || new Date().toISOString(),
            stageNotes: stageNotes || memberProfile.moduleStates[modId]?.stageNotes || 'Mitigated & Verified',
          },
        };

        const xpDelta = alreadyDone ? 0 : xpEarned;
        const nextXp = memberProfile.xp + xpDelta;
        const nextRank = calculateRankInfo(nextXp).title;

        const nextAchievements = new Set(memberProfile.achievements);
        nextAchievements.add(`WAR_ROOM_${modId.toUpperCase()}`);
        if (Object.values(nextCompleted).every(Boolean)) {
          nextAchievements.add('SOC_WAR_ROOM_DIRECTOR');
        }

        await writeProfileAndLeaderboard(
          firebaseUser,
          {
            ...memberProfile,
            xp: nextXp,
            rank: nextRank,
            completedModules: nextCompleted,
            moduleStates: nextStates,
            achievements: Array.from(nextAchievements),
          },
          false,
          memberProfile.createdAt
        );
      } else {
        // Guest session state (prompted to sign in to persist in Firestore)
        const alreadyDone = Boolean(sessionCompletedModules[modId]);
        setSessionCompletedModules((prev) => ({ ...prev, [modId]: true }));
        setSessionModuleStates((prev) => ({
          ...prev,
          [modId]: {
            completed: true,
            xpEarned,
            completedAt: new Date().toISOString(),
            stageNotes: stageNotes || 'Mitigated (Session)',
          },
        }));
        if (!alreadyDone) {
          setSessionXp((prev) => prev + xpEarned);
        }
      }
    },
    [firebaseUser, memberProfile, sessionCompletedModules, writeProfileAndLeaderboard]
  );

  // Save intermediate stage notes for an active simulation
  const saveModuleStageNotes = useCallback(
    async (modId: WarRoomModuleId, stageNotes: string) => {
      if (firebaseUser && memberProfile) {
        const prevModState = memberProfile.moduleStates[modId];
        const nextStates: Partial<Record<WarRoomModuleId, ModuleProgressState>> = {
          ...memberProfile.moduleStates,
          [modId]: {
            completed: prevModState?.completed ?? Boolean(memberProfile.completedModules[modId]),
            xpEarned: prevModState?.xpEarned ?? 0,
            completedAt: prevModState?.completedAt,
            stageNotes: stageNotes.slice(0, 140),
          },
        };

        await writeProfileAndLeaderboard(
          firebaseUser,
          {
            ...memberProfile,
            moduleStates: nextStates,
          },
          false,
          memberProfile.createdAt
        );
      } else {
        setSessionModuleStates((prev) => ({
          ...prev,
          [modId]: {
            completed: prev[modId]?.completed ?? false,
            xpEarned: prev[modId]?.xpEarned ?? 0,
            completedAt: prev[modId]?.completedAt,
            stageNotes: stageNotes.slice(0, 140),
          },
        }));
      }
    },
    [firebaseUser, memberProfile, writeProfileAndLeaderboard]
  );

  // Submit & persist CTF flag
  const submitCtfFlag = useCallback(
    async (flagInput: string): Promise<{ ok: boolean; message: string; xpAwarded?: number }> => {
      const trimmed = flagInput.trim();
      if (!trimmed) {
        return { ok: false, message: 'Enter a CTF flag string (e.g. CYBERNETICS{...}).' };
      }

      const matched = KNOWN_CTF_FLAGS.find((f) => f.flag === trimmed);
      if (!matched) {
        return {
          ok: false,
          message: 'Unrecognized CTF flag. Verify syntax CYBERNETICS{...} from the War Room or Terminal!',
        };
      }

      if (firebaseUser && memberProfile) {
        if (memberProfile.solvedFlags.includes(matched.flag)) {
          return { ok: true, message: `Flag "${matched.title}" is already verified in your Firestore record.`, xpAwarded: 0 };
        }

        const nextFlags = [...memberProfile.solvedFlags, matched.flag];
        const nextAchievements = Array.from(new Set([...memberProfile.achievements, matched.id]));
        const nextXp = memberProfile.xp + matched.xpBonus;
        const nextRank = calculateRankInfo(nextXp).title;

        await writeProfileAndLeaderboard(
          firebaseUser,
          {
            ...memberProfile,
            xp: nextXp,
            rank: nextRank,
            solvedFlags: nextFlags,
            achievements: nextAchievements,
          },
          false,
          memberProfile.createdAt
        );

        return {
          ok: true,
          message: `Verified "${matched.title}"! +${matched.xpBonus} XP synced to Firestore.`,
          xpAwarded: matched.xpBonus,
        };
      } else {
        if (sessionFlags.includes(matched.flag)) {
          return { ok: true, message: `Flag "${matched.title}" recorded in session.`, xpAwarded: 0 };
        }
        setSessionFlags((prev) => [...prev, matched.flag]);
        setSessionXp((prev) => prev + matched.xpBonus);
        return {
          ok: true,
          message: `Verified "${matched.title}" (+${matched.xpBonus} XP)! Sign in to persist to Firestore.`,
          xpAwarded: matched.xpBonus,
        };
      }
    },
    [firebaseUser, memberProfile, sessionFlags, writeProfileAndLeaderboard]
  );

  // Reset War Room Simulations in Firestore
  const resetWarRoomProgress = useCallback(async () => {
    if (firebaseUser && memberProfile) {
      // Subtract War Room simulation XP while keeping verified CTF flag bonus XP
      const flagBonusXp = memberProfile.solvedFlags.reduce((sum, flagStr) => {
        const meta = KNOWN_CTF_FLAGS.find((f) => f.flag === flagStr);
        return sum + (meta?.xpBonus || 0);
      }, 0);
      const nextRank = calculateRankInfo(flagBonusXp).title;
      const filteredAchievements = memberProfile.achievements.filter(
        (a) => !a.startsWith('WAR_ROOM_') && a !== 'SOC_WAR_ROOM_DIRECTOR'
      );

      await writeProfileAndLeaderboard(
        firebaseUser,
        {
          ...memberProfile,
          xp: flagBonusXp,
          rank: nextRank,
          completedModules: { ...DEFAULT_COMPLETED_MODULES },
          moduleStates: {},
          achievements: filteredAchievements,
        },
        false,
        memberProfile.createdAt
      );
    } else {
      setSessionCompletedModules({ ...DEFAULT_COMPLETED_MODULES });
      setSessionModuleStates({});
      const flagBonusXp = sessionFlags.reduce((sum, flagStr) => {
        const meta = KNOWN_CTF_FLAGS.find((f) => f.flag === flagStr);
        return sum + (meta?.xpBonus || 0);
      }, 0);
      setSessionXp(flagBonusXp);
    }
  }, [firebaseUser, memberProfile, sessionFlags, writeProfileAndLeaderboard]);

  const effectiveXp = memberProfile ? memberProfile.xp : sessionXp;
  const effectiveCompletedModules = memberProfile
    ? memberProfile.completedModules
    : sessionCompletedModules;
  const effectiveModuleStates = memberProfile ? memberProfile.moduleStates : sessionModuleStates;
  const effectiveRank = useMemo(() => calculateRankInfo(effectiveXp), [effectiveXp]);

  const myLeaderboardRank = useMemo(() => {
    if (!firebaseUser) return null;
    const idx = leaderboard.findIndex((entry) => entry.uid === firebaseUser.uid);
    return idx >= 0 ? idx + 1 : null;
  }, [firebaseUser, leaderboard]);

  return (
    <MemberContext.Provider
      value={{
        firebaseUser,
        memberProfile,
        authReady,
        profileLoading,
        needsProfileSetup,
        isDashboardOpen,
        setIsDashboardOpen,
        leaderboard,
        leaderboardLoading,
        myLeaderboardRank,
        syncStatus,
        lastSyncError,
        effectiveXp,
        effectiveCompletedModules,
        effectiveModuleStates,
        effectiveRank,
        signInWithGoogleAndRegister,
        registerOrUpdateProfile,
        signOutMember,
        completeWarRoomModule,
        saveModuleStageNotes,
        submitCtfFlag,
        resetWarRoomProgress,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};

export const useMember = (): MemberContextType => {
  const ctx = useContext(MemberContext);
  if (!ctx) {
    throw new Error('useMember must be used within a MemberProvider');
  }
  return ctx;
};
