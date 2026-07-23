import { motion } from "framer-motion";
import { FiArrowLeft, FiUser, FiHeart } from "react-icons/fi";

export default function ChatHeader({
  friend,
  status = "Online",
  isTyping = false,
  mood = "Waiting for you",
  friendshipLevel = "Best Friend",
  onBack,
}) {
  const friendName = friend?.name?.trim() || "Friend";
  const friendImage = friend?.image?.trim() || "";

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
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
          h-28
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
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
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
            {/* Ambient glow */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.5, 0.9, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="
                absolute
                inset-0
                rounded-full
                bg-violet-500/30
                blur-xl
              "
            />

            {/* Floating avatar — a slow, barely-there breathing
                motion that reads as "alive" without being distracting */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              {friendImage ? (
                <img
                  src={friendImage}
                  alt={friendName}
                  onError={(e) => {
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
            </motion.div>

            {/* Online Indicator — pulsing ring behind a solid dot */}
            <div className="absolute bottom-1 right-1">
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-green-400"
              />
              <div className="relative w-4 h-4 rounded-full bg-green-400 border-2 border-[#140E22]" />
            </div>
          </div>

          {/* Friend Details */}
          <div>
            <div className="flex items-center gap-2">
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="text-white text-2xl font-semibold tracking-wide"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {friendName}
              </motion.h2>

              {/* Friendship level pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="
                  flex
                  items-center
                  gap-1
                  px-2.5
                  py-1
                  rounded-full
                  bg-violet-500/15
                  border
                  border-violet-400/30
                "
              >
                <FiHeart size={11} className="text-pink-300" />
                <span className="text-[11px] font-medium text-violet-200 tracking-wide">
                  {friendshipLevel}
                </span>
              </motion.div>
            </div>

            {/* Status line — typing takes priority, then mood */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-1.5 text-sm text-violet-200 flex items-center gap-2"
            >
              {isTyping ? (
                <>
                  <span className="flex gap-0.5">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: dot * 0.15,
                        }}
                        className="w-1 h-1 rounded-full bg-violet-300"
                      />
                    ))}
                  </span>
                  typing...
                </>
              ) : (
                <>
                  <span className="text-green-400">●</span>
                  {status} · {mood}
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