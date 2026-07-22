import { motion } from "framer-motion";

export default function BackgroundGlow() {
  return (
    <>
      {/* Center Glow */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[780px]
          h-[780px]
          rounded-full
          bg-violet-500/15
          blur-[150px]
          pointer-events-none
        "
      />

      {/* Left Glow */}
      <motion.div
        animate={{
          x: [-20, 20, -20],
          y: [0, -15, 0],
          opacity: [0.75, 1, 0.75],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -left-44
          top-28
          w-[520px]
          h-[520px]
          rounded-full
          bg-fuchsia-500/15
          blur-[180px]
          pointer-events-none
        "
      />

      {/* Right Glow */}
      <motion.div
        animate={{
          x: [20, -20, 20],
          y: [0, 15, 0],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -right-44
          bottom-24
          w-[520px]
          h-[520px]
          rounded-full
          bg-purple-500/15
          blur-[180px]
          pointer-events-none
        "
      />

      {/* Top Glow */}
      <motion.div
        animate={{
          y: [-15, 15, -15],
          opacity: [0.45, 0.75, 0.45],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-1/2
          -translate-x-1/2
          -top-44
          w-[420px]
          h-[420px]
          rounded-full
          bg-pink-400/12
          blur-[180px]
          pointer-events-none
        "
      />

      {/* Bottom Glow */}
      <motion.div
        animate={{
          y: [15, -15, 15],
          opacity: [0.45, 0.75, 0.45],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-1/2
          -translate-x-1/2
          -bottom-44
          w-[420px]
          h-[420px]
          rounded-full
          bg-indigo-500/12
          blur-[180px]
          pointer-events-none
        "
      />
    </>
  );
}