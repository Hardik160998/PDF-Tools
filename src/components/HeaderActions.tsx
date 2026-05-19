"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import NavSearchBar from "@/components/NavSearchBar";
import ThemeToggle from "@/components/ThemeToggle";
import { User, LogOut, ChevronDown, Crown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HeaderActions() {
  const { user, profile, loading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    router.push("/");
  };

  const getAvatarInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "U";
  };

  return (
    <div className="flex items-center gap-4 relative">
      <NavSearchBar />
      <ThemeToggle />

      {/* Dynamic Authentication Panel */}
      <div className="flex items-center gap-3">
        {loading ? (
          // Spinner / Skeleton loading state
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-700" />
        ) : user ? (
          // Logged-in profile avatar and dropdown
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Plan Badge */}
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border shrink-0 ${
              (profile?.current_plan || profile?.plan || "").toLowerCase().includes("pro") || (profile?.current_plan || profile?.plan || "").toLowerCase().includes("premium")
                ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-orange-600 dark:text-amber-400 border-amber-500/20" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
            }`}>
              {((profile?.current_plan || profile?.plan || "").toLowerCase().includes("pro") || (profile?.current_plan || profile?.plan || "").toLowerCase().includes("premium")) ? "Pro" : "Basic"}
            </span>

            {/* Glowing Upgrade button for Basic users */}
            {!((profile?.current_plan || profile?.plan || "").toLowerCase().includes("pro") || (profile?.current_plan || profile?.plan || "").toLowerCase().includes("premium")) && (
              <Link
                href="/premium-plans"
                className="hidden sm:inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md shadow-orange-500/25 transition-all hover:scale-[1.03]"
              >
                <Crown size={10} className="fill-white" /> Upgrade
              </Link>
            )}

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 focus:outline-none cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1.5px] shadow-md group-hover:scale-105 transition-all">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-[11px] font-black text-slate-800 dark:text-slate-100">
                    {getAvatarInitials()}
                  </div>
                </div>
                <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-2xl py-2 z-[9999] animate-fade-in">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/50">
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {profile?.full_name || "SmartPDFs User"}
                    </span>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {profile?.email}
                    </span>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <User size={13} className="text-indigo-500" /> My Profile
                  </Link>

                  <Link
                    href="/premium-plans"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <Crown size={13} className="text-amber-500 fill-amber-500/20" /> Premium Plans
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors border-t border-slate-100 dark:border-slate-800/50 text-left"
                  >
                    <LogOut size={13} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Logged-out buttons styled exactly like user request screenshot
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-[13px] font-extrabold text-slate-700 dark:text-slate-300 hover:text-red-500 px-1 py-2 transition-all"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-[#ef4444] hover:bg-[#dc2626] text-white text-[11px] font-black uppercase tracking-wider px-5 py-2.5 rounded-full shadow-lg shadow-red-500/25 transition-all duration-200 hover:scale-[1.03]"
            >
              SIGN UP
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
