import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiMessageCircle, FiX, FiSend, FiPaperclip, FiMinimize2 } from "react-icons/fi";
import { BiThumbsUp, BiThumbsDown } from "react-icons/bi";
import iconlogo from "../../assets/images/gav-dark.png";
import MessageBubble from "./MessageBubble";
import TypingBubble from "./TypingBubble";
import { FAQChatbotService } from "../../features/faq/chatbotService.js";
import { 
  selectMessages, 
  selectIsTyping, 
  getFAQCategories,
  voteFAQ,
  clearConversation,
  addMessage
} from "../../features/faq/slice.js";


const COLORS = {
  surface: "bg-white",
  surfaceMuted: "bg-neutral-50",
  surfaceDark: "bg-neutral-900",
  text: "text-neutral-900",
  textMuted: "text-neutral-500",
  brand: "bg-[#0e1a2b]",        // deep ink
  brandText: "text-white",
  accent: "text-amber-500",     // subtle gold
  ring: "ring-black/10",
};

const time = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const SAMPLE_BOT_REPLY = (userText) =>
  `You said: “${userText}”. How can I help further?`;

export default function ChatbotWidget({
  title = "Garava Assistant",
  subtitle = "Online",
  suggestions = ["Track my order", "Find a ring", "Book an appointment", "Shipping time?"],
  placeholder = "Type your message…",
  onSend = async (text) => {
    // Mock a bot response (replace with your API)
    await new Promise((r) => setTimeout(r, 600));
    return SAMPLE_BOT_REPLY(text);
  },
}) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: "b1", role: "bot", text: "Hi! I’m your Garava assistant. Ask me anything ✨", t: time() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  // Auto-scroll
  const listRef = useRef(null);
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typing, open]);

  const isMobile = useIsMobile();

  // Handlers
  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = { id: `u-${Date.now()}`, role: "user", text: trimmed, t: time() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const reply = await onSend(trimmed);
      const botMsg = { id: `b-${Date.now()}`, role: "bot", text: reply, t: time() };
      setMessages((m) => [...m, botMsg]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: `e-${Date.now()}`, role: "bot", text: "Sorry—something went wrong.", t: time() },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      
      {(!open || minimized) && (
        <button
          onClick={() => { setOpen(true); setMinimized(false); }}
          aria-label="Open chat"
          className={`group fixed bottom-5  right-5 z-50 inline-flex cursor-pointer  items-center gap-2 rounded-full px-4 py-3 bg-red-500 hover:brightness-110 transition`}
        >
          {/* <FiMessageCircle className="text-lg" /> */}
          <div className="hidden sm:inline text-sm font-medium  ">
            <img className="h-10 cursor-pointer" src={iconlogo} alt="" />
            
          </div>
        </button>
      )}


      {open && (
        <div
          className={`fixed z-50 ${isMobile ? "inset-0" : "bottom-6 right-6"} `}
          role="dialog"
          aria-label="Chat window"
        >
          <div
            className={`${isMobile ? "h-full w-full rounded-none" : "w-[380px] h-[560px] rounded-2xl"} ${COLORS.surface} shadow-2xl ring-1 ${COLORS.ring} flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className={`relative ${COLORS.brand} px-4 py-3`}>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center ring-1 ring-white/20">
                  <span className="text-white/90 text-sm font-semibold">GA</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm font-semibold tracking-wide">
                    {title}
                  </h3>
                  <p className="text-white/70 text-sm">{subtitle}</p>
                </div>

                <div className="flex items-center gap-1">
                  {/* <button
                    onClick={() => setMinimized(!minimized)}
                    aria-label={minimized ? "Restore" : "Minimize"}
                    className="p-2 rounded-md hover:bg-white/10 text-white transition"
                  >
                    <FiMinimize2 />
                  </button> */}
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="p-2 rounded-md hover:bg-white/10 text-white transition"
                  >
                    <FiX />
                  </button>
                </div>
              </div>

              {/* Subtle bottom border glow */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className={`flex-1 overflow-auto px-3 sm:px-4 py-4 ${COLORS.surfaceMuted} scroll-smooth custom-scrollbar`}
            >
              {/* Suggestions (show when only greeting) */}
              {messages.length <= 1 && suggestions?.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s)}
                      className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 active:scale-[0.98] transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Bubble list */}
              <ul className="space-y-3">
                {messages.map((m) => (
                  <li key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <MessageBubble role={m.role} time={m.t}>
                      {m.text}
                    </MessageBubble>
                  </li>
                ))}

                {typing && (
                  <li className="flex justify-start">
                    <TypingBubble />
                  </li>
                )}
              </ul>
            </div>

            {/* Input */}
            <div className="border-t border-neutral-200 bg-white p-3">
              <div className="flex items-end gap-2">
                <label className="sr-only" htmlFor="chat-input">
                  Message
                </label>
                <div className="relative flex-1">
                  <textarea
                    id="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    rows={1}
                    placeholder={placeholder}
                    className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-300 leading-6 max-h-28"
                  />
                  <div className="pointer-events-none absolute right-3 bottom-2 text-[10px] text-neutral-400">
                    Enter ↵
                  </div>
                </div>

                {/* <button
                  type="button"
                  aria-label="Attach"
                  className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 hover:bg-neutral-50 transition"
                >
                  <FiPaperclip />
                </button> */}

                <button
                  onClick={() => sendMessage(input)}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-amber-500 px-4 text-white text-sm font-medium shadow hover:brightness-105 active:scale-[0.98] transition"
                >
                  <FiSend className="mr-1" />
                  Send
                </button>
              </div>

              {/* Policy note */}
              <p className="mt-2 text-[11px] text-neutral-400 text-center">
                We respect your privacy. This chat may be recorded for quality.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return m;
}
