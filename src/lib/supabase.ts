import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use sessionStorage to avoid QuotaExceededError from localStorage being full
// (localStorage is shared with cart data which stores large Google image URLs)
const customStorage = {
    getItem: (key: string): string | null => {
        if (typeof window === "undefined") return null;
        return window.sessionStorage.getItem(key);
    },
    setItem: (key: string, value: string): void => {
        if (typeof window === "undefined") return;
        window.sessionStorage.setItem(key, value);
    },
    removeItem: (key: string): void => {
        if (typeof window === "undefined") return;
        window.sessionStorage.removeItem(key);
    },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: customStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});
