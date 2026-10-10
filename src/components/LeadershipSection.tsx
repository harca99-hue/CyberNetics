import React, { useState } from 'react';
import { useClubData } from '../context/ClubDataContext';
import { Users, Award, ChevronDown, ChevronUp, Github, Linkedin, ShieldCheck, HelpCircle } from 'lucide-react';

export const LeadershipSection: React.FC = () => {
  const { boardMembers } = useClubData();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I need prior coding or cybersecurity experience to join?',
      a: 'Absolutely not! Over 60% of our recruits join with zero prior cybersecurity experience. Our beginner workshops start with the very basics: Linux command lines, setting up VirtualBox, and understanding network packets.',
    },
    {
      q: 'What hardware or operating system do I need for club workshops?',
      a: 'Any modern laptop (Windows, macOS, or Linux) with at least 8GB of RAM will work. We will guide you through spinning up free Kali Linux virtual machines or connecting directly to our browser-based lab servers.',
    },
    {
      q: 'Is ethical hacking legal? Will I get in trouble?',
      a: 'Ethical hacking is 100% legal when practiced within authorized boundaries. Cyber Netics enforces a strict Code of Ethics. All drills, penetration tests, and vulnerability exploits are performed solely on university-approved sandbox ranges, CTF tournaments, and dedicated virtual labs.',
    },
    {
      q: 'Are there membership dues or attendance requirements?',
      a: 'Membership is completely free! We are proudly funded through student government grants and industry sponsorships. You are welcome to attend as many or as few sessions as your academic schedule allows.',
    },
    {
      q: 'How do I try out for the collegiate competition team (CCDC / CTF)?',
      a: 'We host open tryouts each semester and run weekly informal Friday scrimmages. If you show enthusiasm, teamwork, and curiosity, our captains will help pair you with a squad regardless of your class year!',
    },
  ];

  return (
    <section id="leadership" className="py-20 bg-[#070b14] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono">
            <Users className="w-3.5 h-3.5" />
            <span>// 07. COMMAND &amp; EXECUTIVE ROSTER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Meet the Executive Board
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Elected student officers dedicated to mentoring members, hosting high-impact workshops, and connecting you with top cybersecurity employers.
          </p>
        </div>

        {/* Board Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {boardMembers.map((member) => (
            <div
              key={member.id}
              className="p-6 rounded-2xl bg-[#0b1222] border border-slate-800/90 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-4">
                {/* Header with avatar initial & handles */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-950 to-slate-900 border border-cyan-700/50 flex items-center justify-center font-mono font-bold text-cyan-300 text-base">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs text-cyan-400 font-mono font-semibold">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    @{member.handle}
                  </span>
                </div>

                {/* Major & Year */}
                <div className="text-xs text-slate-300 font-mono">
                  <span>{member.major}</span> • <span className="text-slate-400">{member.year}</span>
                </div>

                {/* Certifications badges */}
                <div className="flex flex-wrap gap-1.5">
                  {member.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/40 text-emerald-300 font-mono text-[10px] font-semibold flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{cert}</span>
                    </span>
                  ))}
                </div>

                {/* Bio & Focus */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Focus Area Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                <span className="text-cyan-400 font-semibold">Specialty: </span>
                {member.focus}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto pt-10 border-t border-slate-800/80">
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Got Questions? We&apos;ve Got Answers.
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl bg-[#0b1222] border border-slate-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-white hover:text-cyan-300 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
