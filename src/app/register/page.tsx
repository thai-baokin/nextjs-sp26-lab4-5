"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
    const router = useRouter();
    const { signUp } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};
        if (!email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email address";
        if (!password.trim()) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Must be at least 6 characters long";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        const { error } = await signUp(email, password);
        if (error) {
            setErrors({ general: error });
            setIsSubmitting(false);
            return;
        }
        // Show success and redirect to login
        setSuccessMsg("Account created! Please check your email to confirm, then log in.");
        setTimeout(() => router.push("/login"), 3000);
    };

    return (
        <div className="bg-[#020617] min-h-screen flex flex-col font-sans antialiased text-slate-50 relative overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-950">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/10 blur-[100px] opacity-40 animate-pulse"></div>
                <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[100px] opacity-40"></div>
                <div className="absolute bottom-0 left-[20%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[100px] opacity-30"></div>
            </div>

            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/5 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50 px-6 py-4 lg:px-10">
                <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                    <div className="size-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <path d="M2 7h20" />
                        </svg>
                    </div>
                    <h2 className="text-slate-50 text-lg font-bold tracking-tight group-hover:text-blue-500 transition-colors">MarketLab</h2>
                </Link>
                <Link href="/login" className="inline-flex h-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-white/10 hover:border-white/20">
                    Login
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative z-10">
                <div className="w-full max-w-[460px]">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden p-8 sm:p-10">

                            <div className="mb-8 text-center space-y-2">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Create an account</h1>
                                <p className="text-slate-400 text-sm">Register to start shopping and track your orders.</p>
                            </div>

                            {/* Success Message */}
                            {successMsg && (
                                <div className="mb-4 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
                                    {successMsg}
                                </div>
                            )}

                            {/* General Error */}
                            {errors.general && (
                                <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                                    {errors.general}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email */}
                                <div className="space-y-2 group">
                                    <label className="text-xs font-medium uppercase tracking-wider text-slate-400 group-focus-within:text-blue-500 transition-colors ml-1" htmlFor="email">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-slate-500 transition-colors group-focus-within:text-blue-500 pointer-events-none">
                                            <Mail className="w-5 h-5" />
                                        </span>
                                        <input
                                            className={`flex h-11 w-full rounded-lg bg-slate-950/50 border text-slate-100 placeholder:text-slate-500 px-3 py-2 text-sm pl-10 focus:border-blue-500/50 focus:bg-slate-900/80 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 ${errors.email ? "border-red-500/50 focus:ring-red-500/20" : "border-white/10"}`}
                                            id="email"
                                            placeholder="you@example.com"
                                            type="email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                                        />
                                    </div>
                                    {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div className="space-y-2 group">
                                    <label className="text-xs font-medium uppercase tracking-wider text-slate-400 group-focus-within:text-blue-500 transition-colors ml-1" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-slate-500 transition-colors group-focus-within:text-blue-500 pointer-events-none">
                                            <Lock className="w-5 h-5" />
                                        </span>
                                        <input
                                            className={`flex h-11 w-full rounded-lg bg-slate-950/50 border text-slate-100 placeholder:text-slate-500 px-3 py-2 text-sm pl-10 pr-10 focus:border-blue-500/50 focus:bg-slate-900/80 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 ${errors.password ? "border-red-500/50 focus:ring-red-500/20" : "border-white/10"}`}
                                            id="password"
                                            placeholder="Minimum 6 characters"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !!successMsg}
                                    className="group relative w-full inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-500 h-11 px-4 py-2 mt-4 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center">
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                Create Account
                                                <ArrowRight className="w-[18px] h-[18px] ml-2 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </span>
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                </button>
                            </form>

                            <div className="mt-8 text-center text-sm text-slate-400">
                                Already have an account?{" "}
                                <Link className="font-medium text-blue-500 hover:text-blue-400 hover:underline underline-offset-4 transition-colors" href="/login">
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
