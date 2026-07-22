import { motion } from "framer-motion";

import colors from "../../theme/colors";
import gradients from "../../theme/gradients";
import shadows from "../../theme/shadows";
import radius from "../../theme/radius";
import spacing from "../../theme/spacing";
import typography from "../../theme/typography";
import animations from "../../theme/animations";

const variants = {
  glass: {
    background: gradients.card.soft,
    color: colors.text.primary,
    border: `1px solid ${colors.border.normal}`,
    shadow: shadows.floating.sm,
  },

  outline: {
    background: "transparent",
    color: colors.text.secondary,
    border: `1px solid ${colors.border.strong}`,
    shadow: "none",
  },

  ghost: {
    background: "transparent",
    color: colors.text.soft,
    border: "1px solid transparent",
    shadow: "none",
  },
};

const sizes = {
  sm: {
    height: spacing.button.sm,
    padding: `0 ${spacing.padding.lg}`,
    fontSize: typography.fontSize.sm,
  },

  md: {
    height: spacing.button.md,
    padding: `0 ${spacing.padding.xl}`,
    fontSize: typography.fontSize.base,
  },

  lg: {
    height: spacing.button.lg,
    padding: `0 ${spacing.padding["2xl"]}`,
    fontSize: typography.fontSize.md,
  },
};

export default function SecondaryButton({
  children,

  onClick,

  type = "button",

  variant = "glass",

  size = "md",

  loading = false,

  disabled = false,

  fullWidth = true,

  leftIcon,

  rightIcon,

  className = "",
}) {
  const isDisabled = loading || disabled;

  const currentVariant =
    variants[variant] || variants.glass;

  const currentSize =
    sizes[size] || sizes.md;

  return (
    <motion.button
      whileHover={
        !isDisabled
          ? animations.hover.button
          : {}
      }
      whileTap={
        !isDisabled
          ? animations.tap.button
          : {}
      }
      transition={{
        duration: animations.duration.fast,
        ease: animations.easing.smooth,
      }}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`
        group
        relative
        overflow-hidden
        flex
        items-center
        justify-center
        transition-all
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      style={{
        height: currentSize.height,

        padding: currentSize.padding,

        fontSize: currentSize.fontSize,

        fontFamily: typography.fontFamily.body,

        fontWeight: typography.fontWeight.semibold,

        letterSpacing:
          typography.letterSpacing.wide,

        borderRadius: radius.button.md,

        background: currentVariant.background,

        color: currentVariant.color,

        border: currentVariant.border,

        boxShadow: currentVariant.shadow,

        backdropFilter: "blur(18px)",

        WebkitBackdropFilter: "blur(18px)",

        cursor: isDisabled
          ? "not-allowed"
          : "pointer",

        opacity: isDisabled ? 0.6 : 1,
      }}
    >
      {/* ===============================
          Top Highlight
      =============================== */}

      <div
        className="
          absolute
          top-0
          left-0
          right-0
          h-px
        "
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,.35), transparent)",
        }}
      />

      {/* ===============================
          Animated Reflection
      =============================== */}

      {!isDisabled && (
        <motion.div
          animate={{
            x: ["-180%", "240%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
          className="
            absolute
            inset-y-0
            w-20
            rotate-12
            bg-white/15
            blur-xl
            pointer-events-none
          "
        />
      )}
            {/* ===============================
          Hover Glow
      =============================== */}

      {!isDisabled && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{
            duration: animations.duration.fast,
          }}
          className="
            absolute
            inset-0
            pointer-events-none
          "
          style={{
            background: gradients.glow.lavender,
          }}
        />
      )}

      {/* ===============================
          Glass Texture
      =============================== */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.04]
          pointer-events-none
        "
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, white 0px, transparent 2px),
            radial-gradient(circle at 80% 35%, white 0px, transparent 2px),
            radial-gradient(circle at 60% 75%, white 0px, transparent 2px)
          `,
          backgroundSize: "120px 120px",
        }}
      />

      {/* ===============================
          Bottom Highlight
      =============================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          h-px
          pointer-events-none
        "
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,.15), transparent)",
        }}
      />

      {/* ===============================
          Content
      =============================== */}

      <span
        className="
          relative
          z-20
          flex
          items-center
          justify-center
          gap-3
        "
      >
        {loading ? (
          <>
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,.25)",
                borderTop: `2px solid ${colors.text.primary}`,
              }}
            />

            <span
              style={{
                fontFamily: typography.fontFamily.body,
                fontSize: currentSize.fontSize,
                fontWeight: typography.fontWeight.medium,
              }}
            >
              Loading...
            </span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {leftIcon}
              </span>
            )}

            <span
              style={{
                fontFamily: typography.fontFamily.body,
                fontWeight: typography.fontWeight.semibold,
                letterSpacing:
                  typography.letterSpacing.wide,
              }}
            >
              {children}
            </span>

            {rightIcon && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {rightIcon}
              </span>
            )}
          </>
        )}
      </span>
    </motion.button>
  );
}