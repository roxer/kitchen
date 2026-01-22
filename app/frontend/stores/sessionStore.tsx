import { create } from "zustand";
import axios from "axios";
import type { User } from "../domain/users/User";

interface SessionState {
  currentUser: User | null;
  isAuthenticating: boolean;
  attemptedCurrentUserFetch: boolean;
  isAuthenticated: boolean;
  hasAttemptedAuthentication: boolean;
  fetchCurrentUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  currentUser: null,
  isAuthenticating: false,
  attemptedCurrentUserFetch: false,

  // Computed values as getters
  get isAuthenticated() {
    return get().currentUser !== null;
  },

  get hasAttemptedAuthentication() {
    return get().attemptedCurrentUserFetch;
  },

  fetchCurrentUser: async () => {
    set({ isAuthenticating: true });
    try {
      const response = await axios.get<{ user: User }>(
        "/api/session/current_user"
      );

      if (response.status === 200 && response.data.user) {
        set({ currentUser: response.data.user });
      }
    } catch (error) {
      // If not authenticated, clear the user
      set({ currentUser: null });
    } finally {
      set({ isAuthenticating: false, attemptedCurrentUserFetch: true });
    }
  },

  setUser: (user: User | null) => {
    console.log("setUser", user);
    set({ currentUser: user });
  },

  clearSession: () => {
    set({
      currentUser: null,
      isAuthenticating: false,
    });
  },
}));
