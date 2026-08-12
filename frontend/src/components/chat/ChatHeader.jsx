import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiHeart,
  FiTrash2,
  FiPlusCircle,
  FiCheckSquare,
  FiX,
} from "react-icons/fi";

import Avatar from "../ui/Avatar";

export default function ChatHeader({
  friend,
  status = "Online",
  isTyping = false,
  mood = "Waiting for you",
  friendshipLevel = "Best Friend",
  onBack,
  onAvatarClick,
  onClearChat,
  onNewChat,
  isSelectionMode = false,
  onToggleSelectionMode,
  selectedCount = 0,
  onDeleteSelected,
  onCancelSelection,
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
    w-full
    h-28
    px-8
    flex
    items-center
    justify-between
    gap-4
  "
>
        {/* ===============================
            LEFT
        ================================ */}

        <div className="flex items-center gap-5 min-w-0">
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
              shrink-0
            "
          >
            <FiArrowLeft size={22} />
          </motion.button>

          {/* Avatar */}
          <Avatar
            src={friendImage}
            name={friendName}
            size="sm"
            online
            floating
            breathingBorder
            shine
            glow
            onClick={onAvatarClick}
          />

          {/* Friend Details */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="text-white text-2xl font-semibold tracking-wide truncate"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {friendName}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="
                  hidden
                  sm:flex
                  items-center
                  gap-1
                  px-2.5
                  py-1
                  rounded-full
                  bg-violet-500/15
                  border
                  border-violet-400/30
                  shrink-0
                "
              >
                <FiHeart size={11} className="text-pink-300" />
                <span className="text-[11px] font-medium text-violet-200 tracking-wide">
                  {friendshipLevel}
                </span>
              </motion.div>
            </div>

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

        {/* ===============================
            RIGHT
        ================================ */}

        <div className="flex items-center gap-2 shrink-0">
          {isSelectionMode ? (
            <>
              <span className="hidden sm:inline text-sm text-white/60 mr-1 whitespace-nowrap">
                {selectedCount} selected
              </span>

              <motion.button
                whileHover={{ scale: selectedCount ? 1.05 : 1 }}
                whileTap={{ scale: selectedCount ? 0.95 : 1 }}
                onClick={onDeleteSelected}
                disabled={!selectedCount}
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  h-11
                  rounded-full
                  text-sm
                  font-medium
                  transition-all
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
                style={{
                  background: "rgba(248,113,113,.15)",
                  border: "1px solid rgba(248,113,113,.35)",
                  color: "#F87171",
                }}
              >
                <FiTrash2 size={16} />
                <span className="hidden sm:inline">Delete</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCancelSelection}
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-white/5
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                  text-white
                  hover:bg-white/10
                  transition-all
                "
              >
                <FiX size={18} />
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClearChat}
                title="Clear chat"
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-white/5
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                  text-white/70
                  transition-all
                  hover:bg-white/10
                  hover:text-red-300
                  hover:border-red-400/30
                "
              >
                <FiTrash2 size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNewChat}
                title="New chat"
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-white/5
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                  text-white/70
                  transition-all
                  hover:bg-white/10
                  hover:text-violet-300
                  hover:border-violet-400/30
                "
              >
                <FiPlusCircle size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleSelectionMode}
                title="Select messages"
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-white/5
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                  text-white/70
                  transition-all
                  hover:bg-white/10
                  hover:text-violet-300
                  hover:border-violet-400/30
                "
              >
                <FiCheckSquare size={18} />
              </motion.button>
            </>
          )}
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