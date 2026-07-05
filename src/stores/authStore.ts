import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  
  // Modals
  authModalOpen: boolean;
  profileModalOpen: boolean;
  
  // Actions
  setAuthModalOpen: (open: boolean) => void;
  setProfileModalOpen: (open: boolean) => void;
  initializeAuth: () => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,

  authModalOpen: false,
  profileModalOpen: false,

  setAuthModalOpen: (open) => set({ authModalOpen: open }),
  setProfileModalOpen: (open) => set({ profileModalOpen: open }),

  initializeAuth: () => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ user: session?.user ?? null, isLoading: false });
      if (session?.user) {
        get().refreshProfile();
      }
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null });
      if (session?.user) {
        get().refreshProfile();
      } else {
        set({ profile: null });
      }
    });
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      set({ profile: data as UserProfile });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
}));
