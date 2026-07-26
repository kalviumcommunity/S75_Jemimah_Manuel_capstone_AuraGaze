import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiSmile, FiPaperclip } from "react-icons/fi";

export default function MessageInput({ onSend }) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const textareaRef = useRef(null);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = Math.min(textarea.scrollHeight, 180) + "px";
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    resizeTextarea();
  };

  const send = () => {
    const text = message.trim();
    if (!text) return;

    onSend(text);
    setMessage("");

    // Trigger a fresh particle burst — bumping the key remounts
    // the particle layer so the animation replays every send,
    // rather than only firing once.
    setBurstKey((k) => k + 1);

    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const hasText = message.trim().length > 0;

  return (
    <div className="w-full">
      <motion.div
        animate={{
          boxShadow: isFocused
            ? "0 0 0 1px rgba(168,85,247,.35), 0 0 30px rgba(168,85,247,.25)"
            : "0 0 0 1px rgba(255,255,255,0), 0 0 0px rgba(168,85,247,0)",
        }}
        transition={{ duration: 0.3 }}
        className="
          flex
          items-center
          gap-3

          px-4
          py-3

          rounded-[28px]

          border
          border-white/10

          bg-white/[0.05]

          backdrop-blur-2xl
        "
      >
        {/* Emoji */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          className="
            shrink-0
            h-10
            w-10
            rounded-full
            flex
            items-center
            justify-center
            text-white/60
            hover:bg-white/10
            hover:text-violet-300
            transition-all
          "
        >
          <FiSmile size={20} />
        </motion.button>

        {/* Attachment */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          className="
            shrink-0
            h-10
            w-10
            rounded-full
            flex
            items-center
            justify-center
            text-white/60
            hover:bg-white/10
            hover:text-violet-300
            transition-all
          "
        >
          <FiPaperclip size={20} />
        </motion.button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Message Sarah..."
          className="
            flex-1
            bg-transparent
            resize-none
            outline-none
            text-white
            placeholder:text-white/40
            leading-7
            py-3
            min-h-[48px]
            max-h-[180px]
            overflow-y-auto
          "
        />

        {/* Send Button */}
        <div className="relative shrink-0">
          {/* Particle burst — a handful of small dots that fly
              outward and fade, replayed on every send via burstKey */}
          <AnimatePresence>
            {burstKey > 0 && (
              <ParticleBurst key={burstKey} />
            )}
          </AnimatePresence>

          <motion.button
            whileHover={
              hasText
                ? {
                    scale: 1.08,
                    boxShadow: "0 0 40px rgba(168,85,247,.75)",
                  }
                : {}
            }
            whileTap={hasText ? { scale: 0.9 } : {}}
            onClick={send}
            disabled={!message.trim()}
            className="
              relative
              h-12
              w-12
              rounded-full
              flex
              items-center
              justify-center
              overflow-hidden
              bg-gradient-to-r
              from-violet-500
              via-fuchsia-500
              to-purple-400
              text-white
              shadow-[0_0_30px_rgba(168,85,247,.55)]
              disabled:opacity-40
              disabled:cursor-not-allowed
              transition-shadow
            "
          >
            {/* Ripple — expands and fades on every click */}
            <AnimatePresence>
              {hasText && (
                <motion.span
                  key={burstKey}
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-white/40 pointer-events-none"
                />
              )}
            </AnimatePresence>

            <FiSend size={18} className="relative z-10" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// Particle Burst
// ============================================================
// A small ring of dots that shoot outward from the send button
// and fade — fires once per mount, so remounting via a changing
// key (see burstKey above) replays it on every send.

function ParticleBurst() {
  const particles = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    return {
      id: i,
      x: Math.cos(angle) * 26,
      y: Math.sin(angle) * 26,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-violet-300 shadow-[0_0_8px_rgba(196,160,255,.9)]"
          style={{ marginLeft: -3, marginTop: -3 }}
        />
      ))}
    </div>
  );
}