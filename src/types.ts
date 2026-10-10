export type TrackId = 'offensive' | 'defensive' | 'reverse-engineering' | 'cloud-sec' | 'crypto';

export interface Track {
  id: TrackId;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  color: string;
  tools: string[];
  skillsLearned: string[];
  sampleProject: string;
  meetingDay: string;
}

export type EventCategory = 'All' | 'Workshop' | 'CTF' | 'Competition' | 'Guest Speaker' | 'Social' | 'Conference';

export interface ClubEvent {
  id: string;
  title: string;
  category: 'Workshop' | 'CTF' | 'Competition' | 'Guest Speaker' | 'Social' | 'Conference';
  date: string;
  time: string;
  location: string;
  room: string;
  city?: string;
  state?: string;
  isFloridaEvent?: boolean;
  eventUrl?: string;
  venueAddress?: string;
  difficulty: 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  instructorRole: string;
  description: string;
  prerequisites?: string[];
  spotsRemaining: number;
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  major: string;
  year: string;
  certifications: string[];
  focus: string;
  bio: string;
  github?: string;
  linkedin?: string;
  handle: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'Platform' | 'Toolkit' | 'Roadmap' | 'Cheatsheet';
  description: string;
  url: string;
  tags: string[];
  recommendedFor: string;
}

export interface CtfAchievement {
  event: string;
  year: string;
  rank: string;
  totalTeams: string;
  highlight: string;
}

export interface MemberApplication {
  fullName: string;
  email: string;
  studentId: string;
  major: string;
  gradYear: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  interestedTracks: TrackId[];
  discordHandle: string;
  motivation: string;
  solvedFlag?: string;
}

export type UserRole = 'admin' | 'editor' | 'member';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  addedAt?: string;
  addedBy?: string;
}

export interface ClubSettings {
  name: string;
  university: string;
  established: string;
  tagline: string;
  announcement?: string;
  regularMeeting: string;
  discordInvite: string;
  githubUrl: string;
  ctftimeUrl: string;
  websiteUrl?: string;
  contactEmail: string;
  activeMembersCount: number;
  ctfGlobalRank: string;
  workshopsCompleted: number;
  internshipPlacementRate: string;
  lastUpdated?: string;
}

export type MiniGameId = 'sqli' | 'phishing' | 'firewall' | 'hashcracker' | 'cipher';

export interface MiniGameProgress {
  score: number;
  completedGames: Record<MiniGameId, boolean>;
  solvedChallengesCount: number;
  badgeTitle: string;
}

export interface RecruitSubmission {
  id?: string;
  fullName: string;
  email: string;
  studentId: string;
  major: string;
  gradYear: string;
  experienceLevel: string;
  interestedTracks: string[];
  discordHandle: string;
  motivation: string;
  solvedFlag?: string;
  status: 'pending' | 'accepted' | 'reviewed';
  submittedAt: string;
}
