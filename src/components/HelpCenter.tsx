import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Paperclip, ChevronDown, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const HelpCenter = ({ isMobileMockup = false, className = "" }: { isMobileMockup?: boolean; className?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setMessage("");
    };

    const containerClasses = `${isMobileMockup
            ? "absolute bottom-16 right-4 z-[50]"
            : "fixed bottom-6 right-6 z-[100]"
        } flex flex-col items-end transition-all duration-300 ${className}`;

    const windowClasses = isMobileMockup
        ? "mb-4 w-[280px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        : "mb-4 w-[360px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl";

    return (
        <div className={containerClasses}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={windowClasses}
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 text-primary-foreground">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                        <Headphones className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold">SchoolConnect Support</h3>
                                        <p className="text-[10px] text-blue-100 flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                                            We're online to help you
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-lg p-1 hover:bg-white/10 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div className="h-[380px] space-y-4 overflow-y-auto p-4 bg-secondary/20">
                            <div className="flex gap-2">
                                <Avatar className="h-8 w-8 shrink-0">
                                    <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">SC</AvatarFallback>
                                </Avatar>
                                <div className="rounded-2xl rounded-tl-none bg-card p-3 text-xs leading-relaxed shadow-sm ring-1 ring-border">
                                    Hello! How can we help you today? Feel free to ask any questions about the portal.
                                </div>
                            </div>

                            <div className="flex flex-row-reverse gap-2">
                                <div className="rounded-2xl rounded-tr-none bg-primary p-3 text-xs leading-relaxed text-primary-foreground shadow-sm">
                                    I need help with teacher enrollment.
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Avatar className="h-8 w-8 shrink-0">
                                    <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">SC</AvatarFallback>
                                </Avatar>
                                <div className="rounded-2xl rounded-tl-none bg-card p-3 text-xs leading-relaxed shadow-sm ring-1 ring-border">
                                    Sure! You can enroll teachers from the Dashboard's Quick Actions or directly from the Teachers tab. Would you like a step-by-step guide?
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="border-t border-border bg-card p-3">
                            <div className="relative flex items-center gap-2">
                                <button type="button" className="p-2 text-muted-foreground hover:text-primary transition-colors">
                                    <Paperclip className="h-4 w-4" />
                                </button>
                                <Input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="h-10 pr-10 text-xs focus-visible:ring-primary"
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim()}
                                    className="absolute right-2 p-1.5 text-primary disabled:opacity-50"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors ${isOpen ? "bg-card text-foreground border border-border" : "bg-neutral-800 text-white"
                    }`}
            >
                {isOpen ? <ChevronDown className="h-6 w-6" /> : <MessageCircle className="h-6 w-6 fill-current" />}
            </motion.button>
        </div>
    );
};

export default HelpCenter;
