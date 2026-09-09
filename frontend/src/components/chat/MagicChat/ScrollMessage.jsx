import { motion } from "framer-motion";

import Avatar from "../../ui/Avatar";
import colors from "../../../theme/colors";

export default function ScrollMessage({
  id,
  sender,
  text,
  image,
  attachments = [],
  timestamp,

  x = 0,
  y = 0,
  rotate = 0,
  width = 220,
}) {
  const isAI = sender === "ai";

  const time = timestamp
    ? new Date(
        timestamp
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const firstImage =
    attachments.find(
      (attachment) =>
        attachment.mimetype?.startsWith(
          "image/"
        )
    );

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.35,
        rotate: rotate * 2.5,
        y: y - 40,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate,
        y,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 18,
        mass: 0.6,
      }}
      className="absolute"
      style={{
        left: x,
        top: 0,
        width,
      }}
    >
      {/* Landing glow */}
      <motion.div
        initial={{
          opacity: 0.6,
          scale: 0.2,
        }}
        animate={{
          opacity: 0,
          scale: 2.2,
        }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          pointer-events-none
        "
        style={{
          width: 40,
          height: 40,
          background:
            colors.glow.lavender,
          filter: "blur(6px)",
        }}
      />

      <div
        className="
          relative
          flex
          items-start
          gap-2
        "
        style={{
          flexDirection: isAI
            ? "row"
            : "row-reverse",
        }}
      >
        {/* AI avatar */}
        {isAI && (
          <Avatar
            src={image}
            name="Friend"
            size={30}
            floating={false}
            breathingBorder={false}
            shine={false}
            glow={false}
          />
        )}

        {/* Message */}
        <div
          className="
            relative
            px-4
            py-3
            rounded-2xl
          "
          style={{
            background: isAI
              ? `linear-gradient(155deg, ${colors.card.glass}, rgba(196,160,255,.10))`
              : `linear-gradient(155deg, ${colors.brand.lavender}55, ${colors.brand.primary}33)`,

            border: `1px solid ${colors.border.strong}`,

            boxShadow: `
              0 14px 34px ${colors.shadow.dark},
              0 0 26px ${colors.glow.violet}
            `,

            backdropFilter:
              "blur(10px)",
          }}
        >
          {/* Paper texture */}
          <div
            className="
              absolute
              inset-0
              rounded-2xl
              pointer-events-none
              opacity-30
            "
            style={{
              background:
                "repeating-linear-gradient(100deg, transparent 0px, transparent 18px, rgba(255,255,255,.06) 19px)",
            }}
          />

          {/* Image */}
          {firstImage && (
            <img
              src={firstImage.url}
              alt=""
              className="
                relative
                w-full
                max-h-40
                object-cover
                rounded-xl
                mb-2
              "
            />
          )}

          {/* Text */}
          {text && (
            <p
              className="
                relative
                text-[14px]
                leading-6
                whitespace-pre-wrap
              "
              style={{
                color:
                  colors.text.primary,
                overflowWrap:
                  "anywhere",
              }}
            >
              {text}
            </p>
          )}

          {/* Time */}
          {time && (
            <div
              className="
                relative
                mt-1.5
                text-[10px]
                text-right
              "
              style={{
                color:
                  colors.text.muted,
              }}
            >
              {time}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}