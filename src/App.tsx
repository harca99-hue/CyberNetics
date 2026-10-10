/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ClubDataProvider } from './context/ClubDataContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { Tracks } from './components/Tracks';
import { TerminalChallenge } from './components/TerminalChallenge';
import { CyberMiniGames } from './components/CyberMiniGames';
import { EventsSection } from './components/EventsSection';
import { CTFShowcase } from './components/CTFShowcase';
import { ResourcesSection } from './components/ResourcesSection';
import { LeadershipSection } from './components/LeadershipSection';
import { JoinModal } from './components/JoinModal';
import { ShareModal } from './components/ShareModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { Footer } from './components/Footer';
import { TrackId } from './types';
import { TERMINAL_EASTER_EGG } from './data/clubData';

function MainApp() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [preselectedTrack, setPreselectedTrack] = useState<TrackId | undefined>(undefined);
  const [hasSolvedFlag, setHasSolvedFlag] = useState(false);
  const [solvedFlagValue, setSolvedFlagValue] = useState('');

  // Ensure page opens and refreshes starting at the top
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  // Check saved flag state from localStorage
  useEffect(() => {
    try {
      const savedFlag = localStorage.getItem('cybernetics_flag');
      if (savedFlag === TERMINAL_EASTER_EGG.flag) {
        setHasSolvedFlag(true);
        setSolvedFlagValue(savedFlag);
      }
    } catch {
      // LocalStorage fallback for sandbox env
    }
  }, []);

  const handleSolveFlag = (flag: string) => {
    setHasSolvedFlag(true);
    setSolvedFlagValue(flag);
    try {
      localStorage.setItem('cybernetics_flag', flag);
    } catch {
      // Ignore
    }
  };

  const handleOpenJoin = (trackId?: TrackId) => {
    setPreselectedTrack(trackId);
    setIsJoinModalOpen(true);
  };

  const scrollToTerminal = () => {
    const el = document.getElementById('terminal');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToGames = () => {
    const el = document.getElementById('games');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTracks = () => {
    const el = document.getElementById('tracks');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation */}
      <Navbar
        onOpenJoin={() => handleOpenJoin()}
        onScrollToTerminal={scrollToTerminal}
        onScrollToGames={scrollToGames}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        hasSolvedFlag={hasSolvedFlag}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero */}
        <Hero
          onOpenJoin={() => handleOpenJoin()}
          onScrollToTerminal={scrollToTerminal}
          onScrollToGames={scrollToGames}
          onScrollToTracks={scrollToTracks}
          onOpenShare={() => setIsShareModalOpen(true)}
        />

        {/* 01. About & Foundations */}
        <AboutSection />

        {/* 02. Specialized Divisions */}
        <Tracks onSelectTrackForJoin={(tid) => handleOpenJoin(tid)} />

        {/* 03. Hands-on Cyber Security Practice Mini-Games */}
        <CyberMiniGames onUnlockFlag={handleSolveFlag} />

        {/* 04. Interactive Terminal CTF Challenge */}
        <TerminalChallenge
          hasSolvedFlag={hasSolvedFlag}
          onSolveFlag={handleSolveFlag}
          onOpenJoin={() => handleOpenJoin()}
        />

        {/* 05. Florida Events, Workshops & Field Operations */}
        <EventsSection />

        {/* 05. Competitive CTF & Wargames Standings */}
        <CTFShowcase />

        {/* 06. Curated Resources & Tool Vault */}
        <ResourcesSection />

        {/* 07. Leadership Roster & FAQ */}
        <LeadershipSection />
      </main>

      {/* Footer */}
      <Footer 
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Join Cyber Netics Onboarding Modal */}
      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        preselectedTrack={preselectedTrack}
        hasSolvedFlag={hasSolvedFlag}
        solvedFlagValue={solvedFlagValue}
      />

      {/* Share & QR Code Modal */}
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Admin / Editor Portal Modal */}
      <AdminPortalModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ClubDataProvider>
      <MainApp />
    </ClubDataProvider>
  );
}

