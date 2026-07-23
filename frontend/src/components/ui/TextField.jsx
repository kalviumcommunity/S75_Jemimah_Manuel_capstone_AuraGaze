import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

import colors from "../../theme/colors";
import gradients from "../../theme/gradients";
import shadows from "../../theme/shadows";
import radius from "../../theme/radius";
import spacing from "../../theme/spacing";
import typography from "../../theme/typography";
import animations from "../../theme/animations";

export default function TextField({
  label,

  value,

  onChange,

  placeholder = "",

  type = "text",

  name,

  disabled = false,

  required = false,

  error,

  success,

  helperText,

  leftIcon,

  rightIcon,

  className = "",

  autoComplete = "off",
}) {
  const [focused, setFocused] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const inputType =
    isPassword && showPassword ? "text" : type;

  const hasValue =
    value !== undefined &&
    value !== null &&
    String(value).length > 0;

  const isFloating =
    focused || hasValue;

  const borderColor = error
    ? "#EF4444"
    : success
    ? "#22C55E"
    : focused
    ? colors.brand.primary
    : colors.border.normal;

  const boxShadow = error
    ? "0 0 0 3px rgba(239,68,68,.12)"
    : focused
    ? shadows.input.focus
    : shadows.input.default;

  return (
    <div
      className={`w-full ${className}`}
      style={{
        marginBottom: spacing.margin.lg,
      }}
    >
      {/* =====================================
          Input Wrapper
      ===================================== */}

      <motion.div
        animate={{
          scale: focused ? 1.01 : 1,
        }}
        transition={{
          duration: animations.duration.fast,
        }}
        className="relative"
      >
        {/* ===============================
            Input Container
        =============================== */}

        <div
          className="
            relative
            flex
            items-center
            overflow-hidden
          "
          style={{
            height: spacing.input.md,

            borderRadius: radius.input.md,

            background: gradients.card.soft,

            border: `1px solid ${borderColor}`,

            boxShadow,

            backdropFilter: "blur(18px)",

            WebkitBackdropFilter: "blur(18px)",
          }}
        >
          {/* ===============================
              Top Shine
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
              Left Icon
          =============================== */}

          {leftIcon && (
            <div
              className="flex items-center justify-center"
              style={{
                width: 56,
                color: focused
                  ? colors.brand.primary
                  : colors.text.soft,
                transition: "all .25s ease",
              }}
            >
              {leftIcon}
            </div>
          )}

          {/* ===============================
              Input
          =============================== */}

          <input
            type={inputType}
            name={name}
            value={value}
            placeholder={focused ? placeholder : ""}
            autoComplete={autoComplete}
            disabled={disabled}
            required={required}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="
              peer
              flex-1
              h-full
              bg-transparent
              outline-none
              border-none
            "
            style={{
              color: colors.text.primary,

              fontFamily: typography.fontFamily.body,

              fontSize: typography.fontSize.base,

              fontWeight: typography.fontWeight.regular,

              paddingLeft: leftIcon
                ? spacing.padding.xs
                : spacing.padding.lg,

              paddingRight:
                isPassword || rightIcon
                  ? "56px"
                  : spacing.padding.lg,

              caretColor: colors.brand.primary,
            }}
          />

         {/* ===============================
    Floating Label
=============================== */}

<motion.label
  animate={{
    y: isFloating ? -34 : 0,
    scale: isFloating ? 0.85 : 1,
    color: error
      ? "#EF4444"
      : focused
      ? colors.brand.primary
      : colors.text.soft,
  }}
  transition={{
    duration: animations.duration.fast,
  }}
  className="
    absolute
    top-0
    bottom-0
    flex
    items-center
    pointer-events-none
    origin-left
  "
  style={{
    left: leftIcon ? 56 : 20,

    fontFamily: typography.fontFamily.body,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.base,

    background: "transparent",

    zIndex: 2,
  }}
>
  {label}
</motion.label>
          {/* ===============================
              Password Toggle
          =============================== */}

          {isPassword && (
            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="
                absolute
                right-4
                flex
                items-center
                justify-center
              "
              style={{
                color: focused
                  ? colors.brand.primary
                  : colors.text.soft,
              }}
            >
              {showPassword ? (
                <Eye size={20} />
              ) : (
                <EyeOff size={20} />
              )}
            </button>
          )}

          {/* ===============================
              Right Icon
          =============================== */}

          {!isPassword && rightIcon && (
            <div
              className="
                absolute
                right-4
                flex
                items-center
                justify-center
              "
              style={{
                color: focused
                  ? colors.brand.primary
                  : colors.text.soft,
              }}
            >
              {rightIcon}
            </div>
          )}

          {/* ===============================
              Animated Reflection
          =============================== */}

          <motion.div
            animate={{
              x: ["-180%", "250%"],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
              absolute
              inset-y-0
              w-20
              rotate-12
              bg-white/10
              blur-xl
              pointer-events-none
            "
          />
        </div>
                {/* ===============================
            Focus Glow
        =============================== */}

        {focused && !error && (
          <motion.div
            layoutId="textfield-focus"
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: radius.input.md,
              boxShadow: shadows.glow.md,
            }}
          />
        )}
      </motion.div>

      {/* ===============================
          Helper / Error / Success Text
      =============================== */}

      {(error || success || helperText) && (
        <motion.div
          initial={{
            opacity: 0,
            y: -5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: animations.duration.fast,
          }}
          style={{
            marginTop: spacing.margin.sm,
            paddingLeft: spacing.padding.sm,
          }}
        >
          {error ? (
            <span
              style={{
                color: "#EF4444",
                fontFamily: typography.fontFamily.body,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
              }}
            >
              {error}
            </span>
          ) : success ? (
            <span
              style={{
                color: "#22C55E",
                fontFamily: typography.fontFamily.body,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
              }}
            >
              {success}
            </span>
          ) : (
            <span
              style={{
                color: colors.text.muted,
                fontFamily: typography.fontFamily.body,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.regular,
              }}
            >
              {helperText}
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
}