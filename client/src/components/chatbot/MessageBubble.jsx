import iconlogo from "../../assets/images/gav-dark.png";

const MessageBubble = ({ role = "bot", time, children }) =>{
  const isUser = role === "user";

  // role ke hisaab se avatar ka letter

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
          <div className="rounded-full bg-gray-200 px-1.5  flex items-center justify-center">
                       <img className="h-10 object-cover w-full" src={iconlogo} alt="Garava Assistant" />
           
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageBubble