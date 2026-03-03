"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartIcon } from "@/components/CartIcon";
import { useAuth } from "@/context/AuthContext";

export function Header() {
    const [darkMode, setDarkMode] = useState(true);
    const { user, signOut, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (document.documentElement.classList.contains("dark")) {
            setDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    return (
        <header className="sticky top-0 z-50 glass-panel shadow-sm transition-all duration-300">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="size-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                            <path d="M2 7h20" />
                            <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
                        </svg>
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">MarketLab</h2>
                </Link>

                {/* Right Section */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Search */}
                    <div className="relative hidden md:block group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            className="h-10 pl-10 pr-4 rounded-full bg-slate-100/50 dark:bg-white/5 border border-transparent dark:border-white/10 focus:border-blue-500/30 focus:bg-white dark:focus:bg-slate-900/80 focus:ring-4 focus:ring-blue-500/10 w-64 outline-none transition-all duration-300 text-sm font-medium text-slate-900 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-500"
                            placeholder="Search products..."
                            type="text"
                        />
                    </div>

                    {/* Cart Icon */}
                    <CartIcon />

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        aria-label="Toggle theme"
                        className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                        {darkMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v2" /><path d="M12 20v2" />
                                <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
                                <path d="M2 12h2" /><path d="M20 12h2" />
                                <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                            </svg>
                        )}
                    </button>

                    {/* Auth Section */}
                    {loading ? (
                        // Loading skeleton
                        <div className="h-10 w-20 rounded-full bg-slate-200 dark:bg-white/10 animate-pulse" />
                    ) : user ? (
                        // Logged in state
                        <div className="flex items-center gap-2">
                            <Link
                                href="/orders"
                                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 11l3 3L22 4" />
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                </svg>
                                My Orders
                            </Link>
                            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/10">
                                <div className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center justify-center rounded-full h-10 px-4 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-300 text-sm font-semibold border border-transparent hover:border-red-200 dark:hover:border-red-800"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Logged out state
                        <Link
                            href="/login"
                            className="flex items-center justify-center rounded-full h-10 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-indigo-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/10 text-sm font-bold"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
