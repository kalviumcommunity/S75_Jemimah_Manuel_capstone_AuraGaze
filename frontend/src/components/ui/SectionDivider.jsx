import { motion } from "framer-motion";

export default function SectionDivider({
  text = "OR",
  className = "",
  lineColor = "white/15",
  textColor = "white/40",
  animated = true,
}) {
  return (
    <div
      className={`flex items-center gap-4 w-full ${className}`}
    >
      {/* Left Line */}

      <motion.div
        initial={
          animated
            ? {
                scaleX: 0,
                opacity: 0,
              }
            : false
        }
        animate={
          animated
            ? {
                scaleX: 1,
                opacity: 1,
              }
            : false
        }
        transition={{
          duration: 0.6,
          delay: 0.2,
        }}
        className={`
          origin-right
          h-px
          flex-1
          bg-${lineColor}
        `}
      />

      {/* Divider Text */}

      <motion.span
        initial={
          animated
            ? {
                opacity: 0,
                y: 8,
              }
            : false
        }
        animate={
          animated
            ? {
                opacity: 1,
                y: 0,
              }
            : false
        }
        transition={{
          duration: 0.45,
          delay: 0.35,
        }}
        className={`
          uppercase
          tracking-[5px]
          text-xs
          font-medium
          text-${textColor}
          whitespace-nowrap
          select-none
        `}
      >
        {text}
      </motion.span>

      {/* Right Line */}

      <motion.div
        initial={
          animated
            ? {
                scaleX: 0,
                opacity: 0,
              }
            : false
        }
        animate={
          animated
            ? {
                scaleX: 1,
                opacity: 1,
              }
            : false
        }
        transition={{
          duration: 0.6,
          delay: 0.2,
        }}
        className={`
          origin-left
          h-px
          flex-1
          bg-${lineColor}
        `}
      />
    </div>
  );
}