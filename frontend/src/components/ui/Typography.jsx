import { motion } from "framer-motion";

import colors from "../../theme/colors";
import typography from "../../theme/typography";
import animations from "../../theme/animations";

const variants = {
  hero: {
    as: "h1",
    style: typography.styles.heroTitle,
    color: colors.text.primary,
  },

  pageTitle: {
    as: "h1",
    style: typography.styles.pageTitle,
    color: colors.text.primary,
  },

  sectionTitle: {
    as: "h2",
    style: typography.styles.sectionTitle,
    color: colors.text.primary,
  },

  subtitle: {
    as: "p",
    style: typography.styles.subtitle,
    color: colors.text.secondary,
  },

  body: {
    as: "p",
    style: typography.styles.body,
    color: colors.text.secondary,
  },

  bodyLarge: {
    as: "p",
    style: typography.styles.bodyLarge,
    color: colors.text.secondary,
  },

  caption: {
    as: "span",
    style: typography.styles.caption,
    color: colors.text.muted,
  },

  button: {
    as: "span",
    style: typography.styles.button,
    color: colors.text.primary,
  },

  chat: {
    as: "p",
    style: typography.styles.chatMessage,
    color: colors.text.primary,
  },

  timestamp: {
    as: "span",
    style: typography.styles.chatTimestamp,
    color: colors.text.muted,
  },
};

export default function Typography({
  children,

  variant = "body",

  color,

  align = "left",

  animate = false,

  className = "",

  style = {},

  ...props
}) {
  const current =
    variants[variant] || variants.body;

  const Component = current.as;

  const content = (
    <Component
      className={className}
      style={{
        ...current.style,

        color: color || current.color,

        textAlign: align,

        margin: 0,

        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );

  if (!animate) {
    return content;
  }

  return (
    <motion.div
      initial={animations.fadeUp.hidden}
      animate={animations.fadeUp.visible}
      transition={{
        duration: animations.duration.normal,
        ease: animations.easing.smooth,
      }}
    >
      {content}
    </motion.div>
  );
}