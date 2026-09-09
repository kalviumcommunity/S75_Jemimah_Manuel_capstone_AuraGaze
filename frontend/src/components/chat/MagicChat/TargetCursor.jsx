import { motion } from "framer-motion";
import { Crosshair } from "lucide-react";

export default function TargetCursor({
  x = 0,
  y = 0,
  locked = false,
  visible = true,
  onClick,
}) {
  if (!visible) return null;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        opacity: 1,
        scale: locked ? 1.08 : 1,
      }}
      whileHover={{
        scale: 1.15,
      }}
      className="
        absolute
        z-40
        w-16
        h-16
        -translate-x-1/2
        -translate-y-1/2
        rounded-full
        flex
        items-center
        justify-center
        cursor-crosshair
      "
      style={{
        left: x,
        top: y,
      }}
    >
      {/* Outer glow */}
      <motion.div
        className="
          absolute
          inset-0
          rounded-full
        "
        animate={{
          scale: locked
            ? [1, 1.22, 1]
            : [1, 1.08, 1],
          opacity: locked
            ? [0.3, 0.65, 0.3]
            : [0.2, 0.45, 0.2],
        }}
        transition={{
          duration: locked
            ? 0.9
            : 1.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(192,132,252,.5), transparent 70%)",
          filter: "blur(6px)",
        }}
      />

      {/* Main ring */}
      <div
        className="
          absolute
          inset-2
          rounded-full
          border
        "
        style={{
          borderColor: locked
            ? "rgba(255,255,255,.9)"
            : "rgba(192,132,252,.7)",
        }}
      />

      {/* Dashed ring */}
      <motion.div
        className="
          absolute
          inset-4
          rounded-full
          border
          border-dashed
        "
        animate={{
          rotate: locked
            ? 360
            : 0,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          borderColor:
            "rgba(255,255,255,.45)",
        }}
      />

      {/* Crosshair */}
      <Crosshair
        size={28}
        strokeWidth={1.5}
        className="relative"
        style={{
          color: locked
            ? "#ffffff"
            : "#d8b4fe",
          filter:
            "drop-shadow(0 0 8px rgba(192,132,252,.9))",
        }}
      />

      {/* Locked dot */}
      {locked && (
        <motion.span
          initial={{
            scale: 0,
          }}
          animate={{
            scale: 1,
          }}
          className="
            absolute
            -top-1
            -right-1
            w-4
            h-4
            rounded-full
            bg-white
          "
          style={{
            boxShadow:
              "0 0 14px rgba(255,255,255,.95)",
          }}
        />
      )}
    </motion.button>
  );
}