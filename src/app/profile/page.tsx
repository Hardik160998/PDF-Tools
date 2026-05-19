"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  User, Mail, Calendar, Settings, History, 
  Edit3, Save, Lock, Shield, ChevronRight, Zap
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface ClickHistoryItem {
  toolKey: string;
  title: string;
  url: string;
  timestamp: string;
}

export default function ProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  
  const [fullName, setFullName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [recentTools, setRecentTools] = useState<ClickHistoryItem[]>([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, loading, router]);

  // Set local state when profile loads
  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  // Load local tool usage history
  useEffect(() => {
    try {
      const historyStr = localStorage.getItem("pdf_tool_clicks");
      if (historyStr) {
        const parsed = JSON.parse(historyStr);
        if (Array.isArray(parsed)) {
          setRecentTools(parsed.slice(0, 5));
        }
      }
    } catch (e) {
      console.warn("Failed to load local click history:", e);
    }
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    setErrorMsg("");
    setSuccessMsg("");
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("users")
        .upsert(
          {
            email: user.email,
            full_name: fullName,
            last_login: new Date().toISOString(),
          },
          { onConflict: "email" }
        );

      if (error) {
        throw error;
      }

      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
      await refreshProfile();
    } catch (err: any) {
      console.error("Update profile error:", err);
      setErrorMsg(err.message || "Failed to update profile settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading user profile...</p>
        </div>
      </div>
    );
  }

  const getAvatarInitials = () => {
    if (fullName) {
      return fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    return user.email?.substring(0, 2).toUpperCase() || "U";
  };

  const getJoinedDate = () => {
    if (profile?.created_at) {
      return new Date(profile.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Mesh Gradients */}
      <div className="absolute top-0 left-0 right-0 h-[450px] bg-gradient-to-b from-indigo-500/5 via-purple-500/5 to-transparent dark:from-indigo-500/10 dark:via-purple-500/5 -z-10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Account Banner Card */}
        <div className="relative overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50 dark:shadow-none flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[3px] shadow-lg flex-shrink-0">
            <div className="w-full h-full rounded-[21px] bg-white dark:bg-slate-950 flex items-center justify-center text-3xl font-black text-slate-800 dark:text-slate-100">
              {getAvatarInitials()}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 dark:text-white">
                {profile?.full_name || "SmartPDFs User"}
              </h1>
              <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-400">
                Premium Account Member
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-slate-400" /> {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-400" /> Member since {getJoinedDate()}
              </span>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center w-full md:w-36 flex-shrink-0">
            <span className="text-[10px] font-black tracking-wider uppercase text-indigo-600 dark:text-indigo-400">CURRENT PLAN</span>
            <span className="text-xl font-black text-indigo-900 dark:text-white mt-1">FREE</span>
            <span className="text-[9px] font-bold text-indigo-500 dark:text-indigo-500 mt-0.5">Upgrade for Pro tools</span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Settings Section (Left 2 cols) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50 dark:shadow-none space-y-6">
              
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                  <Settings size={18} className="text-indigo-500" /> Profile Settings
                </h2>
                
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 py-1.5 px-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                )}
              </div>

              {successMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold p-3.5 rounded-xl">
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold p-3.5 rounded-xl">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-all disabled:opacity-60"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email || ""}
                    className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-900 rounded-xl py-3 px-4 text-xs font-semibold text-slate-400 dark:text-slate-600 cursor-not-allowed outline-none"
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFullName(profile?.full_name || "");
                      }}
                      className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-1.5 py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 cursor-pointer transition-all disabled:opacity-50"
                    >
                      <Save size={13} /> {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </form>

              {/* Account Security Info card */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/50 rounded-2xl">
                  <Lock size={16} className="text-indigo-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Secure Database</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
                      Your files and actions are logged using local sandboxing. No documents are stored on our servers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/50 rounded-2xl">
                  <Shield size={16} className="text-emerald-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Auth Guarantee</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
                      Secured via industry-standard Supabase identity management. Your credentials are fully encrypted.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Recent History Sidebar (Right col) */}
          <div className="space-y-6">
            <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl shadow-slate-100/50 dark:shadow-none space-y-5">
              
              <h2 className="text-base font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                <History size={16} className="text-indigo-500" /> Recent Tools
              </h2>

              <div className="space-y-3">
                {recentTools.length > 0 ? (
                  recentTools.map((item, idx) => (
                    <Link
                      key={`${item.toolKey}-${idx}`}
                      href={item.url}
                      className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl group transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all">
                          <Zap size={14} className="fill-indigo-500/10" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-slate-700 dark:text-slate-200 truncate leading-snug">
                            {item.title}
                          </p>
                          <p className="text-[8px] text-slate-400 dark:text-slate-500 mt-0.5">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 dark:group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                    <p className="text-xs font-extrabold text-slate-400 dark:text-slate-500">No recent activity</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-600 leading-normal">
                      Used tools will appear here for fast access.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
