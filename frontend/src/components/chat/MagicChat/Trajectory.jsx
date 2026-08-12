import { motion } from "framer-motion";

export default function Trajectory({
  visible = false,
  points = [],
}) {
  if (!visible || !points.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      {points.map((point, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: index * 0.03,
            duration: 0.15,
          }}
          className="absolute"
          style={{
            left: `calc(50% + ${point.x}px)`,
            bottom: `${85 + point.y}px`,
            transform: "translate(-50%, 50%)",
          }}
        >
          {/* Outer Glow */}
          <div
            className="absolute rounded-full"
            style={{
              width: 16,
              height: 16,
              left: -6,
              top: -6,
              background:
                "radial-gradient(circle, rgba(180,130,255,.35), transparent 70%)",
              filter: "blur(5px)",
            }}
          />

          {/* Main Dot */}
          <motion.div
            animate={{
              scale: [1, 1.35, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.08,
            }}
            className="rounded-full"
            style={{
              width: 6,
              height: 6,
              background: "#C084FC",
              boxShadow:
                "0 0 8px rgba(192,132,252,.9), 0 0 18px rgba(168,85,247,.65)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}