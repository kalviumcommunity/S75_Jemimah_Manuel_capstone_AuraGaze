import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiSmile, FiPaperclip, FiX, FiFile } from "react-icons/fi";
import AttachmentMenu from "./AttachmentMenu";
import EmojiPicker from "./EmojiPicker";
import PreviewModal from "./PreviewModal";

export default function MessageInput({ onSend }) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  // ------------------------------------------------------------
  // Part 1 additions: popover + staged attachment state
  // ------------------------------------------------------------
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [previewAttachment, setPreviewAttachment] = useState(null);

  const textareaRef = useRef(null);

  const emojiBtnRef = useRef(null);
  const emojiPopoverRef = useRef(null);
  const attachBtnRef = useRef(null);
  const attachPopoverRef = useRef(null);

  // Close whichever popover is open when the user clicks outside
  // of both the popover itself and the button that opened it.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showEmojiPicker &&
        !emojiPopoverRef.current?.contains(e.target) &&
        !emojiBtnRef.current?.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }

      if (
        showAttachmentMenu &&
        !attachPopoverRef.current?.contains(e.target) &&
        !attachBtnRef.current?.contains(e.target)
      ) {
        setShowAttachmentMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker, showAttachmentMenu]);

  // Note (Part 7): staged attachments' object URLs are no longer
  // revoked here on unmount — ownership passes to Chat.jsx's
  // optimistic message once send() fires, since that's what keeps
  // rendering the preview after this component clears its own
  // staged list. removeAttachment() still revokes properly for
  // anything the user removes before sending.

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

  // ------------------------------------------------------------
  // Emoji picker
  // ------------------------------------------------------------
  // TODO (Part 3): replace the "Quick reactions" grid below with
  // <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
  // — this handler already inserts at the cursor correctly, so
  // Part 3 only needs to swap the rendered content.
  const handleEmojiSelect = (emoji) => {
    const textarea = textareaRef.current;

    if (!textarea) {
      setMessage((prev) => prev + emoji);
      return;
    }

    const start = textarea.selectionStart ?? message.length;
    const end = textarea.selectionEnd ?? message.length;
    const next = message.slice(0, start) + emoji + message.slice(end);

    setMessage(next);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + emoji.length;
      textarea.setSelectionRange(cursor, cursor);
      resizeTextarea();
    });
  };

  // ------------------------------------------------------------
  // Attachments
  // ------------------------------------------------------------
  // TODO (Part 2): replace the "Choose a file" button below with
  // <AttachmentMenu onFilesSelected={handleFilesSelected} onClose={() => setShowAttachmentMenu(false)} />
  // (camera / gallery / document options) — this handler already
  // stages files and builds image previews correctly.
  const handleFilesSelected = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const staged = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));

    setAttachments((prev) => [...prev, ...staged]);
    setShowAttachmentMenu(false);
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((a) => a.id !== id);
    });
  };

  const send = () => {
    const text = message.trim();
    if (!text && attachments.length === 0) return;

    // Part 7: onSend now receives the staged attachments too, so
    // Chat.jsx can upload the raw files and render an optimistic
    // preview immediately using the same preview URLs.
    onSend(text, attachments);

    setMessage("");
    setAttachments([]);

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
  const hasContent = hasText || attachments.length > 0;

  return (
    <div className="w-full">
      {/* Staged attachment previews */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 overflow-x-auto px-2 pb-3"
          >
            {attachments.map((a) => (
              <div
                key={a.id}
                onClick={() => setPreviewAttachment(a)}
                role="button"
                tabIndex={0}
                className="
                  relative
                  shrink-0
                  h-16
                  w-16
                  rounded-2xl
                  overflow-hidden
                  border
                  border-white/15
                  bg-white/[0.06]
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  hover:border-violet-400/40
                  transition-colors
                "
              >
                {a.previewUrl ? (
                  <img src={a.previewUrl} alt={a.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1 px-1">
                    <FiFile size={18} className="text-violet-300" />
                    <span className="text-[9px] text-white/60 truncate max-w-[52px]">
                      {a.name}
                    </span>
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAttachment(a.id);
                  }}
                  className="
                    absolute
                    top-1
                    right-1
                    h-5
                    w-5
                    rounded-full
                    bg-black/60
                    flex
                    items-center
                    justify-center
                    text-white
                    hover:bg-black/80
                    transition-colors
                  "
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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
        <div className="relative shrink-0">
          <motion.button
            ref={emojiBtnRef}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setShowEmojiPicker((v) => !v);
              setShowAttachmentMenu(false);
            }}
            className={`
              h-10
              w-10
              rounded-full
              flex
              items-center
              justify-center
              transition-all
              ${
                showEmojiPicker
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-white/60 hover:bg-white/10 hover:text-violet-300"
              }
            `}
          >
            <FiSmile size={20} />
          </motion.button>

          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                ref={emojiPopoverRef}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="
                  absolute
                  bottom-full
                  left-0
                  mb-3
                  rounded-3xl
                  border
                  border-white/10
                  bg-[#150b28]/95
                  backdrop-blur-2xl
                  p-3
                  shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                  z-20
                "
              >
                <EmojiPicker
                  onSelect={handleEmojiSelect}
                  onClose={() => setShowEmojiPicker(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Attachment */}
        <div className="relative shrink-0">
          <motion.button
            ref={attachBtnRef}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setShowAttachmentMenu((v) => !v);
              setShowEmojiPicker(false);
            }}
            className={`
              h-10
              w-10
              rounded-full
              flex
              items-center
              justify-center
              transition-all
              ${
                showAttachmentMenu
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-white/60 hover:bg-white/10 hover:text-violet-300"
              }
            `}
          >
            <FiPaperclip size={20} />
          </motion.button>

          <AnimatePresence>
            {showAttachmentMenu && (
              <motion.div
                ref={attachPopoverRef}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="
                  absolute
                  bottom-full
                  left-0
                  mb-3
                  w-56
                  rounded-3xl
                  border
                  border-white/10
                  bg-[#150b28]/95
                  backdrop-blur-2xl
                  p-3
                  shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                  z-20
                "
              >
                <AttachmentMenu
                  onFilesSelected={handleFilesSelected}
                  onClose={() => setShowAttachmentMenu(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
              hasContent
                ? {
                    scale: 1.08,
                    boxShadow: "0 0 40px rgba(168,85,247,.75)",
                  }
                : {}
            }
            whileTap={hasContent ? { scale: 0.9 } : {}}
            onClick={send}
            disabled={!hasContent}
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
              {hasContent && (
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

      <PreviewModal
        attachment={previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        onRemove={removeAttachment}
      />
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