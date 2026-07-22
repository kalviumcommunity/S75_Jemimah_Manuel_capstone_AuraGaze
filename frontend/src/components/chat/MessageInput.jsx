import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FiSend,
  FiSmile,
  FiPaperclip,
} from "react-icons/fi";

export default function MessageInput({ onSend }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "0px";

    textarea.style.height =
      Math.min(textarea.scrollHeight, 180) + "px";
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

  return (
    <div className="w-full">

      <div
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
          placeholder="Message Aura..."
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

        {/* Send */}

        <motion.button
          whileHover={{
            scale: 1.08,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={send}
          disabled={!message.trim()}
          className="
            shrink-0

            h-12
            w-12

            rounded-full

            flex
            items-center
            justify-center

            bg-gradient-to-r
            from-violet-500
            via-fuchsia-500
            to-purple-400

            text-white

            shadow-[0_0_30px_rgba(168,85,247,.55)]

            disabled:opacity-40
            disabled:cursor-not-allowed

            transition-all
          "
        >
          <FiSend size={18} />
        </motion.button>

      </div>

    </div>
  );
}