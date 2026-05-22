"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export interface UserProfile {
  email: string;
  full_name?: string;
  created_at?: string;
  last_login?: string;
  plan?: string;
  current_plan?: string;
  subscription_status?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  razorpay_customer_id?: string;
  remaining_credits?: number;
  used_credits?: number;
  /** Whether guest credits were already merged into this account */
  credits_merged?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  loginAsMock: (email: string, name: string, customProfile?: UserProfile) => Promise<void>;
  decrementCredits: () => Promise<number | null>;
  /** Merges guest credits into user account — call after successful login/signup */
  mergeCreditsOnLogin: (guestToken?: string) => Promise<number | null>;
  /** Directly update the profile's plan fields after a successful purchase */
  updateProfilePlan: (planName: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => { },
  refreshProfile: async () => { },
  loginAsMock: async () => { },
  decrementCredits: async () => null,
  mergeCreditsOnLogin: async () => null,
  updateProfilePlan: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  // Tracks timestamp of last fetchProfile call to debounce onAuthStateChange duplicate calls
  const lastFetchRef = useRef<number>(0);

  const fetchProfile = async (email: string) => {
    lastFetchRef.current = Date.now();
    try {
      const { data, error } = await supabase
        .from("users")
        .select(`
          id, email, full_name, created_at, last_login, plan, current_plan, 
          subscription_status, subscription_start_date, subscription_end_date, 
          razorpay_customer_id, daily_usage_count, last_usage_reset, 
          ecommerce_credits, tool_credits, credits_merged, is_guest, 
          guest_session_id, account_type, remaining_credits, used_credits, 
          is_confirmation
        `)
        .eq("email", email)
        .maybeSingle();

      if (error) {
        console.warn("Error fetching user profile:", error);
      }

      if (data) {
        const updatedProfile = {
          ...data,
          plan: data.plan || "Basic Plan",
          current_plan: data.current_plan || "Basic Plan"
        };
        setProfile(updatedProfile);

        // Auto-confirm in public.users if the email is successfully verified/logged in
        if (data.is_confirmation === false) {
          try {
            await supabase
              .from("users")
              .update({ is_confirmation: true })
              .eq("email", email);
          } catch (updateErr) {
            console.warn("Failed to auto-confirm user profile in DB:", updateErr);
          }
        }

        // Sync with local storage mock session if it exists
        if (typeof window !== "undefined") {
          const mockSessionStr = localStorage.getItem("sb-mock-session");
          if (mockSessionStr) {
            try {
              const parsed = JSON.parse(mockSessionStr);
              parsed.profile = updatedProfile;
              localStorage.setItem("sb-mock-session", JSON.stringify(parsed));
            } catch (e) {
              console.warn("Error parsing sb-mock-session:", e);
            }
          }
        }
      } else {
        // Fallback profile object instead of aggressive logout (e.g. during recovery flows or new signup checks)
        console.warn("User profile not found in public users table. Using fallback profile.");
        setProfile({ email, plan: "Basic Plan", current_plan: "Basic Plan" });
      }
    } catch (e) {
      console.error("fetchProfile exception:", e);
      setProfile({ email, plan: "Basic Plan", current_plan: "Basic Plan" });
    }
  };

  const refreshProfile = async () => {
    if (user?.email) {
      await fetchProfile(user.email);
    }
  };

  const loginAsMock = async (email: string, name: string, customProfile?: UserProfile) => {
    const mockUser = {
      id: "mock-user-id",
      email: email,
      user_metadata: { full_name: name },
    } as any;
    setUser(mockUser);
    setProfile(customProfile || {
      email,
      full_name: name,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      plan: "Basic Plan",
      current_plan: "Basic Plan"
    });
    localStorage.setItem("sb-mock-session", JSON.stringify({ email, name, profile: customProfile }));

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
    // Intercept auth redirection errors from Supabase in the URL hash/query
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      const search = window.location.search;
      const hasHashError = hash && (hash.includes("error=") || hash.includes("error_code="));
      const hasSearchError = search && (search.includes("error=") || search.includes("error_code="));
      
      if (hasHashError || hasSearchError) {
        const path = window.location.pathname;
        // If they landed on root, login, or signup with an auth error, redirect to /reset-password to show the error nicely
        if (path === "/" || path === "/login" || path === "/signup") {
          window.location.href = `/reset-password${search}${hash}`;
          return;
        }
      }
    }

    let authSubscription: any = null;

    const setupAuth = async () => {
      try {
        // Load cached session/user first
        if (typeof window !== "undefined") {
          const cachedUser = localStorage.getItem("sb-user");
          const cachedProfile = localStorage.getItem("sb-user-profile");
          if (cachedUser && cachedProfile) {
            try {
              setUser(JSON.parse(cachedUser));
              setProfile(JSON.parse(cachedProfile));
            } catch (e) {}
          }
        }

        // 1. Get initial real session first
        const authClient = supabase.auth;
        let hasRealSession = false;
        if (authClient && typeof authClient.getSession === "function") {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.email || "");
            hasRealSession = true;
            // Clear mock session since we have a real session
            localStorage.removeItem("sb-mock-session");
          }
        }

        // 2. If no real session, fallback to mock session
        if (!hasRealSession) {
          const mockSessionStr = localStorage.getItem("sb-mock-session");
          if (mockSessionStr) {
            const { email, name, profile: storedProfile } = JSON.parse(mockSessionStr);
            setUser({ id: "mock-user-id", email, user_metadata: { full_name: name } } as any);
            setProfile(storedProfile || {
              email,
              full_name: name,
              created_at: new Date().toISOString(),
              last_login: new Date().toISOString(),
              plan: "Basic Plan",
              current_plan: "Basic Plan"
            });
            // Fetch live profile from DB for custom session user
            await fetchProfile(email);
            setLoading(false);
            return;
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
                // Skip fetchProfile if it was called within the last 2s (prevents double DB call after login)
                const msSinceLastFetch = Date.now() - lastFetchRef.current;
                if (msSinceLastFetch > 2000) {
                  await fetchProfile(session.user.email || "");
                }
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

  const decrementCredits = async (): Promise<number | null> => {
    if (!user?.email) return null;
    try {
      const isMock = typeof window !== "undefined" && localStorage.getItem("sb-mock-session");
      let token = "";
      if (isMock) {
        token = user.email;
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token || "";
      }
      
      if (!token) return null;

      const res = await fetch("/api/usage/decrement-credits", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.remaining_credits !== undefined) {
          setProfile(prev => prev ? { ...prev, remaining_credits: data.remaining_credits } : null);
          return data.remaining_credits;
        }
      }
    } catch (err) {
      console.error("Failed to decrement credits:", err);
    }
    return null;
  };

  const mergeCreditsOnLogin = async (guestToken?: string): Promise<number | null> => {
    console.log("[mergeCreditsOnLogin] Starting merge process with guestToken:", guestToken);
    try {
      const isMockStr = typeof window !== "undefined" ? localStorage.getItem("sb-mock-session") : null;
      let token = "";
      if (isMockStr) {
        try {
          const parsed = JSON.parse(isMockStr);
          token = parsed.email;
        } catch {}
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token || "";
      }
      
      if (!token) {
        console.log("[mergeCreditsOnLogin] No auth token found. Aborting merge.");
        return null;
      }
      console.log("[mergeCreditsOnLogin] Auth token found. Proceeding with merge.");

      // Read guest token from localStorage if not provided
      const storedGuest = typeof window !== "undefined" ? localStorage.getItem("pdf_guest_session") : null;
      let resolvedGuestToken = guestToken;
      if (!resolvedGuestToken && storedGuest) {
        try {
          resolvedGuestToken = JSON.parse(storedGuest)?.sessionToken;
        } catch {}
      }

      const res = await fetch("/api/credits/merge", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guestToken: resolvedGuestToken }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("[mergeCreditsOnLogin] API Success. Returned data:", data);
        // Clear guest session from localStorage after successful merge
        if (typeof window !== "undefined") {
          localStorage.removeItem("pdf_guest_session");
        }
        // Update profile with new credits
        if (data.newCredits !== undefined) {
          setProfile(prev => prev ? { ...prev, remaining_credits: data.newCredits, credits_merged: true } : null);
          return data.newCredits;
        }
      } else {
        console.error("[mergeCreditsOnLogin] API returned error status:", res.status);
      }
    } catch (err) {
      console.error("[mergeCreditsOnLogin] error:", err);
    }
    return null;
  };

  const updateProfilePlan = (planName: string) => {
    const startDate = new Date();
    const endDate = new Date();
    if (planName.toLowerCase().includes("yearly")) {
      endDate.setFullYear(startDate.getFullYear() + 1);
    } else {
      endDate.setMonth(startDate.getMonth() + 1);
    }

    setProfile(prev => prev ? {
      ...prev,
      plan: planName,
      current_plan: planName,
      subscription_status: "active",
      subscription_start_date: startDate.toISOString(),
      subscription_end_date: endDate.toISOString(),
    } : null);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (profile) {
        localStorage.setItem("sb-user-profile", JSON.stringify(profile));
      } else {
        localStorage.removeItem("sb-user-profile");
      }
      if (user) {
        localStorage.setItem("sb-user", JSON.stringify(user));
      } else {
        localStorage.removeItem("sb-user");
      }
    }
  }, [profile, user]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, refreshProfile, loginAsMock, decrementCredits, mergeCreditsOnLogin, updateProfilePlan }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
