import { motion } from "framer-motion";

import colors from "../../theme/colors";
import gradients from "../../theme/gradients";
import radius from "../../theme/radius";
import shadows from "../../theme/shadows";
import animations from "../../theme/animations";

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-[650px]",
  lg: "max-w-[850px]",
  xl: "max-w-[1100px]",
  full: "max-w-full",
};

export default function GlassCard({
  children,

  size = "md",

  maxWidth,

  className = "",

  hover = true,

  glow = true,

  blur = true,

  padding = false,
}) {
  const widthClass =
    maxWidth ? "" : sizeClasses[size] || sizeClasses.md;

  return (
    <motion.div
      whileHover={
        hover ? animations.hover.card : {}
      }
      transition={{
        duration: animations.duration.normal,
        ease: animations.easing.smooth,
      }}
      className={`
        relative
        overflow-hidden
        w-full
        ${widthClass}
        ${className}
      `}
      style={{
        maxWidth: maxWidth || undefined,

        borderRadius: radius.card.default,

        border: `1px solid ${colors.card.border}`,

        background: gradients.card.primary,

        backdropFilter: blur ? "blur(22px)" : "none",

        WebkitBackdropFilter: blur
          ? "blur(22px)"
          : "none",

        boxShadow: shadows.card.xl,
      }}
    >
      {/* =====================================
          Animated Glass Reflection
      ===================================== */}

      <motion.div
        animate={{
          x: ["-140%", "180%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          inset-y-0
          w-24
          rotate-12
          bg-white/10
          blur-2xl
          pointer-events-none
        "
      />

      {/* =====================================
          Inner Border
      ===================================== */}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: radius.card.default,
          border: `1px solid ${colors.border.light}`,
        }}
      />

      {/* =====================================
          Top Shine
      ===================================== */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/45
          to-transparent
          pointer-events-none
        "
      />

      {/* =====================================
          Bottom Shine
      ===================================== */}

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/10
          to-transparent
          pointer-events-none
        "
      />
            {/* =====================================
          Ambient Glow
      ===================================== */}

      {glow && (
        <>
          <div
            className="
              absolute
              -top-28
              -left-24
              w-72
              h-72
              rounded-full
              blur-3xl
              opacity-40
              pointer-events-none
            "
            style={{
              background: gradients.glow.violet,
            }}
          />

          <div
            className="
              absolute
              -bottom-28
              -right-24
              w-72
              h-72
              rounded-full
              blur-3xl
              opacity-30
              pointer-events-none
            "
            style={{
              background: gradients.glow.lavender,
            }}
          />
        </>
      )}

      {/* =====================================
          Soft Edge Highlight
      ===================================== */}

      <div
        className="
          absolute
          inset-0
          pointer-events-none
        "
        style={{
          borderRadius: radius.card.default,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.10)",
        }}
      />

      {/* =====================================
          Glass Texture
      ===================================== */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.03]
          pointer-events-none
        "
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, white 0px, transparent 2px),
            radial-gradient(circle at 80% 40%, white 0px, transparent 2px),
            radial-gradient(circle at 60% 80%, white 0px, transparent 2px)
          `,
          backgroundSize: "120px 120px",
        }}
      />

      {/* =====================================
          Content
      ===================================== */}

      <div
        className="relative z-20 w-full"
        style={{
          padding: padding ? "32px" : undefined,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}