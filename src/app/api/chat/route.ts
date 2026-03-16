import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export async function POST(req: NextRequest) {
    try {
        const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
        if (!geminiApiKey) {
            return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
        }
        
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const { message, token, userId } = await req.json();

        if (!message || !token || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Initialize Supabase client with the user's JWT
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        });

        // Add a prompt context to help it answer as a product assistant
        const prompt = `You are a helpful customer support AI for an e-commerce platform called MarketLab. 
        You answer questions about products, availability, and features. Keep answers concise.
        User question: ${message}`;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        // Save AI response to Supabase, pretending to be the authenticated user inserting
        // their own conversation's bot message.
        const { error: insertError } = await supabase.from("messages").insert([
            {
                user_id: userId,
                content: aiResponse,
                sender_type: "ai",
            },
        ]);

        if (insertError) {
            console.error("Supabase insert error:", insertError);
            return NextResponse.json({ error: "Failed to save AI message" }, { status: 500 });
        }

        return NextResponse.json({ success: true, aiResponse });
    } catch (error: any) {
        console.error("API error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
