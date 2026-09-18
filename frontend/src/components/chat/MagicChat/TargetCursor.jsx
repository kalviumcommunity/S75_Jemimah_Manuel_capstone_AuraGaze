import {
  motion,
} from "framer-motion";

import {
  Crosshair,
  Lock,
} from "lucide-react";

export default function TargetCursor({
  x = 0,
  y = 0,
  locked = false,
  visible = true,
  onClick,
}) {
  if (!visible) {
    return null;
  }

  return (
    <motion.button
      type="button"
      onClick={
        onClick
      }
      initial={{
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        opacity: 1,

        scale:
          locked
            ? 1.08
            : 1,
      }}
      whileHover={{
        scale: 1.12,
      }}
      className="
        absolute
        z-[250]
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
      {/* =====================================================
          GLOW
      ===================================================== */}

      <motion.div
        className="
          absolute
          inset-0
          rounded-full
        "
        animate={{
          scale:
            locked
              ? [
                  1,
                  1.22,
                  1,
                ]
              : [
                  1,
                  1.08,
                  1,
                ],

          opacity:
            locked
              ? [
                  0.3,
                  0.65,
                  0.3,
                ]
              : [
                  0.2,
                  0.45,
                  0.2,
                ],
        }}
        transition={{
          duration:
            locked
              ? 0.9
              : 1.4,

          repeat:
            Infinity,

          ease:
            "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(192,132,252,.5), transparent 70%)",

          filter:
            "blur(6px)",
        }}
      />

      {/* =====================================================
          OUTER RING
      ===================================================== */}

      <div
        className="
          absolute
          inset-1
          rounded-full
          border
        "
        style={{
          borderColor:
            locked
              ? "rgba(255,255,255,.9)"
              : "rgba(192,132,252,.7)",
        }}
      />

      {/* =====================================================
          INNER RING
      ===================================================== */}

      <motion.div
        className="
          absolute
          inset-3
          rounded-full
          border
          border-dashed
        "
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 3,
          repeat:
            Infinity,
          ease:
            "linear",
        }}
        style={{
          borderColor:
            "rgba(255,255,255,.45)",
        }}
      />

      {/* =====================================================
          CROSSHAIR
      ===================================================== */}

      <Crosshair
        size={28}
        strokeWidth={1.5}
        className="relative"
        style={{
          color:
            locked
              ? "#ffffff"
              : "#d8b4fe",

          filter:
            "drop-shadow(0 0 8px rgba(192,132,252,.9))",
        }}
      />

      {/* =====================================================
          LOCK INDICATOR
      ===================================================== */}

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
            -bottom-7
            left-1/2
            -translate-x-1/2
            flex
            items-center
            gap-1
            px-2
            py-1
            rounded-full
            whitespace-nowrap
          "
          style={{
            background:
              "rgba(62,34,100,.85)",

            border:
              "1px solid rgba(192,132,252,.55)",

            color:
              "#eadcff",

            fontSize:
              "11px",

            boxShadow:
              "0 0 18px rgba(168,85,247,.25)",
          }}
        >
          <Lock
            size={11}
          />

          Target locked
        </motion.span>
      )}
    </motion.button>
  );
}