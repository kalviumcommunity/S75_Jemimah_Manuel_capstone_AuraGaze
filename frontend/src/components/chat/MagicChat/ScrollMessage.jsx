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

  anchored = false,
}) {
  const isAI =
    sender === "ai";

  const time =
    timestamp
      ? new Date(
          timestamp
        ).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      : "";

  const firstImage =
    attachments.find(
      (attachment) =>
        attachment?.mimetype?.startsWith(
          "image/"
        )
    );

  return (
    <motion.div
      data-message-id={id}
      initial={{
        opacity: 0,
        scale: 0.45,

        rotate:
          anchored
            ? 0
            : rotate * 2,

        ...(!anchored && {
              y:
                y - 25,
            }),
      }}
      animate={{
        opacity: 1,
        scale: 1,

        ...(!anchored && {
              x: 0,
              y,
            }),

        rotate:
          anchored
            ? 0
            : rotate,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 18,
        mass: 0.6,
      }}
      className="
        absolute
        pointer-events-auto
      "
      style={{
        /*
         * =====================================================
         * TARGETED MESSAGE
         * =====================================================
         *
         * x/y = CENTER.
         *
         * translate(-50%, -50%)
         * puts the exact DOM center at x/y.
         */

        left: x,

        top: y,

        width,

        transform:
          anchored
            ? "translate(-50%, -50%)"
            : undefined,

        zIndex:
          anchored
            ? 10
            : 5,
      }}
    >
      {/* =====================================================
          LANDING GLOW
      ===================================================== */}

      {anchored && (
        <motion.div
          initial={{
            opacity: 0.7,
            scale: 0.2,
          }}
          animate={{
            opacity: 0,
            scale: 2.4,
          }}
          transition={{
            duration: 0.65,
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
            width: 70,
            height: 70,

            background:
              colors.glow.lavender,

            filter:
              "blur(12px)",
          }}
        />
      )}

      {/* =====================================================
          ROW
      ===================================================== */}

      <div
        className="
          relative
          flex
          items-end
          gap-2
          w-full
        "
        style={{
          flexDirection:
            isAI
              ? "row"
              : "row-reverse",

          justifyContent:
            "flex-start",
        }}
      >
        {/* ===================================================
            AI AVATAR
        =================================================== */}

        {isAI && (
          <div
            className="
              shrink-0
            "
          >
            <Avatar
              src={image}
              name="Friend"
              size={30}
              floating={false}
              breathingBorder={false}
              shine={false}
              glow={false}
            />
          </div>
        )}

        {/* ===================================================
            BUBBLE
        =================================================== */}

        <motion.div
          whileHover={{
            y: -1,
          }}
          className="
            relative
            min-w-0
            overflow-hidden
            rounded-[20px]
            px-4
            pt-3
            pb-2
          "
          style={{
            width:
              "fit-content",

            maxWidth:
              "100%",

            background:
              isAI
                ? "linear-gradient(145deg, rgba(255,255,255,.095), rgba(196,160,255,.075))"
                : "linear-gradient(145deg, rgba(196,181,253,.98), rgba(167,139,250,.90))",

            border:
              isAI
                ? `1px solid ${colors.border.light}`
                : "1px solid rgba(221,214,254,.65)",

            boxShadow:
              isAI
                ? "0 10px 28px rgba(0,0,0,.30), 0 0 24px rgba(168,85,247,.12)"
                : "0 10px 28px rgba(91,33,182,.28), 0 0 24px rgba(167,139,250,.20)",

            backdropFilter:
              "blur(14px)",

            WebkitBackdropFilter:
              "blur(14px)",
          }}
        >
          {/* =================================================
              TEXTURE
          ================================================= */}

          <div
            className="
              absolute
              inset-0
              rounded-[20px]
              pointer-events-none
            "
            style={{
              opacity: 0.2,

              background:
                "repeating-linear-gradient(100deg, transparent 0px, transparent 18px, rgba(255,255,255,.06) 19px)",
            }}
          />

          {/* =================================================
              INNER LIGHT
          ================================================= */}

          <div
            className="
              absolute
              inset-0
              rounded-[20px]
              pointer-events-none
            "
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,.10), transparent 45%)",
            }}
          />

          {/* =================================================
              IMAGE
          ================================================= */}

          {firstImage && (
            <img
              src={
                firstImage.url
              }
              alt=""
              className="
                relative
                block
                w-full
                max-h-52
                object-cover
                rounded-[14px]
                mb-2
              "
            />
          )}

          {/* =================================================
              TEXT
          ================================================= */}

          {text && (
            <p
              className="
                relative
                m-0
                p-0
                text-[14px]
                sm:text-[15px]
                leading-[1.45]
                font-normal
              "
              style={{
                width:
                  "100%",

                minWidth: 0,

                color:
                  isAI
                    ? colors
                        .text
                        .primary
                    : "#171027",

                whiteSpace:
                  "pre-wrap",

                overflowWrap:
                  "anywhere",

                wordBreak:
                  "break-word",

                textAlign:
                  "left",
              }}
            >
              {text}
            </p>
          )}

          {/* =================================================
              TIME
          ================================================= */}

          {time && (
            <div
              className="
                relative
                flex
                justify-end
                items-center
                mt-1
                -mb-0.5
                pl-4
                text-[10px]
                leading-3
                select-none
              "
              style={{
                color:
                  isAI
                    ? colors
                        .text
                        .muted
                    : "rgba(23,16,39,.58)",
              }}
            >
              {time}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
