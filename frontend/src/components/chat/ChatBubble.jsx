import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";

export default function ChatBubble({
  sender,
  text,
  image,
  timestamp,
  isGrouped = false,
}) {
  const isAI = sender === "ai";

  const time = timestamp
    ? new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={`flex w-full items-end gap-2 ${
        isAI ? "justify-start" : "justify-end"
      }`}
    >
      {/* AI Avatar */}
      {isAI && (
        <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-white/10 border border-white/20">
          {image ? (
            <img
              src={image}
              alt="friend"
              className="w-full h-full object-cover"
            />
          ) : (
            !isGrouped && <FiUser size={16} className="text-white" />
          )}
        </div>
      )}

      {/* Bubble */}
      <div
        className={`
          relative
          px-5
          py-3
          max-w-[78%]
          md:max-w-[65%]
          lg:max-w-[55%]
          rounded-3xl
          break-words
          overflow-hidden
          ${
            isAI
              ? `
                bg-gradient-to-br
                from-violet-500/20
                via-purple-500/10
                to-fuchsia-500/5
                border
                border-white/15
                rounded-bl-md
                text-white
                shadow-[0_8px_32px_rgba(139,92,246,0.18)]
              `
              : `
                bg-gradient-to-br
                from-[#C9B6F5]
                via-[#B9A6E8]
                to-[#A891DD]
                rounded-br-md
                text-[#2C1D54]
                shadow-[0_8px_32px_rgba(185,166,232,0.35)]
              `
          }
        `}
        style={{
          backdropFilter: isAI ? "blur(20px)" : "none",
          WebkitBackdropFilter: isAI ? "blur(20px)" : "none",
        }}
      >
        {/* Top highlight — a thin bright edge along the upper rim,
            the classic glass-card "light catching the top" detail */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: isAI
              ? "linear-gradient(to right, transparent, rgba(255,255,255,.45), transparent)"
              : "linear-gradient(to right, transparent, rgba(255,255,255,.65), transparent)",
          }}
        />

        {/* Soft inner glow, sits behind the text */}
        <div
          className="absolute -top-6 -left-6 w-24 h-24 rounded-full pointer-events-none"
          style={{
            background: isAI
              ? "radial-gradient(circle, rgba(196,160,255,.25), transparent 70%)"
              : "radial-gradient(circle, rgba(255,255,255,.35), transparent 70%)",
            filter: "blur(8px)",
          }}
        />

        <p className="relative whitespace-pre-wrap leading-6 text-[15px]">
          {text}
        </p>

        {time && (
          <div
            className={`relative mt-2 text-[10px] ${
              isAI
                ? "text-white/60 text-left"
                : "text-[#2C1D54]/60 text-right"
            }`}
          >
            {time}
          </div>
        )}
      </div>
    </motion.div>
  );
}