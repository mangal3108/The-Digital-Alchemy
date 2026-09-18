"use client";

import * as React from "react";
import Image from "next/image";
import { X, CheckCircle2, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/chatbot/types";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    content: "Hi there! I am **AI**, your technical consultant at **The Digital Alchemy**.\n\nI can help you explore our AI automation services, review our production tech stack, or directly scope and submit a project inquiry to our senior engineers.\n\nWhat are you planning to build?",
    timestamp: Date.now(),
  },
];

const SUGGESTIONS = [
  "What services do you provide?",
  "How fast can you build an MVP?",
  "What is your tech stack?",
  "I want to start a project",
];

function renderFormattedMessage(content: string, isUser: boolean) {
  const lines = content.split("\n");
  return lines.map((line, lineIdx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={lineIdx} className="h-1.5" />;
    }

    const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ");
    const cleanLine = isBullet ? trimmed.replace(/^[-*•]\s+/, "") : line;

    // Split by markdown bold (**text**) and italic (*text*)
    const parts = cleanLine.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

    const parsedElements = parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong
            key={pIdx}
            className={cn(
              "font-bold",
              isUser ? "text-white" : "text-slate-950 dark:text-white",
            )}
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return <em key={pIdx}>{part.slice(1, -1)}</em>;
      }
      return part;
    });

    if (isBullet) {
      return (
        <div key={lineIdx} className="flex items-start gap-2 my-1 pl-1">
          <span
            className={cn(
              "mt-1.5 size-1.5 rounded-full shrink-0",
              isUser ? "bg-white" : "bg-blue-600 dark:bg-blue-400",
            )}
          />
          <span className="flex-1">{parsedElements}</span>
        </div>
      );
    }

    return (
      <p key={lineIdx} className="leading-relaxed my-0.5">
        {parsedElements}
      </p>
    );
  });
}

export function BhadawarAI() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when chat opens
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.message || "I apologize, but I couldn't process that response. Please try again or reach out directly to support@thedigitalalchemy.co.in.",
        action: data.action,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: "I ran into a temporary connection issue. You can reach out directly to our engineering team at **support@thedigitalalchemy.co.in** or try sending your message again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Launcher Button (visible when chat is closed) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 animate-in fade-in zoom-in-95 duration-200">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Assistant"
            className="group relative flex items-center gap-2.5 rounded-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 p-1.5 pr-4 shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 cursor-pointer"
          >
            {/* Animated Glow Ring */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-60 blur-xs transition duration-500 group-hover:opacity-100 animate-pulse" />

            <div className="relative flex items-center gap-2.5">
              <div className="relative flex size-7 items-center justify-center">
                <Image
                  src="/images/bhadawar-ai-avatar.png"
                  alt="AI"
                  width={28}
                  height={28}
                  className="size-7 rounded-full object-cover ring-2 ring-white/70 shadow-xs"
                  priority
                />
                <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 ring-2 ring-blue-600" />
              </div>
              <span className="inline font-display text-sm font-bold tracking-tight text-white">
                AI
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window Modal / Sheet */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="AI Chat Window"
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden bg-white shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-5",
            // Mobile: Fullscreen sheet anchored to bottom with clean top offset
            "inset-x-0 bottom-0 top-10 rounded-t-3xl border-t border-slate-200",
            // Desktop: Floating card at bottom right, strictly bounded by viewport height so it NEVER cuts off top header
            "sm:inset-auto sm:bottom-5 sm:right-5 sm:w-[410px] sm:h-[min(540px,calc(100dvh-2.5rem))] sm:max-h-[calc(100dvh-2.5rem)] sm:rounded-3xl sm:border sm:border-slate-200/90 sm:shadow-2xl sm:shadow-slate-950/20",
            "dark:bg-slate-950 dark:border-slate-800",
          )}
        >
          {/* Chat Window Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-4 py-3 backdrop-blur-md dark:bg-slate-900/90 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative flex size-10 items-center justify-center shrink-0">
                <Image
                  src="/images/bhadawar-ai-avatar.png"
                  alt="AI"
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover ring-2 ring-blue-500/40 shadow-xs"
                />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                    AI
                  </h3>
                </div>
                <p className="text-[0.6875rem] text-slate-500 dark:text-slate-400 font-medium">
                  Your Friendly Assistant · The Digital Alchemy
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex size-8 items-center justify-center rounded-full bg-slate-200/70 text-slate-600 hover:bg-slate-300 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
              aria-label="Close AI chat"
            >
              <X className="size-4.5" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 text-sm"
            style={{
              backgroundImage:
                "radial-gradient(#e2e8f0 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col gap-1 max-w-[85%]",
                  m.role === "user" ? "ml-auto items-end" : "mr-auto items-start",
                )}
              >
                {m.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Image
                      src="/images/bhadawar-ai-avatar.png"
                      alt="AI"
                      width={18}
                      height={18}
                      className="size-4.5 rounded-full object-cover ring-1 ring-blue-500/30"
                    />
                    <span className="text-[0.6875rem] font-bold text-slate-700 dark:text-slate-300">
                      AI
                    </span>
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-[0.875rem] leading-relaxed shadow-xs",
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-xs font-medium"
                      : "bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800",
                  )}
                >
                  <div className="space-y-0.5">
                    {renderFormattedMessage(m.content, m.role === "user")}
                  </div>
                </div>

                {/* Agentic Action Card: Verified Lead Submission */}
                {m.action?.type === "lead_submitted" && (
                  <div className="mt-2 w-full rounded-xl border border-emerald-300 bg-emerald-50/90 p-3 shadow-xs dark:bg-emerald-950/30 dark:border-emerald-800">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      <span>Project Inquiry Logged in Database</span>
                    </div>
                    <p className="mt-1 text-[0.75rem] text-emerald-700 dark:text-emerald-400">
                      Partner: <strong>{m.action.data.name}</strong> ({m.action.data.email})
                    </p>
                    <span className="mt-1.5 inline-block text-[0.6875rem] font-mono font-bold text-emerald-600 uppercase">
                      Status: Routed to Lead Engineers
                    </span>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="mr-auto flex items-center gap-2 rounded-2xl bg-white border border-slate-200/80 px-3.5 py-2.5 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                <Image
                  src="/images/bhadawar-ai-avatar.png"
                  alt="AI"
                  width={20}
                  height={20}
                  className="size-5 rounded-full object-cover ring-1 ring-blue-500/30"
                />
                <div className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-blue-500 animate-bounce" />
                  <span className="size-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="size-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="font-mono text-[0.6875rem] text-slate-400 ml-1 font-bold uppercase">
                  AI thinking...
                </span>
              </div>
            )}
          </div>

          {/* Quick Suggestions Strip (Zero Scrollbar) */}
          <div className="border-t border-slate-100 bg-slate-50/70 px-3 py-2 overflow-x-auto flex gap-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] dark:bg-slate-900/60 dark:border-slate-800">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(s)}
                className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.75rem] font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 hover:text-slate-900 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="border-t border-slate-200/90 bg-white p-3 dark:bg-slate-950 dark:border-slate-800">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/90 px-3 py-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:bg-slate-900 dark:border-slate-800">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI or scope an MVP..."
                className="flex-1 bg-transparent text-[0.875rem] text-slate-900 placeholder:text-slate-400 focus:outline-hidden dark:text-white"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-all hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600"
              >
                <CornerDownLeft className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[0.625rem] text-slate-400 font-medium">
              Grounded in The Digital Alchemy website · support@thedigitalalchemy.co.in
            </p>
          </div>
        </div>
      )}
    </>
  );
}
