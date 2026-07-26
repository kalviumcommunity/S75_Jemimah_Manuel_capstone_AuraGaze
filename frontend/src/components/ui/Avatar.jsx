import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";

import colors from "../../theme/colors";

// ==========================================
// Size Presets
// ==========================================
// px sizes tuned for the two real use cases: the chat
// header (sm) and the profile modal (xl). md/lg included
// for any future use elsewhere in the app.

const SIZE_MAP = {
  sm: 64,   // chat header
  md: 88,
  lg: 120,
  xl: 168,  // profile modal hero avatar
};

export default function Avatar({
  src,
  name = "Friend",

  size = "sm",

  online = false,

  // Visual intensity toggles — the chat header wants a
  // subtle version of this component, the profile page
  // wants the full "alive" treatment from the brief.
  floating = true,
  breathingBorder = true,
  shine = true,
  glow = true,

  onClick,

  className = "",
}) {
  const px = typeof size === "number" ? size : SIZE_MAP[size] || SIZE_MAP.sm;

  const initials = name?.trim()?.[0]?.toUpperCase() || "";

  const isClickable = typeof onClick === "function";

  return (
    <motion.div
      onClick={onClick}
      className={`relative shrink-0 ${isClickable ? "cursor-pointer" : ""} ${className}`}
      style={{ width: px, height: px }}
      whileHover={isClickable ? { scale: 1.04 } : {}}
      whileTap={isClickable ? { scale: 0.97 } : {}}
    >
      {/* ==========================================
          Ambient Glow — soft blurred aura behind
          everything, breathing slowly.
      ========================================== */}
      {glow && (
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full blur-xl"
          style={{
            background: colors.glow.violet,
          }}
        />
      )}

      {/* ==========================================
          Floating wrapper — the avatar (border, image,
          shine) gently rises and falls, reading as
          "breathing" rather than mechanical.
      ========================================== */}
      <motion.div
        animate={floating ? { y: [0, -4, 0] } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-full h-full"
      >
        {/* ==========================================
            Animated Gradient Border — a slowly rotating
            conic gradient ring behind the avatar image,
            visible as a thin glowing edge.
        ========================================== */}
        {breathingBorder ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full"
            style={{
              padding: Math.max(2, Math.round(px * 0.025)),
              background: `conic-gradient(from 0deg, ${colors.brand.primary}, ${colors.brand.accent}, ${colors.brand.lavender}, ${colors.brand.secondary}, ${colors.brand.primary})`,
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{ background: colors.background.primary }}
            />
          </motion.div>
        ) : (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: `2px solid ${colors.border.strong}`,
            }}
          />
        )}

        {/* ==========================================
            Avatar Image / Initials Fallback
        ========================================== */}
        <div
          className="absolute rounded-full overflow-hidden flex items-center justify-center"
          style={{
            inset: breathingBorder ? Math.max(2, Math.round(px * 0.025)) + 1 : 2,
            background: colors.card.primary,
            boxShadow: `0 0 25px ${colors.glow.violet}`,
          }}
        >
          {src ? (
            <img
              src={src}
              alt={name}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "flex";
              }}
              className="w-full h-full object-cover"
            />
          ) : null}

          <div
            style={{
              display: src ? "none" : "flex",
              fontSize: px * 0.35,
              color: colors.text.primary,
            }}
            className="w-full h-full items-center justify-center font-semibold"
          >
            {initials || <FiUser size={px * 0.35} />}
          </div>

          {/* ==========================================
              Shine Sweep — a soft diagonal highlight
              that sweeps across the avatar every few
              seconds, like light catching glass.
          ========================================== */}
          {shine && (
            <motion.div
              animate={{ x: ["-150%", "220%"] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: "easeInOut",
              }}
              className="absolute inset-y-0 pointer-events-none"
              style={{
                width: px * 0.5,
                background:
                  "linear-gradient(105deg, transparent, rgba(255,255,255,.35), transparent)",
                transform: "skewX(-15deg)",
              }}
            />
          )}
        </div>
      </motion.div>

      {/* ==========================================
          Online Status Dot — pulsing ring behind a
          solid dot, scaled proportionally to avatar size.
      ========================================== */}
      {online && (
        <div
          className="absolute"
          style={{
            width: Math.max(12, px * 0.22),
            height: Math.max(12, px * 0.22),
            bottom: px * 0.02,
            right: px * 0.02,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full"
            style={{ background: colors.status.online }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: colors.status.online,
              border: `2px solid ${colors.background.primary}`,
            }}
          />
        </div>
      )}
    </motion.div>
  );
}