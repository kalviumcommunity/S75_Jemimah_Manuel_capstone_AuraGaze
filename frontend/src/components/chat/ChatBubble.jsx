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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
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
          px-5
          py-3
          max-w-[78%]
          md:max-w-[65%]
          lg:max-w-[55%]
          rounded-3xl
          shadow-lg
          break-words
          ${
            isAI
              ? "bg-white/15 backdrop-blur-xl border border-white/10 rounded-bl-md text-white"
              : "bg-[#B9A6E8] text-[#2C1D54] rounded-br-md"
          }
        `}
      >
        <p className="whitespace-pre-wrap leading-6">
          {text}
        </p>

        {time && (
          <div
            className={`mt-2 text-[10px] ${
              isAI
                ? "text-white/60 text-left"
                : "text-[#4D3B77]/70 text-right"
            }`}
          >
            {time}
          </div>
        )}
      </div>
    </motion.div>
  );
}