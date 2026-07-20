import { FiSend } from "react-icons/fi";
import { useState } from "react";

export default function MessageInput({ onSend }) {

  const [message, setMessage] = useState("");

  const send = () => {

    if (!message.trim()) return;

    onSend(message);

    setMessage("");

  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="w-full flex gap-4 p-5 border-t border-white/10 backdrop-blur-xl bg-white/5">

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type something..."
        className="flex-1 rounded-full px-6 py-4 bg-white/10 text-white outline-none placeholder:text-white/40"
      />

      <button
        onClick={send}
        className="w-14 h-14 rounded-full bg-[#9A5DFF] text-white flex items-center justify-center hover:scale-110 transition"
      >
        <FiSend />
      </button>

    </div>
  );
}