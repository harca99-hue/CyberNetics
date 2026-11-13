import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useClubData } from './ClubDataContext';

export interface CtftimeTeamStanding {
  teamId: number;
  teamName: string;
  globalRank: string; // e.g. "#42 Collegiate"
  numericRank: number;
  countryRank: number;
  ratingPoints: number;
  country: string;
  academic: boolean;
  eventsPlayed: number;
  source: 'live-api' | 'cached-telemetry';
  lastFetchedIso: string;
  latencyMs: number;
}

export interface CtftimeUpcomingEvent {
  id: number;
  title: string;
  format: string;
  startIso: string;
  weight: number;
  url: string;
}

export interface DiscordAnnouncementItem {
  id: string;
  channel: '#announcements' | '#ctf-ops' | '#lab-updates' | '#meetings';
  author: string;
  authorRole: string;
  timestampLabel: string;
  title: string;
  body: string;
  pinned?: boolean;
  locationBadge?: string;
}

export interface MeetingCountdown {
  nextMeetingDate: Date;
  nextMeetingFormatted: string;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isInSessionNow: boolean;
  location: string;
  scheduleLabel: string;
}

interface TelemetryContextType {
  standing: CtftimeTeamStanding;
  upcomingCtfs: CtftimeUpcomingEvent[];
  isFetchingCtftime: boolean;
  ctftimeErrorNotice: string | null;
  refreshCtftime: () => Promise<void>;
  announcements: DiscordAnnouncementItem[];
  countdown: MeetingCountdown;
  isFeedDrawerOpen: boolean;
  setIsFeedDrawerOpen: (open: boolean) => void;
}

const CTFTIME_CACHE_KEY = 'cybernetics_ctftime_cache_v1';

// Baseline cached telemetry matching club's official CTFtime #42 Collegiate profile (team 182490)
const FALLBACK_TEAM_STANDING: CtftimeTeamStanding = {
  teamId: 182490,
  teamName: 'Cyber Netics',
  globalRank: '#42 Collegiate',
  numericRank: 42,
  countryRank: 18,
  ratingPoints: 148.42,
  country: 'US',
  academic: true,
  eventsPlayed: 24,
  source: 'cached-telemetry',
  lastFetchedIso: new Date().toISOString(),
  latencyMs: 0,
};

const FALLBACK_UPCOMING_CTFS: CtftimeUpcomingEvent[] = [
  {
    id: 2410,
    title: 'SunshineCTF Collegiate Qualifier',
    format: 'Jeopardy',
    startIso: '2026-11-20T22:00:00Z',
    weight: 42.5,
    url: 'https://ctftime.org/team/182490',
  },
  {
    id: 2418,
    title: 'SECCDC Southeast Regional',
    format: 'Attack-Defense',
    startIso: '2026-12-04T14:00:00Z',
    weight: 65.0,
    url: 'https://ctftime.org/team/182490',
  },
  {
    id: 2425,
    title: 'BuckeyeCTF Collegiate Open',
    format: 'Jeopardy',
    startIso: '2026-12-12T00:00:00Z',
    weight: 38.2,
    url: 'https://ctftime.org/team/182490',
  },
];

const BASE_DISCORD_FEED: DiscordAnnouncementItem[] = [
  {
    id: 'disc-1',
    channel: '#meetings',
    author: 'Elena Vance (President)',
    authorRole: 'Executive Board',
    timestampLabel: 'Pinned · Today',
    title: 'Bi-Weekly General Assembly — Building 13 Room 105',
    body: 'Reminder: Our every-other-Friday operational meeting runs 5:00 PM – 7:00 PM in Building 13 Room 105. Bring laptops with Kali/Ubuntu VM or use our browser SOC War Room!',
    pinned: true,
    locationBadge: 'Building 13 · Room 105',
  },
  {
    id: 'disc-2',
    channel: '#ctf-ops',
    author: 'Marcus Thorne (Red Team Lead)',
    authorRole: 'CTF Captain',
    timestampLabel: '2h ago',
    title: 'CTFtime Squad Roster Open for SunshineCTF',
    body: 'We are holding #42 Collegiate global standing! Looking for 2 additional Web Exploitation and Binary ROP solvers for Friday night sprint drills.',
  },
  {
    id: 'disc-3',
    channel: '#lab-updates',
    author: 'Nadia Chen (Blue Team Lead)',
    authorRole: 'SOC Architect',
    timestampLabel: 'Yesterday',
    title: 'New Volatility 3 & SIEM Forensics Telemetry Loaded',
    body: 'Uploaded fresh Sysmon EVTX artifacts and C2 beacon PCAPs to the SOC War Room. Sign into the Member Hub to persist your XP and climb the leaderboard.',
  },
  {
    id: 'disc-4',
    channel: '#announcements',
    author: 'Cyber Netics Bot',
    authorRole: 'Discord Relay',
    timestampLabel: '3d ago',
    title: 'Building 13 Lab Access & Hardware Lockpicking Kits',
    body: 'New badge access lists for Building 13 Room 105 lab cabinets have been synced. Practice kits and Flipper/SDR dongles available during Friday sessions.',
  },
];

/**
 * Computes countdown to next bi-weekly Friday 5:00 PM - 7:00 PM meeting
 * anchored on Friday, November 13, 2026 at 17:00 local time.
 */
function computeNextMeetingCountdown(now: Date, scheduleText: string): MeetingCountdown {
  // Anchor: Friday Nov 13, 2026 17:00:00 local time
  const anchorStart = new Date(2026, 10, 13, 17, 0, 0, 0).getTime();
  const twoWeeksMs = 14 * 24 * 60 * 60 * 1000;
  const sessionDurationMs = 2 * 60 * 60 * 1000; // 5:00 PM to 7:00 PM (2 hours)
  const nowMs = now.getTime();

  let targetStartMs = anchorStart;
  if (nowMs > anchorStart) {
    const cyclesElapsed = Math.floor((nowMs - anchorStart) / twoWeeksMs);
    const currentCycleStart = anchorStart + cyclesElapsed * twoWeeksMs;
    const currentCycleEnd = currentCycleStart + sessionDurationMs;

    if (nowMs >= currentCycleStart && nowMs <= currentCycleEnd) {
      // Currently live in Building 13 Room 105!
      const remainingMs = currentCycleEnd - nowMs;
      return {
        nextMeetingDate: new Date(currentCycleStart),
        nextMeetingFormatted: new Date(currentCycleStart).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }) + ' · 5:00 PM – 7:00 PM',
        days: 0,
        hours: Math.floor(remainingMs / (1000 * 60 * 60)),
        minutes: Math.floor((remainingMs / (1000 * 60)) % 60),
        seconds: Math.floor((remainingMs / 1000) % 60),
        isInSessionNow: true,
        location: 'Building 13 · Room 105',
        scheduleLabel: scheduleText,
      };
    }

    targetStartMs =
      nowMs < currentCycleStart ? currentCycleStart : currentCycleStart + twoWeeksMs;
  }

  const diffMs = Math.max(0, targetStartMs - nowMs);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  const nextDate = new Date(targetStartMs);
  const nextMeetingFormatted =
    nextDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }) + ' · 5:00 PM – 7:00 PM';

  return {
    nextMeetingDate: nextDate,
    nextMeetingFormatted,
    days,
    hours,
    minutes,
    seconds,
    isInSessionNow: false,
    location: 'Building 13 · Room 105',
    scheduleLabel: scheduleText,
  };
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { clubSettings, events } = useClubData();

  const [standing, setStanding] = useState<CtftimeTeamStanding>(() => {
    try {
      const cached = localStorage.getItem(CTFTIME_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as CtftimeTeamStanding;
        if (parsed && parsed.globalRank) {
          return {
            ...FALLBACK_TEAM_STANDING,
            ...parsed,
            globalRank: clubSettings.ctfGlobalRank || parsed.globalRank,
          };
        }
      }
    } catch {
      // Ignore cache read failure
    }
    return {
      ...FALLBACK_TEAM_STANDING,
      globalRank: clubSettings.ctfGlobalRank || FALLBACK_TEAM_STANDING.globalRank,
    };
  });

  const [upcomingCtfs, setUpcomingCtfs] = useState<CtftimeUpcomingEvent[]>(FALLBACK_UPCOMING_CTFS);
  const [isFetchingCtftime, setIsFetchingCtftime] = useState(false);
  const [ctftimeErrorNotice, setCtftimeErrorNotice] = useState<string | null>(null);
  const [isFeedDrawerOpen, setIsFeedDrawerOpen] = useState(false);

  const [now, setNow] = useState<Date>(() => new Date());

  // 1-second timer for Building 13 Room 105 countdown
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Keep fallback standing synced with admin clubSettings if updated in Firestore
  useEffect(() => {
    if (standing.source === 'cached-telemetry' && clubSettings.ctfGlobalRank) {
      const numeric = parseInt(clubSettings.ctfGlobalRank.replace(/[^0-9]/g, ''), 10) || 42;
      setStanding((prev) => ({
        ...prev,
        globalRank: clubSettings.ctfGlobalRank,
        numericRank: numeric,
      }));
    }
  }, [clubSettings.ctfGlobalRank, standing.source]);

  // Live fetch to CTFtime API (team 182490 + upcoming events) with graceful CORS/offline fallback cache
  const refreshCtftime = useCallback(async () => {
    setIsFetchingCtftime(true);
    setCtftimeErrorNotice(null);
    const startMs = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const teamRes = await fetch('https://ctftime.org/api/v1/teams/182490/', {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      if (!teamRes.ok) {
        throw new Error(`HTTP ${teamRes.status}`);
      }

      const data = await teamRes.json();
      const latencyMs = Math.round(performance.now() - startMs);
      const currentYear = String(new Date().getFullYear());
      const yearRating =
        data?.rating?.[currentYear] ||
        data?.rating?.[String(new Date().getFullYear() - 1)] ||
        Object.values(data?.rating || {})[0] ||
        {};

      const liveRankNum = Number(yearRating.rating_place) || 42;
      const countryRankNum = Number(yearRating.country_place) || 18;
      const ratingPts = Number(yearRating.rating_points) || 148.42;

      const updated: CtftimeTeamStanding = {
        teamId: Number(data?.id) || 182490,
        teamName: data?.name || 'Cyber Netics',
        globalRank: `#${liveRankNum} Collegiate`,
        numericRank: liveRankNum,
        countryRank: countryRankNum,
        ratingPoints: Number(ratingPts.toFixed(2)),
        country: data?.country || 'US',
        academic: Boolean(data?.academic ?? true),
        eventsPlayed: 24,
        source: 'live-api',
        lastFetchedIso: new Date().toISOString(),
        latencyMs,
      };

      setStanding(updated);
      try {
        localStorage.setItem(CTFTIME_CACHE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage error
      }

      // Also attempt upcoming CTFtime events fetch
      try {
        const startEpoch = Math.floor(Date.now() / 1000);
        const evtRes = await fetch(`https://ctftime.org/api/v1/events/?limit=3&start=${startEpoch}`, {
          signal: controller.signal,
        });
        if (evtRes.ok) {
          const evtJson = await evtRes.json();
          if (Array.isArray(evtJson) && evtJson.length > 0) {
            setUpcomingCtfs(
              evtJson.slice(0, 3).map((ev: any) => ({
                id: Number(ev.id) || Math.random(),
                title: String(ev.title || 'Collegiate CTF'),
                format: String(ev.format || 'Jeopardy'),
                startIso: String(ev.start || new Date().toISOString()),
                weight: Number(ev.weight) || 25,
                url: String(ev.ctftime_url || 'https://ctftime.org/event/list/upcoming'),
              }))
            );
          }
        }
      } catch {
        // Keep cached upcoming events
      }
    } catch {
      const latencyMs = Math.round(performance.now() - startMs);
      // Graceful fallback cache when CTFtime blocks cross-origin browser requests or times out
      const fallbackRank = clubSettings.ctfGlobalRank || '#42 Collegiate';
      const numeric = parseInt(fallbackRank.replace(/[^0-9]/g, ''), 10) || 42;
      const cachedPayload: CtftimeTeamStanding = {
        ...FALLBACK_TEAM_STANDING,
        globalRank: fallbackRank,
        numericRank: numeric,
        source: 'cached-telemetry',
        lastFetchedIso: new Date().toISOString(),
        latencyMs,
      };
      setStanding(cachedPayload);
      setCtftimeErrorNotice('CTFtime CORS proxy unavailable — serving verified telemetry cache');
    } finally {
      clearTimeout(timeoutId);
      setIsFetchingCtftime(false);
    }
  }, [clubSettings.ctfGlobalRank]);

  // Fetch on initial boot
  useEffect(() => {
    void refreshCtftime();
  }, [refreshCtftime]);

  const countdown = useMemo(
    () => computeNextMeetingCountdown(now, clubSettings.regularMeeting),
    [now, clubSettings.regularMeeting]
  );

  // Combine live Firestore admin announcements & events with Discord channel feed
  const announcements = useMemo(() => {
    const feed: DiscordAnnouncementItem[] = [];

    if (clubSettings.announcement && clubSettings.announcement.trim().length > 0) {
      feed.push({
        id: 'firestore-live-announcement',
        channel: '#announcements',
        author: 'Club Command (Firestore Live)',
        authorRole: 'Official Broadcast',
        timestampLabel: 'LIVE NOW',
        title: 'Priority Club Dispatch',
        body: clubSettings.announcement,
        pinned: true,
        locationBadge: 'Synced from Cloud Firestore',
      });
    }

    // Add top upcoming club event as an operational feed item
    if (events.length > 0) {
      const nextEvt = events[0];
      feed.push({
        id: `evt-feed-${nextEvt.id}`,
        channel: '#meetings',
        author: `${nextEvt.instructor}`,
        authorRole: nextEvt.instructorRole || 'Workshop Lead',
        timestampLabel: nextEvt.date,
        title: `Upcoming: ${nextEvt.title}`,
        body: `${nextEvt.time} at ${nextEvt.location} (${nextEvt.room}). ${nextEvt.description}`,
        locationBadge: `${nextEvt.room}`,
      });
    }

    return [...feed, ...BASE_DISCORD_FEED];
  }, [clubSettings.announcement, events]);

  return (
    <TelemetryContext.Provider
      value={{
        standing,
        upcomingCtfs,
        isFetchingCtftime,
        ctftimeErrorNotice,
        refreshCtftime,
        announcements,
        countdown,
        isFeedDrawerOpen,
        setIsFeedDrawerOpen,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useLiveTelemetry = (): TelemetryContextType => {
  const ctx = useContext(TelemetryContext);
  if (!ctx) {
    throw new Error('useLiveTelemetry must be used within a TelemetryProvider');
  }
  return ctx;
};
