"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export interface UserProfile {
  email: string;
  full_name?: string;
  created_at?: string;
  last_login?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  loginAsMock: (email: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {},
  refreshProfile: async () => {},
  loginAsMock: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("email, full_name, created_at, last_login")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        console.warn("Error fetching user profile:", error);
      }
      
      if (data) {
        setProfile(data);
      } else {
        // Fallback profile object if user record doesn't exist yet in the public table
        setProfile({ email });
      }
    } catch (e) {
      console.error("fetchProfile exception:", e);
      setProfile({ email });
    }
  };

  const refreshProfile = async () => {
    if (user?.email) {
      await fetchProfile(user.email);
    }
  };

  const loginAsMock = async (email: string, name: string) => {
    const mockUser = {
      id: "mock-user-id",
      email: email,
      user_metadata: { full_name: name },
    } as any;
    setUser(mockUser);
    setProfile({
      email,
      full_name: name,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    });
    localStorage.setItem("sb-mock-session", JSON.stringify({ email, name }));

    try {
      await supabase
        .from('users')
        .upsert(
          { 
            email, 
            full_name: name,
            last_login: new Date().toISOString() 
          }, 
          { onConflict: 'email' }
        );
    } catch (e) {
      console.warn("Could not save mock user to database users table:", e);
    }
  };

  useEffect(() => {
    let authSubscription: any = null;

    const setupAuth = async () => {
      try {
        // Check for mock session first
        const mockSessionStr = localStorage.getItem("sb-mock-session");
        if (mockSessionStr) {
          const { email, name } = JSON.parse(mockSessionStr);
          setUser({ id: "mock-user-id", email, user_metadata: { full_name: name } } as any);
          setProfile({
            email,
            full_name: name,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          });
          setLoading(false);
          return;
        }

        // Get initial session
        const authClient = supabase.auth;
        if (authClient && typeof authClient.getSession === "function") {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.email || "");
          }
        }
      } catch (err) {
        console.warn("Failed to get initial session:", err);
      } finally {
        setLoading(false);
      }

      // Set up authentication listener
      try {
        const authClient = supabase.auth;
        if (authClient && typeof authClient.onAuthStateChange === "function") {
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (session?.user) {
                // Clear mock if we successfully get a real session
                localStorage.removeItem("sb-mock-session");
                setUser(session.user);
                await fetchProfile(session.user.email || "");
              } else {
                // If logged out from Supabase, make sure mock session is not running
                if (!localStorage.getItem("sb-mock-session")) {
                  setUser(null);
                  setProfile(null);
                }
              }
              setLoading(false);
            }
          );
          authSubscription = subscription;
        }
      } catch (err) {
        console.warn("Failed to setup onAuthStateChange listener:", err);
      }
    };

    setupAuth();

    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      localStorage.removeItem("sb-mock-session");
      const authClient = supabase.auth;
      if (authClient && typeof authClient.signOut === "function") {
        await supabase.auth.signOut();
      }
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, refreshProfile, loginAsMock }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
