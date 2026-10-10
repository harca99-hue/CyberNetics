import React, { useState } from 'react';
import { useClubData } from '../context/ClubDataContext';
import { ClubEvent, EventCategory } from '../types';
import { Calendar, Clock, MapPin, User, Tag, Check, Download, QrCode, X, Sparkles, ExternalLink, Shield, Compass } from 'lucide-react';

export const EventsSection: React.FC = () => {
  const { events, clubSettings } = useClubData();
  const [activeCategory, setActiveCategory] = useState<EventCategory>('All');
  const [activeCity, setActiveCity] = useState<string>('All Florida');
  const [selectedEventForRsvp, setSelectedEventForRsvp] = useState<ClubEvent | null>(null);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const categories: EventCategory[] = ['All', 'Conference', 'Workshop', 'CTF', 'Competition', 'Guest Speaker'];
  const floridaCities = ['All Florida', 'Tampa', 'Orlando', 'Miami', 'Melbourne'];

  const filteredEvents = events.filter((e) => {
    const matchesCategory = activeCategory === 'All' || e.category === activeCategory;
    const matchesCity = 
      activeCity === 'All Florida' || 
      (e.city && e.city.toLowerCase().includes(activeCity.toLowerCase().split(' ')[0]));
    return matchesCategory && matchesCity;
  });

  const handleOpenRsvp = (event: ClubEvent) => {
    setSelectedEventForRsvp(event);
    setRsvpSuccess(false);
    setTicketNumber(`CN-FL-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleSubmitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName || !rsvpEmail) return;
    setRsvpSuccess(true);
  };

  return (
    <section id="events" className="py-20 bg-[#090d16] border-t border-slate-900 cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono">
            <span>// 04. FLORIDA CYBER CIRCUIT & FIELD OPS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Florida Cybersecurity Events, Conferences &amp; CTFs
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Connect with Florida&apos;s premier infosec hubs: CyberFlorida Tampa, BSides Orlando, SunshineCTF, Miami Zero Trust Summit, and Space Coast aerospace cyber labs. Join our student delegations and collegiate workshops.
          </p>
        </div>

        {/* Florida Hub Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Florida Cyber Ecosystem Hub</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Statewide Calendar
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Central FL • Tampa Bay • South FL • Space Coast • Tallahassee
              </p>
            </div>
          </div>

          {/* City quick filter pills */}
          <div className="flex flex-wrap items-center gap-1.5 self-center md:self-auto">
            {floridaCities.map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeCity === city
                    ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-950'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {city === 'All Florida' ? '🌴 All Florida' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const isBeginner = event.difficulty === 'Beginner' || event.difficulty === 'All Levels';
            return (
              <div
                key={event.id}
                className="rounded-2xl bg-[#0b1222] border border-slate-800/90 hover:border-cyan-500/40 transition-all p-6 flex flex-col justify-between group shadow-lg relative overflow-hidden"
              >
                {/* Subtle top indicator */}
                {event.isFloridaEvent && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500" />
                )}

                <div className="space-y-4">
                  {/* Date & Florida City Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold">
                        {event.date}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                        {event.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {event.city && (
                        <span className="px-2 py-0.5 rounded bg-blue-950/70 text-blue-300 border border-blue-800/60 text-[10px] font-mono font-semibold flex items-center gap-1">
                          <span>📍</span>
                          <span>{event.city}, FL</span>
                        </span>
                      )}
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                        isBeginner
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                          : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                      }`}>
                        {event.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed mt-2 line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  {/* Location & Time details */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300 font-mono">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{event.location} • {event.room}</span>
                    </div>
                    {event.venueAddress && (
                      <div className="text-[11px] text-slate-400 pl-5 truncate">
                        {event.venueAddress}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-400">
                      <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">Host/Lead: {event.instructor}</span>
                    </div>
                  </div>
                </div>

                {/* RSVP & Links Bottom Bar */}
                <div className="pt-5 mt-4 border-t border-slate-800/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-emerald-400">
                      ● {event.spotsRemaining} spots
                    </span>
                    {event.eventUrl && (
                      <a
                        href={event.eventUrl.startsWith('http://') || event.eventUrl.startsWith('https://') ? event.eventUrl : `https://${event.eventUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 hover:underline"
                        title="Official Conference Link"
                      >
                        <span>Official site</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenRsvp(event)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50 hover:border-cyan-500 text-xs font-mono font-semibold transition-all shrink-0"
                  >
                    RSVP / Free Pass
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 font-mono text-slate-400 text-sm">
            No events found matching this Florida city and category filter.
          </div>
        )}

        {/* Regular Meeting Callout */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-slate-900/60 border border-slate-800 font-mono text-xs text-slate-400">
          <p>
            Can&apos;t make a specific workshop? Cyber Netics hosts general meetings <span className="text-white font-semibold">{clubSettings.regularMeeting}</span> with simultaneous Discord live streaming.
          </p>
        </div>
      </div>

      {/* RSVP Modal */}
      {selectedEventForRsvp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0b1222] border border-cyan-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            <button
              onClick={() => setSelectedEventForRsvp(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white bg-slate-800/80 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {!rsvpSuccess ? (
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-mono mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>RESERVE PASS</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {selectedEventForRsvp.title}
                </h3>
                <p className="text-xs text-slate-400 mb-6 font-mono">
                  {selectedEventForRsvp.date} • {selectedEventForRsvp.time} @ {selectedEventForRsvp.room}
                </p>

                <form onSubmit={handleSubmitRsvp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                      Full Student Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Jane Doe"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                      University or Personal Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g., jdoe@university.edu"
                      value={rsvpEmail}
                      onChange={(e) => setRsvpEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 font-sans"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Lab VM credentials and setup links will be emailed prior to the session.
                    </p>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase shadow-md transition-all"
                    >
                      Confirm RSVP &amp; Generate Pass
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Success / Digital Event Ticket Pass */
              <div className="space-y-6 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white font-mono">RSVP PASS CONFIRMED!</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Your seat and cloud sandbox credentials are confirmed for {rsvpName}.
                  </p>
                </div>

                {/* Digital Boarding Pass Ticket */}
                <div className="p-5 rounded-2xl bg-black/60 border border-cyan-800/70 text-left font-mono space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-xs text-cyan-400 font-bold">CYBER NETICS PASS</span>
                    <span className="text-[10px] text-slate-400">{ticketNumber}</span>
                  </div>

                  <div className="text-sm font-bold text-white">{selectedEventForRsvp.title}</div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">ATTENDEE</span>
                      <span className="truncate block font-semibold">{rsvpName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">DATE &amp; TIME</span>
                      <span>{selectedEventForRsvp.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">ROOM</span>
                      <span>{selectedEventForRsvp.room}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">STATUS</span>
                      <span className="text-emerald-400 font-bold">VERIFIED_SEAT</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Bring laptop + charger</span>
                    <span className="text-cyan-400">Wifi: EDURoam / PolyTech</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEventForRsvp(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs transition-all"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
