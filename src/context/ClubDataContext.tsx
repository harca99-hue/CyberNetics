import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  addDoc, 
  getDocs,
  SUPER_ADMIN_EMAIL,
  User
} from '../lib/firebase';
import { 
  ClubSettings, 
  ClubEvent, 
  ResourceItem, 
  BoardMember, 
  MemberApplication, 
  RecruitSubmission, 
  UserProfile, 
  UserRole 
} from '../types';
import { 
  CLUB_INFO, 
  UPCOMING_EVENTS, 
  CURATED_RESOURCES as RESOURCES, 
  BOARD_MEMBERS 
} from '../data/clubData';

interface ClubDataContextType {
  // Authentication & Roles
  currentUser: User | null;
  userRole: UserRole;
  isAdmin: boolean;
  isEditor: boolean;
  authEmail: string | null;
  authLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithAdminEmail: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;

  // Dynamic Live Club Data
  clubSettings: ClubSettings;
  events: ClubEvent[];
  resources: ResourceItem[];
  boardMembers: BoardMember[];
  recruits: RecruitSubmission[];
  authorizedMembers: UserProfile[];
  dataLoading: boolean;

  // Cloud Firestore CRUD Operations
  updateClubSettings: (settings: Partial<ClubSettings>) => Promise<void>;
  saveEvent: (event: Partial<ClubEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  saveResource: (resource: Partial<ResourceItem>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  saveBoardMember: (member: Partial<BoardMember>) => Promise<void>;
  deleteBoardMember: (id: string) => Promise<void>;
  submitApplication: (application: MemberApplication) => Promise<void>;
  updateRecruitStatus: (id: string, status: 'pending' | 'accepted' | 'reviewed') => Promise<void>;
  deleteRecruit: (id: string) => Promise<void>;
  setMemberRole: (email: string, role: UserRole, displayName?: string) => Promise<void>;
  removeMemberRole: (email: string) => Promise<void>;
  seedInitialDataToFirestore: () => Promise<void>;
}

const ClubDataContext = createContext<ClubDataContextType | null>(null);

// Helper to ensure clean valid website url (defaults to https://cybernetics.vercel.app)
const cleanWebsiteUrl = (url?: string): string => {
  if (!url) return 'https://cybernetics.vercel.app';
  let clean = url.trim();
  // Fix semicolon typo like https;// or http;//
  if (clean.startsWith('https;//')) {
    clean = clean.replace('https;//', 'https://');
  } else if (clean.startsWith('http;//')) {
    clean = clean.replace('http;//', 'http://');
  }
  if (clean.startsWith('https//')) {
    clean = clean.replace('https//', 'https://');
  } else if (clean.startsWith('http//')) {
    clean = clean.replace('http//', 'http://');
  }
  if (clean.includes('cybernetics.com') || clean.includes('cybernetics.net') || clean.includes('cybernetics.vercel.app')) {
    return 'https://cybernetics.vercel.app';
  }
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = `https://${clean}`;
  }
  return clean;
};

// Helper to ensure clean valid resource item URL
const cleanResourceUrl = (url?: string): string => {
  if (!url || url === '#') return 'https://cybernetics.vercel.app';
  let clean = url.trim();
  if (clean.startsWith('https//')) clean = clean.replace('https//', 'https://');
  if (clean.startsWith('http//')) clean = clean.replace('http//', 'http://');
  if (clean.startsWith('https;//')) clean = clean.replace('https;//', 'https://');
  if (clean.startsWith('http;//')) clean = clean.replace('http;//', 'http://');
  if (clean.includes('cybernetics.com') || clean.includes('cybernetics.net') || clean.includes('cybernetics.vercel.app')) {
    return 'https://cybernetics.vercel.app';
  }
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = `https://${clean}`;
  }
  return clean;
};

// Helper to ensure updated regular meeting schedule is reflected
const cleanRegularMeeting = (meeting?: string): string => {
  if (!meeting || meeting.includes('Every Thursday') || meeting.includes('Turing Hall')) {
    return 'Every other Friday from 1:00 PM to 3:00 PM — Building 13 Room 105';
  }
  return meeting;
};

export const ClubDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('member');
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Club Data
  const [clubSettings, setClubSettings] = useState<ClubSettings>(CLUB_INFO);
  const [events, setEvents] = useState<ClubEvent[]>(UPCOMING_EVENTS);
  const [resources, setResources] = useState<ResourceItem[]>(RESOURCES);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>(BOARD_MEMBERS);
  const [recruits, setRecruits] = useState<RecruitSubmission[]>([]);
  const [authorizedMembers, setAuthorizedMembers] = useState<UserProfile[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Check saved session or Firebase auth state
  useEffect(() => {
    // Check saved session in localStorage as well (helpful in iFrames where 3P popups are blocked)
    const savedAdminEmail = localStorage.getItem('cybernetics_auth_email');
    if (savedAdminEmail) {
      setAuthEmail(savedAdminEmail);
      if (savedAdminEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
        setUserRole('admin');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const email = user.email || '';
        setAuthEmail(email);
        localStorage.setItem('cybernetics_auth_email', email);

        if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
          setUserRole('admin');
          // Persist super admin doc in users
          try {
            await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              email: email,
              displayName: user.displayName || 'Super Administrator',
              role: 'admin',
              updatedAt: new Date().toISOString()
            }, { merge: true });
          } catch (e) {
            console.error('Failed to sync super admin profile:', e);
          }
        } else {
          // Check role in Firestore users collection
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setUserRole(data.role || 'member');
            } else {
              // Check if pre-authorized by email in users collection
              const usersSnap = await getDocs(collection(db, 'users'));
              const match = usersSnap.docs.find(d => d.data().email?.toLowerCase() === email.toLowerCase());
              if (match) {
                setUserRole(match.data().role || 'member');
              } else {
                setUserRole('member');
              }
            }
          } catch (e) {
            console.warn('Error fetching user role:', e);
          }
        }
      } else if (!savedAdminEmail) {
        setUserRole('member');
        setAuthEmail(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore real-time updates for public content
  useEffect(() => {
    // 1. Club Settings
    const unsubSettings = onSnapshot(doc(db, 'club_settings', 'main'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as ClubSettings;
        setClubSettings(prev => ({ 
          ...prev, 
          ...data,
          regularMeeting: cleanRegularMeeting(data.regularMeeting),
          websiteUrl: cleanWebsiteUrl(data.websiteUrl)
        }));
      }
      setDataLoading(false);
    }, (err) => {
      console.warn('Firestore settings snapshot notice:', err.message);
      setDataLoading(false);
    });

    // 2. Events collection
    const unsubEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreEvents: ClubEvent[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<ClubEvent, 'id'>)
        }));
        setEvents(firestoreEvents);
      }
    }, (err) => {
      console.warn('Firestore events snapshot notice:', err.message);
    });

    // 3. Resources collection
    const unsubResources = onSnapshot(collection(db, 'resources'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreResources: ResourceItem[] = snapshot.docs.map(d => {
          const item = d.data() as Omit<ResourceItem, 'id'>;
          return {
            id: d.id,
            ...item,
            url: cleanResourceUrl(item.url)
          };
        });
        setResources(firestoreResources);
      }
    }, (err) => {
      console.warn('Firestore resources snapshot notice:', err.message);
    });

    // 4. Team Members collection
    const unsubMembers = onSnapshot(collection(db, 'team_members'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreBoard: BoardMember[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<BoardMember, 'id'>)
        }));
        setBoardMembers(firestoreBoard);
      }
    }, (err) => {
      console.warn('Firestore team_members snapshot notice:', err.message);
    });

    // 5. Authorized Users collection (for role management)
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userList: UserProfile[] = snapshot.docs.map(d => ({
        uid: d.id,
        ...(d.data() as Omit<UserProfile, 'uid'>)
      }));
      setAuthorizedMembers(userList);

      // Check current email in this list to update role dynamically
      if (authEmail) {
        if (authEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
          setUserRole('admin');
        } else {
          const matched = userList.find(u => u.email.toLowerCase() === authEmail.toLowerCase());
          if (matched) {
            setUserRole(matched.role);
          }
        }
      }
    }, (err) => {
      console.warn('Firestore users snapshot notice:', err.message);
    });

    // 6. Recruits collection
    const unsubRecruits = onSnapshot(collection(db, 'recruits'), (snapshot) => {
      const recruitList: RecruitSubmission[] = snapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<RecruitSubmission, 'id'>)
      }));
      setRecruits(recruitList);
    }, (err) => {
      // Ignored for unauthenticated users as security rules require editor/admin
    });

    return () => {
      unsubSettings();
      unsubEvents();
      unsubResources();
      unsubMembers();
      unsubUsers();
      unsubRecruits();
    };
  }, [authEmail]);

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email || '';
      setAuthEmail(email);
      localStorage.setItem('cybernetics_auth_email', email);
      if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
        setUserRole('admin');
      }
    } catch (err: any) {
      console.warn('Google popup auth notice (possibly iFrame blocked):', err);
      // Fallback: If iFrame blocks popup, offer manual email verification for balorclub29@gmail.com
      throw err;
    }
  };

  // Direct login with email (for admin / invited club team members)
  const loginWithAdminEmail = async (email: string): Promise<boolean> => {
    const trimmed = email.trim().toLowerCase();
    setAuthEmail(trimmed);
    localStorage.setItem('cybernetics_auth_email', trimmed);

    if (trimmed === SUPER_ADMIN_EMAIL.toLowerCase()) {
      setUserRole('admin');
      // Sync document in Firestore
      try {
        await setDoc(doc(db, 'users', 'super_admin_' + trimmed.replace(/[^a-zA-Z0-9]/g, '_')), {
          email: trimmed,
          displayName: 'Club Administrator (Owner)',
          role: 'admin',
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.warn('Firestore sync note:', e);
      }
      return true;
    }

    // Check if in authorized members
    const member = authorizedMembers.find(m => m.email.toLowerCase() === trimmed);
    if (member) {
      setUserRole(member.role);
      return true;
    }

    // If not yet added, default to member
    setUserRole('member');
    return false;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // Ignore
    }
    localStorage.removeItem('cybernetics_auth_email');
    setCurrentUser(null);
    setAuthEmail(null);
    setUserRole('member');
  };

  // Seed default data to Firestore so admin has starter records to edit
  const seedInitialDataToFirestore = async () => {
    try {
      // 1. Settings
      await setDoc(doc(db, 'club_settings', 'main'), {
        ...CLUB_INFO,
        lastUpdated: new Date().toISOString()
      }, { merge: true });

      // 2. Events
      for (const evt of UPCOMING_EVENTS) {
        await setDoc(doc(db, 'events', evt.id), {
          ...evt,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }

      // 3. Resources
      for (const res of RESOURCES) {
        await setDoc(doc(db, 'resources', res.id), {
          ...res,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }

      // 4. Board Members
      for (const bm of BOARD_MEMBERS) {
        await setDoc(doc(db, 'team_members', bm.id), {
          ...bm,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }

      // 5. Ensure Super Admin user record
      await setDoc(doc(db, 'users', 'super_admin_' + SUPER_ADMIN_EMAIL.replace(/[^a-zA-Z0-9]/g, '_')), {
        email: SUPER_ADMIN_EMAIL,
        displayName: 'Club Administrator (Lead)',
        role: 'admin',
        addedAt: new Date().toISOString()
      }, { merge: true });

    } catch (error) {
      console.error('Error seeding Firestore data:', error);
      throw error;
    }
  };

  // Update Club Settings
  const updateClubSettings = async (settings: Partial<ClubSettings>) => {
    const updated = {
      ...settings,
      websiteUrl: settings.websiteUrl !== undefined ? cleanWebsiteUrl(settings.websiteUrl) : undefined,
      lastUpdated: new Date().toISOString()
    };
    // Strip undefined keys before writing to firestore
    const cleanedPayload = Object.fromEntries(
      Object.entries(updated).filter(([_, v]) => v !== undefined)
    );
    await setDoc(doc(db, 'club_settings', 'main'), cleanedPayload, { merge: true });
    setClubSettings(prev => ({ 
      ...prev, 
      ...updated,
      websiteUrl: updated.websiteUrl || prev.websiteUrl
    }));
  };

  // Save Event (Create or Update)
  const saveEvent = async (event: Partial<ClubEvent>) => {
    const id = event.id || `evt-${Date.now()}`;
    const dataToSave = {
      ...event,
      id,
      spotsRemaining: event.spotsRemaining ?? 20,
      updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'events', id), dataToSave, { merge: true });
  };

  const deleteEvent = async (id: string) => {
    await deleteDoc(doc(db, 'events', id));
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Save Resource
  const saveResource = async (resource: Partial<ResourceItem>) => {
    const id = resource.id || `res-${Date.now()}`;
    const dataToSave = {
      ...resource,
      url: cleanResourceUrl(resource.url),
      id,
      updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'resources', id), dataToSave, { merge: true });
  };

  const deleteResource = async (id: string) => {
    await deleteDoc(doc(db, 'resources', id));
    setResources(prev => prev.filter(r => r.id !== id));
  };

  // Save Board Member
  const saveBoardMember = async (member: Partial<BoardMember>) => {
    const id = member.id || `board-${Date.now()}`;
    const dataToSave = {
      ...member,
      id,
      updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'team_members', id), dataToSave, { merge: true });
  };

  const deleteBoardMember = async (id: string) => {
    await deleteDoc(doc(db, 'team_members', id));
    setBoardMembers(prev => prev.filter(b => b.id !== id));
  };

  // Submit Application
  const submitApplication = async (app: MemberApplication) => {
    const submissionData: Omit<RecruitSubmission, 'id'> = {
      fullName: app.fullName,
      email: app.email,
      studentId: app.studentId,
      major: app.major,
      gradYear: app.gradYear,
      experienceLevel: app.experienceLevel,
      interestedTracks: app.interestedTracks,
      discordHandle: app.discordHandle,
      motivation: app.motivation,
      solvedFlag: app.solvedFlag || '',
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'recruits'), submissionData);
    } catch (err) {
      console.warn('Notice writing recruit to Firestore:', err);
      // Keep local state update
    }
  };

  // Update Recruit Status
  const updateRecruitStatus = async (id: string, status: 'pending' | 'accepted' | 'reviewed') => {
    await updateDoc(doc(db, 'recruits', id), {
      status,
      reviewedAt: new Date().toISOString()
    });
  };

  const deleteRecruit = async (id: string) => {
    await deleteDoc(doc(db, 'recruits', id));
  };

  // Manage Club Editors & Roles
  const setMemberRole = async (email: string, role: UserRole, displayName?: string) => {
    const docId = 'user_' + email.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    await setDoc(doc(db, 'users', docId), {
      email: email.trim().toLowerCase(),
      displayName: displayName || email.split('@')[0],
      role,
      addedAt: new Date().toISOString(),
      addedBy: authEmail || 'Administrator'
    }, { merge: true });
  };

  const removeMemberRole = async (email: string) => {
    const docId = 'user_' + email.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    await deleteDoc(doc(db, 'users', docId));
  };

  const isAdmin = userRole === 'admin' || (authEmail?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
  const isEditor = isAdmin || userRole === 'editor';

  return (
    <ClubDataContext.Provider
      value={{
        currentUser,
        userRole,
        isAdmin,
        isEditor,
        authEmail,
        authLoading,
        loginWithGoogle,
        loginWithAdminEmail,
        logout,
        clubSettings,
        events,
        resources,
        boardMembers,
        recruits,
        authorizedMembers,
        dataLoading,
        updateClubSettings,
        saveEvent,
        deleteEvent,
        saveResource,
        deleteResource,
        saveBoardMember,
        deleteBoardMember,
        submitApplication,
        updateRecruitStatus,
        deleteRecruit,
        setMemberRole,
        removeMemberRole,
        seedInitialDataToFirestore
      }}
    >
      {children}
    </ClubDataContext.Provider>
  );
};

export const useClubData = () => {
  const context = useContext(ClubDataContext);
  if (!context) {
    throw new Error('useClubData must be used within a ClubDataProvider');
  }
  return context;
};
