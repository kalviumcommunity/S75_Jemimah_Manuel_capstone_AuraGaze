import { motion } from "framer-motion";
import { FiArrowLeft, FiUser } from "react-icons/fi";

export default function ChatHeader({
  friend,
  status = "Online",
  isTyping = false,
  onBack,
}) {
  const friendName = friend?.name?.trim() || "Friend";
  const friendImage = friend?.image?.trim() || "";

  return (
    <motion.header
      initial={{
        opacity: 0,
        y: -30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
      className="
        relative
        w-full
        shrink-0
        backdrop-blur-2xl
        bg-white/[0.06]
        border-b
        border-white/10
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          h-24
          px-8
          flex
          items-center
          justify-between
        "
      >
        {/* ===============================
            LEFT
        ================================ */}

        <div className="flex items-center gap-5">

          {/* Back Button */}

          <motion.button
            whileHover={{
              scale: 1.08,
            }}
            whileTap={{
              scale: .95,
            }}
            onClick={onBack}
            className="
              w-12
              h-12
              rounded-full
              bg-white/5
              border
              border-white/10
              flex
              items-center
              justify-center
              text-white
              transition-all
              hover:bg-white/10
              hover:border-violet-400/40
            "
          >
            <FiArrowLeft size={22} />
          </motion.button>

          {/* Avatar */}

          <div className="relative shrink-0">

            {/* Glow */}

            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [.5, .9, .5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="
                absolute
                inset-0
                rounded-full
                bg-violet-500/30
                blur-xl
              "
            />

            {friendImage ? (
              <img
                src={friendImage}
                alt={friendName}
                onError={(e) => {
                  // If the stored image URL is broken/empty,
                  // fall back to the initials circle instead
                  // of a permanently broken <img> icon.
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextSibling.style.display = "flex";
                }}
                className="
                  relative
                  w-16
                  h-16
                  rounded-full
                  object-cover
                  border-2
                  border-violet-300/70
                  shadow-[0_0_25px_rgba(168,85,247,.45)]
                "
              />
            ) : null}

            {/* Initials / icon fallback — shown if there is
                no image at all, or if the image fails to load */}

            <div
              style={{ display: friendImage ? "none" : "flex" }}
              className="
                relative
                w-16
                h-16
                rounded-full
                items-center
                justify-center
                bg-violet-500/30
                border-2
                border-violet-300/70
                shadow-[0_0_25px_rgba(168,85,247,.45)]
                text-white
                text-xl
                font-semibold
              "
            >
              {friendName?.[0]?.toUpperCase() || <FiUser size={22} />}
            </div>

            {/* Online Indicator */}

            <motion.div
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="
                absolute
                bottom-1
                right-1
                w-4
                h-4
                rounded-full
                bg-green-400
                border-2
                border-[#140E22]
              "
            />

          </div>

          {/* Friend Details */}

          <div>

            <motion.h2
              initial={{
                opacity: 0,
                x: -10,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: .15,
              }}
              className="
                text-white
                text-2xl
                font-semibold
                tracking-wide
              "
              style={{
                fontFamily:
                  "'Playfair Display', serif",
              }}
            >
              {friendName}
            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: .25,
              }}
              className="
                mt-1
                text-sm
                text-violet-200
                flex
                items-center
                gap-2
              "
            >
              {isTyping ? (
                <>
                  <span className="text-green-400">
                    ●
                  </span>

                  Typing...
                </>
              ) : (
                <>
                  <span className="text-green-400">
                    ●
                  </span>

                  {status}
                </>
              )}
            </motion.p>

          </div>

        </div>

      </div>

      {/* Bottom Glass Glow */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-violet-300/40
          to-transparent
        "
      />

    </motion.header>
  );
}