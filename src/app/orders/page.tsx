"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OrderCard } from "@/components/OrderCard";
import Link from "next/link";

interface Order {
    id: string;
    total_price: number;
    items: Array<{ name: string; quantity: number; price: number }>;
    status: string;
    created_at: string;
}

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const justOrdered = searchParams.get("success") === "true";

    const [orders, setOrders] = useState<Order[]>([]);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Protected route: redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login?redirect=/orders");
        }
    }, [authLoading, user, router]);

    // Fetch orders for current user
    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            setFetching(true);
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                setError(error.message);
            } else {
                setOrders(data ?? []);
            }
            setFetching(false);
        };

        fetchOrders();
    }, [user]);

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-indigo-50 dark:bg-[#020617]">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <svg className="animate-spin h-10 w-10 text-blue-500" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <p className="text-slate-500 dark:text-slate-400">Checking authentication...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Not logged in (will redirect, show nothing)
    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-indigo-50 dark:bg-[#020617] transition-colors duration-500">
            <Header />

            <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                        My Orders
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {user.email} &mdash; Your order history
                    </p>
                </div>

                {/* Success Banner */}
                {justOrdered && (
                    <div className="mb-6 px-5 py-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                        <div className="size-8 flex items-center justify-center rounded-full bg-green-500/20 text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-green-700 dark:text-green-400">Order placed successfully! 🎉</p>
                            <p className="text-sm text-green-600 dark:text-green-500">Your order has been saved and is being processed.</p>
                        </div>
                    </div>
                )}

                {/* Loading orders */}
                {fetching ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-48 rounded-2xl bg-slate-200/50 dark:bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    // Error state
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                                <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Failed to load orders</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    // Empty state
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                                <path d="M9 11l3 3L22 4" />
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No orders yet</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
                            You haven&apos;t placed any orders yet. Browse our collection and find something you love!
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    // Orders list
                    <div className="grid gap-4 md:grid-cols-2">
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
