import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiMessageCircle, FiX, FiSend, FiMinimize2, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import iconlogo from "../../assets/images/gav-dark.png";
import MessageBubble from "./MessageBubble";
import TypingBubble from "./TypingBubble";
import { FAQChatbotService } from "../../features/faq/chatbotService.js";
import { 
  selectMessages, 
  selectIsTyping 
} from "../../features/faq/selectors.js";
import { 
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

export default function EnhancedChatbotWidget({
  title = "Garava Assistant",
  subtitle = "AI-Powered FAQ Assistant",
  suggestions = [
    "How do I track my order?",
    "What materials do you use?", 
    "What's your return policy?",
    "How do I care for jewelry?",
    "Do you ship internationally?",
    "How to book an appointment?"
  ],
  placeholder = "Ask me anything about Garava…",
}) {
  const dispatch = useDispatch();
  
  // Redux state
  const messages = useSelector(selectMessages);
  const isTyping = useSelector(selectIsTyping);
  
  // Local UI state
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  
  // Initialize chatbot service
  const chatbotService = useMemo(() => {
    const getState = () => {
      // Get the current state from the store
      const store = window.store || { getState: () => ({ faq: {} }) };
      return store.getState();
    };
    return new FAQChatbotService(dispatch, getState);
  }, [dispatch]);
  
  // Load FAQ categories on mount
  useEffect(() => {
    dispatch(getFAQCategories());
  }, [dispatch]);
  
  // Initialize conversation with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      dispatch(addMessage({
        role: 'bot',
        text: "Hi! I'm your Garava assistant. I can help you with questions about our jewelry, fragrances, orders, shipping, and more. What would you like to know? ✨",
        timestamp: Date.now()
      }));
    }
  }, [dispatch, messages.length]);

  // Auto-scroll
  const listRef = useRef(null);
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isTyping, open]);

  const isMobile = useIsMobile();

  // Enhanced message sending with FAQ integration
  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setInput("");
    await chatbotService.processMessage(trimmed);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Handle FAQ feedback
  const handleFeedback = (messageId, faqId, isHelpful) => {
    if (faqId) {
      dispatch(voteFAQ({ faqId, isHelpful }));
    }
  };

  // Clear conversation
  const handleClearChat = () => {
    dispatch(clearConversation());
    // Re-add welcome message
    setTimeout(() => {
      dispatch(addMessage({
        role: 'bot',
        text: "Hi! I'm your Garava assistant. I can help you with questions about our jewelry, fragrances, orders, shipping, and more. What would you like to know? ✨",
        timestamp: Date.now()
      }));
    }, 100);
  };

  return (
    <>
      {/* Chat toggle button */}
      {(!open || minimized) && (
        <button
          onClick={() => { setOpen(true); setMinimized(false); }}
          aria-label="Open chat"
          className={`group fixed bottom-5 right-5 z-40 cursor-pointer inline-flex items-center gap-2 rounded-full px-3 py-2 bg-gray-200`}
        >
          <div className="flex items-center justify-center ">
            <img className="h-10" src={iconlogo} alt="Garava Assistant" />
          </div>
          
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div
          className={`fixed z-50 ${isMobile ? "inset-0" : "bottom-6 right-6"}`}
          role="dialog"
          aria-label="Chat window"
        >
          <div
            className={`${isMobile ? "h-full w-full rounded-none" : "w-[400px] h-[600px] rounded-2xl"} ${COLORS.surface} shadow-2xl ring-1 ${COLORS.ring} flex flex-col overflow-hidden`}
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
                  <button
                    onClick={handleClearChat}
                    aria-label="Clear conversation"
                    className="p-2 rounded-md hover:bg-white/10 text-white transition text-sm"
                    title="Clear chat"
                  >
                    🗑️
                  </button>
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
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Try asking about:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(s)}
                        disabled={isTyping}
                        className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 active:scale-[0.98] transition disabled:opacity-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message list */}
              <ul className="space-y-3">
                {messages.map((msg) => (
                  <li key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[85%]">
                      <MessageBubble role={msg.role} time={time()}>
                        {msg.text}
                      </MessageBubble>
                      
                      {/* FAQ feedback buttons */}
                      {/* {msg.role === 'bot' && msg.faqId && (
                        <div className="flex items-center gap-2 mt-2 ml-2">
                          <span className="text-sm text-gray-500">Was this helpful?</span>
                          <button
                            onClick={() => handleFeedback(msg.id, msg.faqId, true)}
                            className="p-1 rounded text-green-600 hover:bg-green-50 transition"
                            title="Helpful"
                          >
                            <FiThumbsUp size={14} />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, msg.faqId, false)}
                            className="p-1 rounded text-red-600 hover:bg-red-50 transition"
                            title="Not helpful"
                          >
                            <FiThumbsDown size={14} />
                          </button>
                        </div>
                      )} */}
                    </div>
                  </li>
                ))}

                {isTyping && (
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
                    disabled={isTyping}
                    className="w-full resize-none text-sm rounded-xl border border-neutral-200 bg-white px-2 py-2 outline-none   leading-6 max-h-28 disabled:opacity-50"
                  />
                  
                </div>

                <button
                  onClick={() => sendMessage(input)}
                  disabled={isTyping || !input.trim()}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-amber-500 px-4 text-white text-sm font-medium shadow hover:brightness-105 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="mr-1" />
                  Send
                </button>
              </div>

              {/* Policy note */}
              <p className="mt-2 text-[11px] text-neutral-400 text-center">
                💎 Powered by Garava FAQ System • We respect your privacy
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