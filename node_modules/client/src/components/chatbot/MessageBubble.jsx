const MessageBubble = ({ role = "bot", time, children }) =>{
  const isUser = role === "user";

  // role ke hisaab se avatar ka letter
  const initial = isUser ? "U" : "R"; // user → "U", bot → "R" (ya apne hisaab se set karo)

  return (
    <div className={`flex items-end   ${isUser ? "justify-start" : "justify-start"}`}>
    
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 py-2 shadow-sm ring-1 ${
          isUser
            ? "bg-[#0e1a2b] text-white ring-black/10"
            : "bg-white text-neutral-900 ring-black/5"
        }`}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">{children}</div>
        <div
          className={`mt-1 text-[10px] ${
            isUser ? "text-white/70" : "text-neutral-500"
          }`}
        >
          {time}
        </div>
      </div>

      {/* User avatar (right side) */}
      {isUser && (
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-xs font-semibold text-white">
            {initial}
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageBubble