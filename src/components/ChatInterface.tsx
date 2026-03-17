"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessage {
    id: string;
    content: string;
    sender_type: "user" | "ai";
    created_at: string;
}

export default function ChatInterface() {
    const { user, session } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch previous messages & setup realtime auth
    useEffect(() => {
        if (!user || !isOpen) return;

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: true });

            if (!error && data) {
                setMessages(data as ChatMessage[]);
            }
        };

        fetchMessages();

        const channel = supabase
            .channel(`public:messages:user_id=${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    setMessages((prev) => {
                        const newMsg = payload.new as ChatMessage;
                        if (!prev.find((m) => m.id === newMsg.id)) {
                            return [...prev, newMsg];
                        }
                        return prev;
                    });
                     // If bot sends message, stop typing
                     if ((payload.new as ChatMessage).sender_type === "ai") {
                         setIsTyping(false);
                     }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, isOpen]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !user || !session) return;

        const optimisticMessage: ChatMessage = {
            id: `temp-${Date.now()}`,
            content: inputValue,
            sender_type: "user",
            created_at: new Date().toISOString(),
        };

        const currentMessage = inputValue;
        setInputValue("");
        
        // Optimistic UI update for perceived performance
        setMessages((prev) => [...prev, optimisticMessage]);
        setIsTyping(true);

        try {
            // Insert user message to Supabase Database
            const { error: insertError } = await supabase.from("messages").insert([
                {
                    user_id: user.id,
                    content: currentMessage,
                    sender_type: "user",
                },
            ]);

            if (insertError) {
                console.error("Failed to insert user message:", insertError);
                setIsTyping(false);
                return;
            }

            // Call API which talks to Gemini and inserts Bot message
            const apiRes = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: currentMessage,
                    token: session.access_token,
                    userId: user.id,
                }),
            });

            if (!apiRes.ok) {
                throw new Error("Chat api request failed");
            }
            // Supabase Realtime will pick up the AI bot's reply when the API saves it.
        } catch (error) {
            console.error(error);
            setIsTyping(false);
        }
    };

    if (!user || isDismissed) return null; // Only authenticated users see the chat widget, and not if dismissed

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen ? (
                <div className="bg-background border rounded-lg shadow-xl w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col mb-4 overflow-hidden transition-all animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-muted/50">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10 text-primary"><Bot size={18} /></AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold text-sm">MarketLab Support</h3>
                                <p className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                                    {isTyping ? "AI is typing..." : "Online"}
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Chat Body */}
                    <div className="flex-1 overflow-y-auto p-4 min-h-0 flex flex-col custom-scrollbar">
                        <div className="flex flex-col gap-4">
                            {messages.length === 0 && !isTyping && (
                                <div className="text-center text-sm text-muted-foreground mt-10">
                                    No messages yet. Send a message to start!
                                </div>
                            )}

                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex gap-3 ${msg.sender_type === "user" ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <Avatar className="h-8 w-8 mt-auto shrink-0">
                                        {msg.sender_type === "ai" ? (
                                            <>
                                                <AvatarImage src="/bot-avatar.png" />
                                                <AvatarFallback className="bg-primary/10 text-primary"><Bot size={16} /></AvatarFallback>
                                            </>
                                        ) : (
                                            <>
                                                <AvatarFallback className="bg-secondary text-secondary-foreground"><UserIcon size={16} /></AvatarFallback>
                                            </>
                                        )}
                                    </Avatar>
                                    <div
                                        className={`rounded-2xl px-4 py-2 text-sm max-w-[80%] wrap-break-word ${
                                            msg.sender_type === "user"
                                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                                : "bg-muted text-foreground rounded-bl-sm"
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-3 flex-row">
                                    <Avatar className="h-8 w-8 mt-auto shrink-0">
                                        <AvatarFallback className="bg-primary/10 text-primary"><Bot size={16} /></AvatarFallback>
                                    </Avatar>
                                    <div className="bg-muted text-foreground rounded-2xl rounded-bl-sm px-4 py-3 text-sm flex gap-1 items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                        <div className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                        <div className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} className="h-1 w-full" />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t bg-background flex items-center gap-2">
                        <Input
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSendMessage();
                            }}
                            disabled={isTyping}
                            className="flex-1"
                        />
                        <Button 
                            size="icon" 
                            disabled={!inputValue.trim() || isTyping} 
                            onClick={handleSendMessage}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="relative group">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDismissed(true);
                        }}
                        variant="secondary"
                        size="icon"
                        className="absolute -top-2 -left-2 h-6 w-6 rounded-full shadow-md z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        onClick={() => setIsOpen(true)}
                        size="lg"
                        className="h-14 w-14 rounded-full shadow-lg relative overflow-hidden"
                    >
                        <MessageCircle className="h-6 w-6 relative z-10 transition-transform hover:scale-110" />
                        <span className="absolute inset-0 bg-primary-foreground/20 rounded-full scale-0 hover:scale-100 transition-transform duration-300"></span>
                    </Button>
                </div>
            )}
        </div>
    );
}
