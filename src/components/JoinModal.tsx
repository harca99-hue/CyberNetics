import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Trophy, Shield, ArrowRight, Download, Sparkles, ExternalLink, Copy, Loader2 } from 'lucide-react';
import { TRACKS, TERMINAL_EASTER_EGG } from '../data/clubData';
import { TrackId, MemberApplication } from '../types';
import { useClubData } from '../context/ClubDataContext';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTrack?: TrackId;
  hasSolvedFlag: boolean;
  solvedFlagValue: string;
}

export const JoinModal: React.FC<JoinModalProps> = ({
  isOpen,
  onClose,
  preselectedTrack,
  hasSolvedFlag,
  solvedFlagValue,
}) => {
  const { clubSettings, submitApplication } = useClubData();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<MemberApplication>({
    fullName: '',
    email: '',
    studentId: '',
    major: 'Computer Science',
    gradYear: '2027',
    experienceLevel: 'beginner',
    interestedTracks: preselectedTrack ? [preselectedTrack] : ['offensive'],
    discordHandle: '',
    motivation: '',
    solvedFlag: hasSolvedFlag ? solvedFlagValue : '',
  });

  const [submittedCard, setSubmittedCard] = useState<{
    memberId: string;
    callsign: string;
    joinedDate: string;
  } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (preselectedTrack && !formData.interestedTracks.includes(preselectedTrack)) {
      setFormData(prev => ({
        ...prev,
        interestedTracks: [...prev.interestedTracks, preselectedTrack],
      }));
    }
    if (hasSolvedFlag) {
      setFormData(prev => ({
        ...prev,
        solvedFlag: solvedFlagValue || TERMINAL_EASTER_EGG.flag,
      }));
    }
  }, [preselectedTrack, hasSolvedFlag, solvedFlagValue]);

  if (!isOpen) return null;

  const toggleTrack = (trackId: TrackId) => {
    setFormData(prev => {
      const exists = prev.interestedTracks.includes(trackId);
      if (exists) {
        if (prev.interestedTracks.length === 1) return prev; // keep at least one
        return {
          ...prev,
          interestedTracks: prev.interestedTracks.filter(t => t !== trackId),
        };
      } else {
        return {
          ...prev,
          interestedTracks: [...prev.interestedTracks, trackId],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const cleanName = formData.fullName.trim() || 'Cadet';
    const randomHex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0').toUpperCase();
    const callsign = formData.discordHandle.replace('@', '') || `Agent_${cleanName.split(' ')[0]}`;

    try {
      await submitApplication({
        ...formData,
        solvedFlag: hasSolvedFlag ? (solvedFlagValue || TERMINAL_EASTER_EGG.flag) : formData.solvedFlag
      });
    } catch (err) {
      console.warn('Could not save recruit remotely, fallback local:', err);
    } finally {
      setSubmitting(false);
      setSubmittedCard({
        memberId: `CN-${new Date().getFullYear()}-${randomHex}`,
        callsign,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      });
    }
  };

  const copyDiscord = () => {
    navigator.clipboard.writeText(clubSettings.discordInvite);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0b1222] border border-cyan-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {!submittedCard ? (
          <div>
            {/* Modal Header */}
            <div className="mb-6 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-mono mb-2 border border-cyan-800/50">
                <Shield className="w-3.5 h-3.5" />
                <span>OFFICIAL CLUB RECRUITMENT 2026-2027</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Enlist in Cyber Netics
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                All majors and skill levels are welcome. Complete this form to receive lab portal credentials, Discord roles, and hardware range access.
              </p>
            </div>

            {/* CTF Flag Badge Banner if unlocked */}
            {hasSolvedFlag && (
              <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs font-mono">
                <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="text-amber-300 font-bold block">VERIFIED RECRUIT TOKEN ATTACHED!</span>
                  <span className="text-slate-300">
                    Flag: <code className="text-cyan-300">{formData.solvedFlag}</code> — Fast-tracked on CTF practice server.
                  </span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Jane Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Student / University Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., jdoe@university.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Major / Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., CS, ECE, Business"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Graduation Year
                  </label>
                  <select
                    value={formData.gradYear}
                    onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                  >
                    <option value="2026">Class of 2026</option>
                    <option value="2027">Class of 2027</option>
                    <option value="2028">Class of 2028</option>
                    <option value="2029">Class of 2029</option>
                    <option value="Grad">Graduate Student</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Experience Level
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                  >
                    <option value="beginner">Beginner (Curious / Novice)</option>
                    <option value="intermediate">Intermediate (Some Linux/CTF)</option>
                    <option value="advanced">Advanced (Experienced / Certs)</option>
                  </select>
                </div>
              </div>

              {/* Discord Handle */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Discord Username (for club server roles)
                </label>
                <input
                  type="text"
                  placeholder="e.g., cybercadet#1337 or handle"
                  value={formData.discordHandle}
                  onChange={(e) => setFormData({ ...formData, discordHandle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Tracks of Interest Checkboxes */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Select Tracks of Interest (Pick at least 1)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TRACKS.map((t) => {
                    const selected = formData.interestedTracks.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTrack(t.id)}
                        className={`p-2.5 rounded-xl text-left font-mono text-xs flex items-center justify-between border transition-all ${
                          selected
                            ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-semibold">{t.title.split('&')[0]}</span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-600'
                        }`}>
                          {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Transmitting Encrypted Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Membership Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Success Screen with Personalized Member Card */
          <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-white font-mono">
                WELCOME TO CYBER NETICS
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Your enlistment has been recorded in the central club directory.
              </p>
            </div>

            {/* Futuristic Cyber Membership Card */}
            <div className="relative rounded-3xl bg-gradient-to-br from-[#0c1427] via-[#090e1c] to-[#040710] border-2 border-cyan-500/60 p-6 text-left shadow-2xl overflow-hidden terminal-glow">
              {/* Card micro header */}
              <div className="flex items-center justify-between border-b border-cyan-900/50 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span className="font-mono text-xs font-extrabold text-white tracking-widest">
                    CYBER NETICS // OPERATIVE ID
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                  STATUS: ACTIVE
                </span>
              </div>

              {/* Card Body */}
              <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">CADET NAME</span>
                  <span className="text-sm font-bold text-white block truncate">{formData.fullName}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">CALLSIGN</span>
                  <span className="text-sm font-bold text-cyan-300 block truncate">@{submittedCard.callsign}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">MEMBER IDENTIFIER</span>
                  <span className="text-xs text-slate-200">{submittedCard.memberId}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">ENLISTED DATE</span>
                  <span className="text-xs text-slate-200">{submittedCard.joinedDate}</span>
                </div>

                <div className="col-span-2">
                  <span className="text-[10px] text-slate-500 block uppercase">AUTHORIZED DIVISIONS</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {formData.interestedTracks.map((tid) => (
                      <span
                        key={tid}
                        className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 text-cyan-300"
                      >
                        {tid.toUpperCase()}
                      </span>
                    ))}
                    {hasSolvedFlag && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                        ★ CTF_VERIFIED
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>PolyTech Cyber Defense Wing</span>
                <span className="text-cyan-400">MEETS THU @ 6:30 PM (HALL 302)</span>
              </div>
            </div>

            {/* Next Steps Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={clubSettings.discordInvite?.startsWith('http://') || clubSettings.discordInvite?.startsWith('https://') ? clubSettings.discordInvite : `https://${clubSettings.discordInvite || 'discord.gg/cybernetics-college'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Join Official Cyber Netics Discord Server</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={copyDiscord}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copied Invite!' : 'Copy Discord Invite'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
