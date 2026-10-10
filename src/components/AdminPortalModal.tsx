import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Calendar, 
  Users, 
  BookOpen, 
  UserPlus, 
  Cloud, 
  Download, 
  ExternalLink, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  AlertCircle, 
  Lock, 
  Mail, 
  LogOut, 
  Sparkles, 
  ChevronRight,
  FileText,
  Key
} from 'lucide-react';
import { useClubData } from '../context/ClubDataContext';
import { ClubEvent, ResourceItem, BoardMember, UserRole } from '../types';
import { SUPER_ADMIN_EMAIL } from '../lib/firebase';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    userRole,
    isAdmin,
    isEditor,
    authEmail,
    loginWithGoogle,
    loginWithAdminEmail,
    logout,
    clubSettings,
    updateClubSettings,
    events,
    saveEvent,
    deleteEvent,
    resources,
    saveResource,
    deleteResource,
    boardMembers,
    saveBoardMember,
    deleteBoardMember,
    recruits,
    updateRecruitStatus,
    deleteRecruit,
    authorizedMembers,
    setMemberRole,
    removeMemberRole,
    seedInitialDataToFirestore
  } = useClubData();

  // Selected tab
  const [activeTab, setActiveTab] = useState<'settings' | 'events' | 'resources' | 'team' | 'access' | 'recruits' | 'cloud'>('settings');

  // Local form states
  const [settingsForm, setSettingsForm] = useState(clubSettings);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Email login form
  const [inputEmail, setInputEmail] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Member Access form
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<UserRole>('editor');

  // Event modal / editing
  const [editingEvent, setEditingEvent] = useState<Partial<ClubEvent> | null>(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);

  // Resource modal / editing
  const [editingResource, setEditingResource] = useState<Partial<ResourceItem> | null>(null);
  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);

  // Board member editing
  const [editingMember, setEditingMember] = useState<Partial<BoardMember> | null>(null);
  const [isMemberFormOpen, setIsMemberFormOpen] = useState(false);

  // Sync settingsForm when clubSettings updates from Firestore
  React.useEffect(() => {
    setSettingsForm(clubSettings);
  }, [clubSettings]);

  if (!isOpen) return null;

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaveStatus('Saving to Google Cloud Firestore...');
      await updateClubSettings(settingsForm);
      setSaveStatus('Saved successfully to Google Cloud Firestore!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      setSaveStatus('Error saving: ' + (err.message || 'Check connection'));
    }
  };

  const handleSeedDefaults = async () => {
    if (window.confirm('Seed default starter events, resources, and leadership profiles to Google Cloud Firestore?')) {
      try {
        setSaveStatus('Seeding starter records to Firestore...');
        await seedInitialDataToFirestore();
        setSaveStatus('Firestore successfully populated!');
        setTimeout(() => setSaveStatus(null), 3000);
      } catch (err: any) {
        setSaveStatus('Error seeding: ' + err.message);
      }
    }
  };

  const handleEmailLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!inputEmail) return;
    try {
      const authorized = await loginWithAdminEmail(inputEmail);
      if (!authorized && inputEmail.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
        setLoginError(`Email authenticated as visitor. To edit, ask ${SUPER_ADMIN_EMAIL} to grant you editor access in the Access Control tab.`);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    }
  };

  const handleClaimSuperAdmin = async () => {
    setInputEmail(SUPER_ADMIN_EMAIL);
    await loginWithAdminEmail(SUPER_ADMIN_EMAIL);
  };

  const handleAddTeamEditor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail) return;
    try {
      await setMemberRole(newMemberEmail, newMemberRole, newMemberName);
      setNewMemberEmail('');
      setNewMemberName('');
      setSaveStatus(`Added ${newMemberEmail} with ${newMemberRole} privileges!`);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      alert('Failed to grant role: ' + err.message);
    }
  };

  const handleExportDataBackup = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      clubSettings,
      events,
      resources,
      boardMembers,
      recruits,
      authorizedMembers
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber-netics-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Google Cloud links & Public Domain
  const gcpFirestoreUrl = 'https://console.cloud.google.com/firestore/databases/ai-studio-cybernetics-c389269b-a0ee-495f-b5bb-2fd7a3fa7fd2/data?project=sonic-keyword-xggh3';
  const firebaseConsoleUrl = 'https://console.firebase.google.com/project/sonic-keyword-xggh3/firestore';
  const publicRunAppUrl = clubSettings.websiteUrl?.startsWith('http://') || clubSettings.websiteUrl?.startsWith('https://')
    ? clubSettings.websiteUrl
    : (clubSettings.websiteUrl ? `https://${clubSettings.websiteUrl}` : 'https://cybernetics.vercel.app');

  return (
    <div 
      id="admin-portal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="admin-portal-container"
        className="relative w-full max-w-5xl bg-[#0a0f1d] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col max-h-[92vh] my-auto"
      >
        {/* Header decoration */}
        <div className="h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-indigo-500" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080d18]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-wide">Cyber Netics Control Center</h3>
                {isEditor && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider ${
                    isAdmin 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {isAdmin ? 'Super Admin' : 'Editor'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Google Cloud Firestore Live CMS & Team Access Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {authEmail && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate max-w-[180px]">{authEmail}</span>
                <button
                  id="admin-logout-btn"
                  onClick={logout}
                  title="Sign out"
                  className="ml-1 text-slate-500 hover:text-rose-400"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <button
              id="close-admin-portal-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status notification bar */}
        {saveStatus && (
          <div className="px-6 py-2 bg-cyan-950/80 border-b border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>{saveStatus}</span>
            </div>
            <button onClick={() => setSaveStatus(null)} className="text-slate-400 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Authentication Gate (if user is neither admin nor editor) */}
        {!isEditor ? (
          <div className="p-8 max-w-lg mx-auto text-center space-y-6 my-auto">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-white">Administrator & Editor Portal</h4>
              <p className="text-sm text-slate-400 mt-1">
                Authenticate with your administrator credentials or authorized club editor email to update website content live.
              </p>
            </div>

            {/* Quick 1-Click Lead Administrator Login */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wide">
                  Lead Administrator Account
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300">
                  Default Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono break-all">
                {SUPER_ADMIN_EMAIL}
              </p>
              <button
                id="claim-super-admin-btn"
                onClick={handleClaimSuperAdmin}
                className="w-full mt-2 py-2.5 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/60"
              >
                <Key className="w-4 h-4" />
                Access as Lead Administrator ({SUPER_ADMIN_EMAIL})
              </button>
            </div>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-xs font-mono text-slate-500 uppercase">Or Club Editor Email</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Email login form */}
            <form onSubmit={handleEmailLoginSubmit} className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Enter Your Authorized Club Email
                </label>
                <input
                  id="admin-email-input"
                  type="email"
                  placeholder="editor@cybernetics-club.edu"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070b14] border border-slate-700 focus:border-cyan-400 rounded-lg text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              {loginError && (
                <p className="text-xs text-rose-400 font-mono bg-rose-950/40 p-2.5 rounded border border-rose-800/40">
                  {loginError}
                </p>
              )}

              <button
                id="submit-email-login-btn"
                type="submit"
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs uppercase tracking-wider transition-colors border border-slate-700 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                Sign In with Club Email
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin / Editor Workspace */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 px-6 border-b border-slate-800/80 bg-[#090e1a] overflow-x-auto scrollbar-none py-2 shrink-0">
              <button
                id="admin-tab-settings"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                Club Information
              </button>

              <button
                id="admin-tab-events"
                onClick={() => setActiveTab('events')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === 'events'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Events & Workshops ({events.length})
              </button>

              <button
                id="admin-tab-resources"
                onClick={() => setActiveTab('resources')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === 'resources'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Tool Vault ({resources.length})
              </button>

              <button
                id="admin-tab-team"
                onClick={() => setActiveTab('team')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === 'team'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Leadership ({boardMembers.length})
              </button>

              {isAdmin && (
                <button
                  id="admin-tab-access"
                  onClick={() => setActiveTab('access')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${
                    activeTab === 'access'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Team Editors & Access
                </button>
              )}

              <button
                id="admin-tab-recruits"
                onClick={() => setActiveTab('recruits')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === 'recruits'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Applications ({recruits.length})
              </button>

              <button
                id="admin-tab-cloud"
                onClick={() => setActiveTab('cloud')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === 'cloud'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Cloud className="w-3.5 h-3.5" />
                Google Cloud & Backups
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">

              {/* TAB 1: CLUB SETTINGS & ANNOUNCEMENTS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h4 className="text-base font-bold text-white">General Club Information & Headlines</h4>
                      <p className="text-xs text-slate-400 font-mono">
                        Changes update immediately in Google Cloud Firestore and reflect live on the website.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSeedDefaults}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition-colors"
                      >
                        Reset / Seed Starters
                      </button>
                      <button
                        id="save-settings-btn"
                        type="submit"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-cyan-950/50"
                      >
                        <Save className="w-4 h-4" />
                        Save To Firestore
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Club Name</label>
                      <input
                        type="text"
                        value={settingsForm.name}
                        onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">University / Institute</label>
                      <input
                        type="text"
                        value={settingsForm.university}
                        onChange={(e) => setSettingsForm({ ...settingsForm, university: e.target.value })}
                        className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Tagline / Mission</label>
                      <input
                        type="text"
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono uppercase text-amber-400 mb-1">
                        Urgent Announcement Banner (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 📢 Join our Welcome Back Pizza & CTF Session this Friday at 1:00 PM in Building 13 Room 105!"
                        value={settingsForm.announcement || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                        className="w-full px-3 py-2 bg-[#070b14] border border-amber-500/40 rounded-lg text-sm text-amber-200 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-cyan-400 mb-1">Official Website URL</label>
                      <input
                        type="url"
                        placeholder="https://cybernetics.vercel.app"
                        value={settingsForm.websiteUrl || 'https://cybernetics.vercel.app'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, websiteUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-[#070b14] border border-cyan-500/40 rounded-lg text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Regular Meeting Schedule</label>
                      <input
                        type="text"
                        value={settingsForm.regularMeeting}
                        onChange={(e) => setSettingsForm({ ...settingsForm, regularMeeting: e.target.value })}
                        className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Discord Invite URL</label>
                      <input
                        type="text"
                        value={settingsForm.discordInvite}
                        onChange={(e) => setSettingsForm({ ...settingsForm, discordInvite: e.target.value })}
                        className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={settingsForm.contactEmail}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">CTF Global Rank</label>
                      <input
                        type="text"
                        value={settingsForm.ctfGlobalRank}
                        onChange={(e) => setSettingsForm({ ...settingsForm, ctfGlobalRank: e.target.value })}
                        className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 2: EVENTS & WORKSHOPS */}
              {activeTab === 'events' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h4 className="text-base font-bold text-white">Scheduled Workshops & Operations</h4>
                      <p className="text-xs text-slate-400 font-mono">Create, modify, or reschedule club events in Firestore</p>
                    </div>
                    <button
                      id="add-event-btn"
                      onClick={() => {
                        setEditingEvent({
                          title: '',
                          category: 'Workshop',
                          date: 'NOV 15, 2026',
                          time: '1:00 PM - 3:00 PM',
                          location: 'Building 13',
                          room: 'Room 105',
                          difficulty: 'Beginner',
                          instructor: 'Cyber Netics Lead',
                          instructorRole: 'Track Lead',
                          description: '',
                          spotsRemaining: 25
                        });
                        setIsEventFormOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono uppercase transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Event
                    </button>
                  </div>

                  {/* Events List */}
                  <div className="space-y-3">
                    {events.map((evt) => (
                      <div 
                        key={evt.id}
                        className="p-4 rounded-xl bg-[#070b14] border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                              {evt.category}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              {evt.date} • {evt.time}
                            </span>
                          </div>
                          <h5 className="text-white font-bold text-sm">{evt.title}</h5>
                          <p className="text-xs text-slate-400">
                            {evt.location} ({evt.room}) • Instructor: {evt.instructor} • {evt.spotsRemaining} spots
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setEditingEvent(evt);
                              setIsEventFormOpen(true);
                            }}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Edit Event"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete event "${evt.title}" from Firestore?`)) {
                                await deleteEvent(evt.id);
                              }
                            }}
                            className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 transition-colors border border-rose-900/40"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Inline Event Edit/Create Modal */}
                  {isEventFormOpen && editingEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                      <div className="w-full max-w-lg bg-[#0c1222] border border-cyan-500/40 rounded-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h4 className="font-bold text-white text-base">
                            {editingEvent.id ? 'Edit Event' : 'Create New Event'}
                          </h4>
                          <button onClick={() => setIsEventFormOpen(false)} className="text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="block uppercase font-mono text-slate-400 mb-1">Title</label>
                            <input
                              type="text"
                              value={editingEvent.title || ''}
                              onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                              className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block uppercase font-mono text-slate-400 mb-1">Category</label>
                              <select
                                value={editingEvent.category || 'Workshop'}
                                onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value as any })}
                                className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                              >
                                <option value="Workshop">Workshop</option>
                                <option value="CTF">CTF</option>
                                <option value="Competition">Competition</option>
                                <option value="Guest Speaker">Guest Speaker</option>
                                <option value="Social">Social</option>
                              </select>
                            </div>

                            <div>
                              <label className="block uppercase font-mono text-slate-400 mb-1">Difficulty</label>
                              <select
                                value={editingEvent.difficulty || 'Beginner'}
                                onChange={(e) => setEditingEvent({ ...editingEvent, difficulty: e.target.value as any })}
                                className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                              >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="All Levels">All Levels</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block uppercase font-mono text-slate-400 mb-1">Date</label>
                              <input
                                type="text"
                                placeholder="NOV 15, 2026"
                                value={editingEvent.date || ''}
                                onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                                className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                              />
                            </div>
                            <div>
                              <label className="block uppercase font-mono text-slate-400 mb-1">Time</label>
                              <input
                                type="text"
                                placeholder="6:30 PM - 8:30 PM"
                                value={editingEvent.time || ''}
                                onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                                className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block uppercase font-mono text-slate-400 mb-1">Building / Location</label>
                              <input
                                type="text"
                                value={editingEvent.location || ''}
                                onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                                className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                              />
                            </div>
                            <div>
                              <label className="block uppercase font-mono text-slate-400 mb-1">Room / Virtual</label>
                              <input
                                type="text"
                                value={editingEvent.room || ''}
                                onChange={(e) => setEditingEvent({ ...editingEvent, room: e.target.value })}
                                className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block uppercase font-mono text-slate-400 mb-1">Instructor</label>
                              <input
                                type="text"
                                value={editingEvent.instructor || ''}
                                onChange={(e) => setEditingEvent({ ...editingEvent, instructor: e.target.value })}
                                className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                              />
                            </div>
                            <div>
                              <label className="block uppercase font-mono text-slate-400 mb-1">Available Spots</label>
                              <input
                                type="number"
                                value={editingEvent.spotsRemaining ?? 20}
                                onChange={(e) => setEditingEvent({ ...editingEvent, spotsRemaining: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block uppercase font-mono text-slate-400 mb-1">Description</label>
                            <textarea
                              rows={3}
                              value={editingEvent.description || ''}
                              onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                              className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                          <button
                            onClick={() => setIsEventFormOpen(false)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={async () => {
                              if (!editingEvent.title) {
                                alert('Title is required');
                                return;
                              }
                              await saveEvent(editingEvent);
                              setIsEventFormOpen(false);
                            }}
                            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded text-xs"
                          >
                            Save to Cloud
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CURATED TOOL VAULT */}
              {activeTab === 'resources' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h4 className="text-base font-bold text-white">Curated Tools & Guides</h4>
                      <p className="text-xs text-slate-400 font-mono">Manage recommended platforms, cheatsheets, and roadmaps</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingResource({
                          title: '',
                          category: 'Platform',
                          description: '',
                          url: 'https://',
                          tags: ['Security', 'Lab'],
                          recommendedFor: 'All Members'
                        });
                        setIsResourceFormOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono uppercase transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Resource
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {resources.map((res) => (
                      <div 
                        key={res.id}
                        className="p-4 rounded-xl bg-[#070b14] border border-slate-800 flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                              {res.category}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">{res.recommendedFor}</span>
                          </div>
                          <h5 className="font-bold text-white text-sm">{res.title}</h5>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{res.description}</p>
                          <a 
                            href={res.url.startsWith('http://') || res.url.startsWith('https://') ? res.url : `https://${res.url}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline mt-2 font-mono break-all"
                          >
                            {res.url} <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-800/80 pt-2">
                          <button
                            onClick={() => {
                              setEditingResource(res);
                              setIsResourceFormOpen(true);
                            }}
                            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete resource "${res.title}"?`)) {
                                await deleteResource(res.id);
                              }
                            }}
                            className="p-1.5 rounded bg-rose-950/40 text-rose-400 hover:text-rose-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Resource Form Modal */}
                  {isResourceFormOpen && editingResource && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                      <div className="w-full max-w-lg bg-[#0c1222] border border-cyan-500/40 rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h4 className="font-bold text-white text-base">
                            {editingResource.id ? 'Edit Resource' : 'Add New Resource'}
                          </h4>
                          <button onClick={() => setIsResourceFormOpen(false)} className="text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="block uppercase font-mono text-slate-400 mb-1">Title</label>
                            <input
                              type="text"
                              value={editingResource.title || ''}
                              onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                              className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block uppercase font-mono text-slate-400 mb-1">Category</label>
                              <select
                                value={editingResource.category || 'Platform'}
                                onChange={(e) => setEditingResource({ ...editingResource, category: e.target.value as any })}
                                className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                              >
                                <option value="Platform">Platform</option>
                                <option value="Toolkit">Toolkit</option>
                                <option value="Roadmap">Roadmap</option>
                                <option value="Cheatsheet">Cheatsheet</option>
                              </select>
                            </div>
                            <div>
                              <label className="block uppercase font-mono text-slate-400 mb-1">Recommended For</label>
                              <input
                                type="text"
                                placeholder="Beginners / Red Team"
                                value={editingResource.recommendedFor || ''}
                                onChange={(e) => setEditingResource({ ...editingResource, recommendedFor: e.target.value })}
                                className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block uppercase font-mono text-slate-400 mb-1">URL</label>
                            <input
                              type="url"
                              value={editingResource.url || ''}
                              onChange={(e) => setEditingResource({ ...editingResource, url: e.target.value })}
                              className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                            />
                          </div>

                          <div>
                            <label className="block uppercase font-mono text-slate-400 mb-1">Description</label>
                            <textarea
                              rows={3}
                              value={editingResource.description || ''}
                              onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                              className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                          <button
                            onClick={() => setIsResourceFormOpen(false)}
                            className="px-4 py-2 bg-slate-800 text-slate-300 rounded text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={async () => {
                              if (!editingResource.title || !editingResource.url) {
                                alert('Title and URL are required');
                                return;
                              }
                              await saveResource(editingResource);
                              setIsResourceFormOpen(false);
                            }}
                            className="px-4 py-2 bg-cyan-500 text-black font-semibold rounded text-xs"
                          >
                            Save Resource
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: LEADERSHIP & BOARD */}
              {activeTab === 'team' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h4 className="text-base font-bold text-white">Executive Board & Track Leads</h4>
                      <p className="text-xs text-slate-400 font-mono">Officers, certifications, and handles displayed on the website</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingMember({
                          name: '',
                          role: 'Track Lead',
                          major: 'Computer Science',
                          year: 'Junior',
                          certifications: ['Security+'],
                          focus: 'Offensive Security',
                          bio: '',
                          handle: '0xNewLead'
                        });
                        setIsMemberFormOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono uppercase transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Board Member
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {boardMembers.map((bm) => (
                      <div key={bm.id} className="p-4 rounded-xl bg-[#070b14] border border-slate-800 flex flex-col justify-between gap-2">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-cyan-400 text-xs font-bold">{bm.handle}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{bm.year}</span>
                          </div>
                          <h5 className="font-bold text-white text-base mt-1">{bm.name}</h5>
                          <p className="text-xs text-cyan-300 font-mono">{bm.role}</p>
                          <p className="text-xs text-slate-400 mt-1">{bm.major}</p>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{bm.bio}</p>
                        </div>
                        <div className="flex justify-end gap-2 border-t border-slate-800/80 pt-2">
                          <button
                            onClick={() => {
                              setEditingMember(bm);
                              setIsMemberFormOpen(true);
                            }}
                            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete "${bm.name}" from Board?`)) {
                                await deleteBoardMember(bm.id);
                              }
                            }}
                            className="p-1.5 rounded bg-rose-950/40 text-rose-400 hover:text-rose-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Board Member Form Modal */}
                  {isMemberFormOpen && editingMember && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                      <div className="w-full max-w-lg bg-[#0c1222] border border-cyan-500/40 rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h4 className="font-bold text-white text-base">
                            {editingMember.id ? 'Edit Board Member' : 'Add Board Member'}
                          </h4>
                          <button onClick={() => setIsMemberFormOpen(false)} className="text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block uppercase font-mono text-slate-400 mb-1">Full Name</label>
                              <input
                                type="text"
                                value={editingMember.name || ''}
                                onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                                className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                              />
                            </div>
                            <div>
                              <label className="block uppercase font-mono text-slate-400 mb-1">Handle</label>
                              <input
                                type="text"
                                placeholder="0xHandle"
                                value={editingMember.handle || ''}
                                onChange={(e) => setEditingMember({ ...editingMember, handle: e.target.value })}
                                className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block uppercase font-mono text-slate-400 mb-1">Role</label>
                              <input
                                type="text"
                                placeholder="Vice President, Track Lead..."
                                value={editingMember.role || ''}
                                onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                                className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                              />
                            </div>
                            <div>
                              <label className="block uppercase font-mono text-slate-400 mb-1">Year</label>
                              <input
                                type="text"
                                placeholder="Junior / Senior"
                                value={editingMember.year || ''}
                                onChange={(e) => setEditingMember({ ...editingMember, year: e.target.value })}
                                className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block uppercase font-mono text-slate-400 mb-1">Major & Specialization</label>
                            <input
                              type="text"
                              value={editingMember.major || ''}
                              onChange={(e) => setEditingMember({ ...editingMember, major: e.target.value })}
                              className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                            />
                          </div>

                          <div>
                            <label className="block uppercase font-mono text-slate-400 mb-1">Bio</label>
                            <textarea
                              rows={3}
                              value={editingMember.bio || ''}
                              onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                              className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded text-sm text-white"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                          <button
                            onClick={() => setIsMemberFormOpen(false)}
                            className="px-4 py-2 bg-slate-800 text-slate-300 rounded text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={async () => {
                              if (!editingMember.name || !editingMember.role) {
                                alert('Name and Role are required');
                                return;
                              }
                              await saveBoardMember(editingMember);
                              setIsMemberFormOpen(false);
                            }}
                            className="px-4 py-2 bg-cyan-500 text-black font-semibold rounded text-xs"
                          >
                            Save Member
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: TEAM ACCESS & ROLE DELEGATION (ADMIN ONLY) */}
              {activeTab === 'access' && isAdmin && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-slate-800">
                    <h4 className="text-base font-bold text-white">Authorized Club Editors & Administrators</h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Grant club officers and executive board members permission to edit the website directly.
                    </p>
                  </div>

                  {/* Add Member Privilege Form */}
                  <form onSubmit={handleAddTeamEditor} className="p-4 rounded-xl bg-[#070b14] border border-cyan-500/30 space-y-4">
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
                      <UserPlus className="w-4 h-4" />
                      Grant Website Editing Privileges
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Member Email</label>
                        <input
                          type="email"
                          placeholder="vp@cybernetics-club.edu"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Name / Title (Optional)</label>
                        <input
                          type="text"
                          placeholder="Alex Chen (VP)"
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Assigned Role</label>
                        <select
                          value={newMemberRole}
                          onChange={(e) => setNewMemberRole(e.target.value as UserRole)}
                          className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 rounded-lg text-sm text-white focus:border-cyan-400 focus:outline-none"
                        >
                          <option value="editor">Editor (Can edit events & content)</option>
                          <option value="admin">Administrator (Full control & roles)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono uppercase tracking-wider transition-colors shadow-lg shadow-cyan-950/50"
                      >
                        Grant Privileges in Firestore
                      </button>
                    </div>
                  </form>

                  {/* Authorized Members Registry */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-mono uppercase text-slate-400">Current Authorized Team Members</h5>

                    {/* Super Admin Static Entry */}
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-xs">
                          👑
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{SUPER_ADMIN_EMAIL}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              Lead Administrator (Owner)
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono">Permanent Super Administrator</p>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Authorized Members from Firestore */}
                    {authorizedMembers.filter(m => m.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()).map((m) => (
                      <div key={m.uid || m.email} className="p-3.5 rounded-xl bg-[#070b14] border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{m.email}</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              m.role === 'admin' 
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            }`}>
                              {m.role.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono">
                            {m.displayName || 'Club Team Member'} • Added {m.addedAt?.slice(0, 10) || 'Recently'}
                          </p>
                        </div>

                        <button
                          onClick={async () => {
                            if (window.confirm(`Revoke editing privileges for ${m.email}?`)) {
                              await removeMemberRole(m.email);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:text-rose-200 border border-rose-900/40"
                          title="Revoke Role"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: CADET APPLICATIONS (RECRUITS) */}
              {activeTab === 'recruits' && (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-slate-800">
                    <h4 className="text-base font-bold text-white">Student Cadet Enlistment Applications</h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Real-time submissions from students who completed the application modal
                    </p>
                  </div>

                  {recruits.length === 0 ? (
                    <div className="p-8 text-center rounded-xl bg-[#070b14] border border-slate-800 text-slate-400 text-xs font-mono space-y-2">
                      <FileText className="w-8 h-8 mx-auto text-slate-600" />
                      <p>No new applicant records yet.</p>
                      <p className="text-slate-500">
                        When students submit the "Enlist in Cyber Netics" modal, their profile will appear here in real-time.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recruits.map((rec) => (
                        <div key={rec.id} className="p-4 rounded-xl bg-[#070b14] border border-slate-800 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-white text-sm">{rec.fullName}</h5>
                              <span className="text-xs text-cyan-400 font-mono">({rec.email})</span>
                              {rec.solvedFlag && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  🚩 CTF Solver
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={rec.status}
                                onChange={(e) => {
                                  if (rec.id) updateRecruitStatus(rec.id, e.target.value as any);
                                }}
                                className="px-2.5 py-1 rounded bg-slate-800 text-xs text-white border border-slate-700"
                              >
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="accepted">Accepted</option>
                              </select>
                              {rec.id && (
                                <button
                                  onClick={() => deleteRecruit(rec.id!)}
                                  className="p-1 text-slate-500 hover:text-rose-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="text-xs text-slate-400 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono pt-1">
                            <div>Major: <span className="text-slate-200">{rec.major}</span></div>
                            <div>Year: <span className="text-slate-200">{rec.gradYear}</span></div>
                            <div>Level: <span className="text-slate-200">{rec.experienceLevel}</span></div>
                            <div>Discord: <span className="text-slate-200">{rec.discordHandle || 'N/A'}</span></div>
                          </div>

                          {rec.motivation && (
                            <p className="text-xs text-slate-300 bg-slate-900/50 p-2.5 rounded border border-slate-800">
                              "{rec.motivation}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: GOOGLE CLOUD & BACKUP DESK */}
              {activeTab === 'cloud' && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-slate-800">
                    <h4 className="text-base font-bold text-white">Google Cloud & Project Backup</h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Direct cloud console endpoints, live Google Cloud Run hosting, and local computer file exports
                    </p>
                  </div>

                  {/* Cloud status card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-950/30 to-slate-900 border border-cyan-500/30 space-y-3">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                        <Cloud className="w-5 h-5" />
                        <span>Google Cloud Firestore Database</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Database ID: <code className="text-cyan-300 font-mono">ai-studio-cybernetics-c389269b-a0ee-495f-b5bb-2fd7a3fa7fd2</code>
                        <br />
                        GCP Project: <code className="text-cyan-300 font-mono">sonic-keyword-xggh3</code>
                      </p>
                      <div className="pt-2 flex flex-wrap gap-2">
                        <a
                          href={gcpFirestoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-all"
                        >
                          <span>Google Cloud Console</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={firebaseConsoleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-all"
                        >
                          <span>Firebase Console</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-950/30 to-slate-900 border border-emerald-500/30 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <ShieldCheck className="w-5 h-5" />
                        <span>Public Website Domain</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Live Domain: <code className="text-emerald-300 font-mono font-bold">{publicRunAppUrl}</code>
                        <br />
                        Continuous deployment is live. Every update made in this Control Center syncs immediately to Google Cloud Firestore and updates on the public domain.
                      </p>
                      <a
                        href={publicRunAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono transition-all"
                      >
                        <span>Open Public Live Site</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Local Computer File Backup Card */}
                  <div className="p-5 rounded-xl bg-[#070b14] border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-white text-sm flex items-center gap-2">
                          <Download className="w-4 h-4 text-cyan-400" />
                          Download Website Copy & Database Records to Computer
                        </h5>
                        <p className="text-xs text-slate-400 mt-1">
                          Export a structured JSON archive containing all club settings, events, resources, board members, and student recruit applications.
                        </p>
                      </div>
                      <button
                        id="export-data-backup-btn"
                        onClick={handleExportDataBackup}
                        className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-cyan-950/50"
                      >
                        <Download className="w-4 h-4" />
                        Download Backup (JSON)
                      </button>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1 font-mono">
                      <div className="text-slate-300 font-bold">💡 How to export the full source code files:</div>
                      <p>
                        To export the complete source code repository (including React, Vite, TypeScript, and Tailwind files), click the <strong className="text-cyan-300">Project / Settings</strong> menu in the upper corner of Google AI Studio and choose <strong className="text-cyan-300">"Export to GitHub"</strong> or <strong className="text-cyan-300">"Download ZIP"</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#080d18] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CLOUD RUN & FIRESTORE SYNCHRONIZED</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
