import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 ml-14">

      {[0, 1, 2].map((dot) => (

        <motion.div
          key={dot}
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            repeat: Infinity,
            delay: dot * 0.2,
            duration: 0.6,
          }}
          className="w-3 h-3 rounded-full bg-[#C58CFF]"
        />

      ))}

    </div>
  );
}