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

  /*
   * TRUE only for the newest message.
   */
  isRecent = false,
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

  // =========================================================
  // RECENT STYLES
  // =========================================================

  const recentGlow =
    isRecent
      ? isAI
        ? "0 0 35px rgba(192,132,252,.42), 0 12px 32px rgba(0,0,0,.34)"
        : "0 0 38px rgba(196,181,253,.55), 0 12px 32px rgba(91,33,182,.35)"
      : undefined;

  // =========================================================
  // TARGETED USER MESSAGE
  // =========================================================

  if (anchored) {
    return (
      <div
        data-message-id={id}
        className="
          absolute
          pointer-events-auto
        "
        style={{
          left: x,

          top: y,

          width,

          /*
           * Target is the exact CENTER.
           */
          transform:
            "translate(-50%, -50%)",

          zIndex:
            isRecent
              ? 50
              : 10,
        }}
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.45,
            rotate: 0,
          }}
          animate={{
            opacity: 1,
            scale:
              isRecent
                ? 1.025
                : 1,
            rotate: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 18,
            mass: 0.6,
          }}
          className="
            relative
            w-full
          "
        >
          {/* =================================================
              RECENT AURA
          ================================================= */}

          {isRecent && (
            <>
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  opacity: [
                    0.3,
                    0.8,
                    0.3,
                  ],
                  scale: [
                    0.95,
                    1.08,
                    0.95,
                  ],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  -inset-3
                  rounded-[28px]
                  pointer-events-none
                "
                style={{
                  background:
                    "radial-gradient(circle, rgba(196,181,253,.38), transparent 68%)",

                  filter:
                    "blur(8px)",
                }}
              />

              <div
                className="
                  absolute
                  -top-7
                  left-1/2
                  -translate-x-1/2
                  z-40
                  px-2.5
                  py-1
                  rounded-full
                  text-[9px]
                  font-semibold
                  tracking-[0.16em]
                  whitespace-nowrap
                  pointer-events-none
                "
                style={{
                  color:
                    "#24163d",

                  background:
                    "linear-gradient(135deg, #e9d5ff, #c4b5fd)",

                  border:
                    "1px solid rgba(255,255,255,.65)",

                  boxShadow:
                    "0 0 18px rgba(196,181,253,.45)",
                }}
              >
                LATEST
              </div>
            </>
          )}

          {/* =================================================
              LANDING GLOW
          ================================================= */}

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

          {/* =================================================
              ROW
          ================================================= */}

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
                "row-reverse",

              justifyContent:
                "flex-start",
            }}
          >
            {/* =================================================
                USER BUBBLE
            ================================================= */}

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
                  "linear-gradient(145deg, rgba(196,181,253,.98), rgba(167,139,250,.90))",

                border:
                  isRecent
                    ? "2px solid rgba(255,255,255,.92)"
                    : "1px solid rgba(221,214,254,.65)",

                boxShadow:
                  isRecent
                    ? recentGlow
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
                      "#171027",

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
                      "rgba(23,16,39,.58)",
                  }}
                >
                  {time}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // =========================================================
  // RANDOM / AI MESSAGE
  // =========================================================

  return (
    <motion.div
      data-message-id={id}
      initial={{
        opacity: 0,
        scale: 0.45,

        rotate:
          rotate * 2,

        y:
          y - 25,
      }}
      animate={{
        opacity: 1,

        scale:
          isRecent
            ? 1.025
            : 1,

        x: 0,

        y,

        rotate,
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
        left: x,

        top: 0,

        width,

        zIndex:
          isRecent
            ? 50
            : 5,
      }}
    >
      {/* =====================================================
          RECENT AURA
      ===================================================== */}

      {isRecent && (
        <>
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.75,
            }}
            animate={{
              opacity: [
                0.25,
                0.75,
                0.25,
              ],
              scale: [
                0.96,
                1.06,
                0.96,
              ],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              -inset-3
              rounded-[28px]
              pointer-events-none
            "
            style={{
              background:
                isAI
                  ? "radial-gradient(circle, rgba(192,132,252,.36), transparent 68%)"
                  : "radial-gradient(circle, rgba(196,181,253,.38), transparent 68%)",

              filter:
                "blur(8px)",
            }}
          />

          <div
            className="
              absolute
              -top-7
              left-1/2
              -translate-x-1/2
              z-40
              px-2.5
              py-1
              rounded-full
              text-[9px]
              font-semibold
              tracking-[0.16em]
              whitespace-nowrap
              pointer-events-none
            "
            style={{
              color:
                isAI
                  ? "#f4eaff"
                  : "#24163d",

              background:
                isAI
                  ? "linear-gradient(135deg, rgba(76,29,149,.95), rgba(139,92,246,.88))"
                  : "linear-gradient(135deg, #e9d5ff, #c4b5fd)",

              border:
                "1px solid rgba(255,255,255,.55)",

              boxShadow:
                isAI
                  ? "0 0 18px rgba(168,85,247,.5)"
                  : "0 0 18px rgba(196,181,253,.45)",
            }}
          >
            LATEST
          </div>
        </>
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
        {/* =================================================
            AI AVATAR
        ================================================= */}

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

        {/* =================================================
            MESSAGE BUBBLE
        ================================================= */}

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
              isRecent
                ? isAI
                  ? "2px solid rgba(216,180,254,.75)"
                  : "2px solid rgba(255,255,255,.92)"
                : isAI
                ? `1px solid ${colors.border.light}`
                : "1px solid rgba(221,214,254,.65)",

            boxShadow:
              isRecent
                ? recentGlow
                : isAI
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