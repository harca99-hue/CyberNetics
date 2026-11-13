import React, { useState } from 'react';
import {
  Activity,
  Award,
  Bell,
  Calendar,
  Clock,
  ExternalLink,
  Flag,
  Globe,
  Hash,
  MapPin,
  MessageSquare,
  PanelRightOpen,
  Pin,
  Radio,
  RefreshCw,
  Trophy,
  X,
} from 'lucide-react';
import { useLiveTelemetry, DiscordAnnouncementItem } from '../context/TelemetryContext';
import { useClubData } from '../context/ClubDataContext';

const pad2 = (n: number) => String(n).padStart(2, '0');

export const LiveTelemetryWidget: React.FC = () => {
  const {
    standing,
    upcomingCtfs,
    isFetchingCtftime,
    ctftimeErrorNotice,
    refreshCtftime,
    announcements,
    countdown,
    setIsFeedDrawerOpen,
  } = useLiveTelemetry();
  const { clubSettings } = useClubData();

  const [channelFilter, setChannelFilter] = useState<'all' | DiscordAnnouncementItem['channel']>('all');

  const filteredAnnouncements =
    channelFilter === 'all'
      ? announcements
      : announcements.filter((a) => a.channel === channelFilter);

  const visibleAnnouncements = filteredAnnouncements.slice(0, 3);

  return (
    <section
      id="live-telemetry"
      aria-label="Live Club Telemetry and Announcements"
      className="py-10 bg-[#070b14] border-t border-b border-cyan-950/50 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Telemetry Strip Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
              LIVE TELEMETRY // REAL-TIME CLUB INTEL
            </span>
          </div>

          <button
            onClick={() => setIsFeedDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/70 border border-cyan-600/40 text-cyan-200 text-xs font-mono font-semibold transition-all cursor-pointer"
          >
            <PanelRightOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open Live Feed Drawer</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 1: Live CTFtime API Standing & Events */}
          <div className="lg:col-span-5 bg-[#0a1020] border border-cyan-900/50 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                      CTFtime API Telemetry
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                    Endpoint: ctftime.org/api/v1/teams/{standing.teamId}/
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      standing.source === 'live-api'
                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-600/50'
                        : 'bg-cyan-950/70 text-cyan-300 border-cyan-700/50'
                    }`}
                    title={ctftimeErrorNotice || 'Synced from CTFtime'}
                  >
                    {standing.source === 'live-api' ? '● LIVE API' : '● VERIFIED CACHE'}
                  </span>
                  <button
                    onClick={() => void refreshCtftime()}
                    disabled={isFetchingCtftime}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer disabled:opacity-50"
                    title="Re-query CTFtime API"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetchingCtftime ? 'animate-spin text-cyan-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Main Global Standing Highlight */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#0e1b33] to-[#081020] border border-cyan-500/30 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
                    Global Team Standing
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5">
                    {standing.globalRank}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-2">
                    <span>{standing.country} Academic: #{standing.countryRank}</span>
                    <span>•</span>
                    <span className="text-emerald-400">{standing.ratingPoints} pts</span>
                  </div>
                </div>

                <a
                  href={clubSettings.ctftimeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <span>Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Upcoming CTFtime Competitions */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Upcoming CTFtime Operations</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {standing.latencyMs > 0 ? `${standing.latencyMs}ms` : 'Cached'}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {upcomingCtfs.slice(0, 3).map((ev) => (
                    <a
                      key={ev.id}
                      href={ev.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-[#060a14] hover:bg-slate-900 border border-slate-800/90 hover:border-cyan-700/50 flex items-center justify-between gap-2 transition-colors group"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-mono font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                          {ev.title}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {ev.format} · Weight {ev.weight}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 shrink-0">
                        {new Date(ev.startIso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {ctftimeErrorNotice && (
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span>{ctftimeErrorNotice}</span>
              </div>
            )}
          </div>

          {/* Card 2: Club Live Feed, Discord Announcements & Building 13 Room 105 Countdown */}
          <div className="lg:col-span-7 bg-[#0a1020] border border-cyan-900/50 rounded-2xl p-5 flex flex-col justify-between shadow-xl space-y-4">
            {/* Meeting Countdown Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 via-[#0d1930] to-indigo-950/50 border border-cyan-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className={`w-2 h-2 rounded-full ${countdown.isInSessionNow ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400 animate-pulse'}`} />
                  <span className="font-bold uppercase tracking-wider text-cyan-300">
                    {countdown.isInSessionNow ? 'MEETING IN SESSION NOW' : 'NEXT GENERAL MEETING COUNTDOWN'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{countdown.location}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {countdown.nextMeetingFormatted} (Bi-Weekly Fridays)
                </div>
              </div>

              {/* Ticking Clock Digits */}
              <div className="flex items-center gap-2 font-mono shrink-0">
                {!countdown.isInSessionNow && (
                  <div className="px-2.5 py-1.5 rounded-lg bg-[#060912] border border-slate-800 text-center min-w-[46px]">
                    <div className="text-base font-black text-white leading-none">{pad2(countdown.days)}</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">DAYS</div>
                  </div>
                )}
                <div className="px-2.5 py-1.5 rounded-lg bg-[#060912] border border-slate-800 text-center min-w-[46px]">
                  <div className="text-base font-black text-cyan-300 leading-none">{pad2(countdown.hours)}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">HRS</div>
                </div>
                <div className="px-2.5 py-1.5 rounded-lg bg-[#060912] border border-slate-800 text-center min-w-[46px]">
                  <div className="text-base font-black text-cyan-300 leading-none">{pad2(countdown.minutes)}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">MIN</div>
                </div>
                <div className="px-2.5 py-1.5 rounded-lg bg-[#060912] border border-slate-800 text-center min-w-[46px]">
                  <div className="text-base font-black text-amber-300 leading-none">{pad2(countdown.seconds)}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">SEC</div>
                </div>
              </div>
            </div>

            {/* Interactive Discord & Club Live Feed */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Club Live Feed &amp; Discord Announcements
                  </span>
                </div>

                {/* Channel Filter Chips */}
                <div className="flex flex-wrap items-center gap-1">
                  {(['all', '#announcements', '#meetings', '#ctf-ops'] as const).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setChannelFilter(ch)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors cursor-pointer ${
                        channelFilter === ch
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {ch === 'all' ? 'All Feeds' : ch}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed Items */}
              <div className="space-y-2">
                {visibleAnnouncements.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 rounded-xl bg-[#060a14] border border-slate-800/90 hover:border-cyan-800/60 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-700/40 shrink-0">
                          {post.channel}
                        </span>
                        <span className="text-xs font-bold text-white truncate">{post.title}</span>
                        {post.pinned && <Pin className="w-3 h-3 text-amber-400 shrink-0" />}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {post.timestampLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{post.body}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
                <a
                  href={clubSettings.discordInvite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-300 hover:text-indigo-200 inline-flex items-center gap-1"
                >
                  <span>Join Official Discord Server</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setIsFeedDrawerOpen(true)}
                  className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  View all {announcements.length} updates →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================================ */
/* INTERACTIVE SLIDE-OUT LIVE FEED & TELEMETRY DRAWER                           */
/* ============================================================================ */

export const LiveFeedDrawer: React.FC = () => {
  const {
    isFeedDrawerOpen,
    setIsFeedDrawerOpen,
    standing,
    upcomingCtfs,
    isFetchingCtftime,
    refreshCtftime,
    announcements,
    countdown,
  } = useLiveTelemetry();
  const { clubSettings } = useClubData();

  const [channelFilter, setChannelFilter] = useState<'all' | DiscordAnnouncementItem['channel']>('all');

  if (!isFeedDrawerOpen) return null;

  const filtered =
    channelFilter === 'all'
      ? announcements
      : announcements.filter((a) => a.channel === channelFilter);

  return (
    <div
      id="live-feed-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsFeedDrawerOpen(false);
      }}
    >
      <aside
        aria-label="Club Live Feed and Announcements Drawer"
        className="w-full max-w-md bg-[#090d16] border-l border-cyan-500/40 h-full flex flex-col shadow-2xl"
      >
        {/* Top bar */}
        <div className="px-5 py-4 border-b border-slate-800 bg-[#070b14] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold font-mono text-white">CLUB LIVE FEED &amp; TELEMETRY</h3>
              <p className="text-[11px] font-mono text-slate-400">Discord Relay · CTFtime · Room 105 Clock</p>
            </div>
          </div>

          <button
            onClick={() => setIsFeedDrawerOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Live Feed Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto terminal-scroll p-5 space-y-5">
          {/* Building 13 Room 105 Countdown Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/60 to-[#0b1326] border border-cyan-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase">
                {countdown.isInSessionNow ? '🟢 LIVE SESSION ACTIVE' : '⏱ NEXT MEETING COUNTDOWN'}
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-700/50">
                Bldg 13 · Rm 105
              </span>
            </div>

            <div className="text-xs text-slate-200 font-semibold">
              {countdown.nextMeetingFormatted}
            </div>

            <div className="grid grid-cols-4 gap-2 font-mono text-center">
              <div className="p-2 rounded-lg bg-[#050811] border border-slate-800">
                <div className="text-lg font-black text-white">{pad2(countdown.days)}</div>
                <div className="text-[9px] text-slate-500">DAYS</div>
              </div>
              <div className="p-2 rounded-lg bg-[#050811] border border-slate-800">
                <div className="text-lg font-black text-cyan-300">{pad2(countdown.hours)}</div>
                <div className="text-[9px] text-slate-500">HRS</div>
              </div>
              <div className="p-2 rounded-lg bg-[#050811] border border-slate-800">
                <div className="text-lg font-black text-cyan-300">{pad2(countdown.minutes)}</div>
                <div className="text-[9px] text-slate-500">MIN</div>
              </div>
              <div className="p-2 rounded-lg bg-[#050811] border border-slate-800">
                <div className="text-lg font-black text-amber-300">{pad2(countdown.seconds)}</div>
                <div className="text-[9px] text-slate-500">SEC</div>
              </div>
            </div>
          </div>

          {/* CTFtime Mini Telemetry */}
          <div className="p-4 rounded-xl bg-[#0c1222] border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>CTFtime Standing: {standing.globalRank}</span>
              </span>
              <button
                onClick={() => void refreshCtftime()}
                disabled={isFetchingCtftime}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isFetchingCtftime ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Rating: <strong className="text-white">{standing.ratingPoints} pts</strong> · {standing.country} #{standing.countryRank} ·{' '}
              <span className="text-cyan-400">{standing.source === 'live-api' ? 'Live API' : 'Cached'}</span>
            </div>
          </div>

          {/* Channel Filters */}
          <div className="flex flex-wrap gap-1.5">
            {(['all', '#announcements', '#meetings', '#ctf-ops', '#lab-updates'] as const).map((ch) => (
              <button
                key={ch}
                onClick={() => setChannelFilter(ch)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                  channelFilter === ch
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {ch === 'all' ? 'All' : ch}
              </button>
            ))}
          </div>

          {/* Feed Timeline */}
          <div className="space-y-3">
            {filtered.map((post) => (
              <div key={post.id} className="p-3.5 rounded-xl bg-[#0c1222] border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
                    {post.channel}
                  </span>
                  <span className="text-slate-500">{post.timestampLabel}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{post.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{post.body}</p>
                <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>{post.author} · {post.authorRole}</span>
                  {post.locationBadge && (
                    <span className="text-emerald-400">{post.locationBadge}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-[#070b14] flex items-center justify-between">
          <a
            href={clubSettings.discordInvite}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs text-center flex items-center justify-center gap-2 transition-colors"
          >
            <span>Open Full Discord Server</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>
    </div>
  );
};
