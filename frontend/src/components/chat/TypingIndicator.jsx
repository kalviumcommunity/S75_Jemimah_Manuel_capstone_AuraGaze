import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-full justify-start"
    >
      <div
        className="
          px-5
          py-3
          rounded-3xl
          rounded-bl-md
          bg-[#24143F]/90
          backdrop-blur-xl
          border
          border-white/10
          shadow-md
        "
      >
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              animate={{
                y: [0, -4, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.7,
                delay: dot * 0.18,
                ease: "easeInOut",
              }}
              className="w-2.5 h-2.5 rounded-full bg-[#E8D4FF] shadow-[0_0_10px_rgba(232,212,255,0.9)]"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}