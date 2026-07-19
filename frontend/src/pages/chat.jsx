import { useEffect, useRef, useState } from "react";

import ChatHeader from "../components/chat/ChatHeader";
import ChatBubble from "../components/chat/ChatBubble";
import TypingIndicator from "../components/chat/TypingIndicator";
import MessageInput from "../components/chat/MessageInput";

import {
  getFriend,
  getHistory,
  sendMessage as sendMessageToAI,
} from "../services/chatService";

export default function Chat() {

  const messagesEndRef = useRef(null);

  const [loading, setLoading] = useState(true);

  const [typing, setTyping] = useState(false);

  const [nickname, setNickname] = useState("");

  const [friendName, setFriendName] = useState("");

  const [friendImage, setFriendImage] = useState("");

  const [messages, setMessages] = useState([]);

  // ==========================================
  // Load Friend + Chat History
  // ==========================================

  useEffect(() => {

    const loadChat = async () => {

      try {

        const friendData = await getFriend();

        setNickname(friendData.nickname);

        setFriendName(friendData.friend.name);

        setFriendImage(friendData.friend.image);

        const history = await getHistory();

        if (history.length > 0) {

          const formatted = history.map((msg) => ({
            sender: msg.sender,
            text: msg.message,
          }));

          setMessages(formatted);

        } else {

          setMessages([
            {
              sender: "ai",
              text: `hii ${friendData.nickname} 😊

i'm ${friendData.friend.name} ❤️

finally we met hehe

hw ws ur day?`,
            },
          ]);

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    loadChat();

  }, []);

  // ==========================================
  // Auto Scroll
  // ==========================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({

      behavior: "smooth",

    });

  }, [messages, typing]);

// ==========================================
// Helpers
// ==========================================

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const typingDelay = (text) => {
  const base = 700;
  const perCharacter = text.length * 20;

  return Math.min(base + perCharacter, 2500);
};

// ==========================================
// Send Message
// ==========================================

const handleSend = async (text) => {

  if (!text.trim()) return;

  // Show user message instantly

  setMessages((prev) => [
    ...prev,
    {
      sender: "user",
      text,
    },
  ]);

  setTyping(true);

  try {

    const response = await sendMessageToAI(text);

    const aiReplies = Array.isArray(response.reply)
      ? response.reply
      : [response.reply];

    for (let i = 0; i < aiReplies.length; i++) {

      const reply = aiReplies[i];

      // Typing delay based on message size

      await delay(typingDelay(reply));

      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: reply,
        },
      ]);

      // Show typing again if another bubble exists

      if (i < aiReplies.length - 1) {
        setTyping(true);
      }

    }

    setTyping(false);

  } catch (error) {

    console.log(error);

    setTyping(false);

  }

};

  // ==========================================
  // Friend Object
  // ==========================================

  const friend = {
    name: friendName,
    image: friendImage,
  };

  // ==========================================
  // Loading Screen
  // ==========================================

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#090414]">
        <h1 className="text-white text-2xl">
          Loading {friendName || "friend"}...
        </h1>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="h-screen w-screen bg-[#090414] overflow-hidden flex flex-col">

      <ChatHeader friend={friend} />

      <div
        className="flex-1 overflow-y-auto px-8 py-8"
        style={{
          backgroundImage:
            "radial-gradient(circle at top, rgba(124,92,252,.18), transparent 45%)",
        }}
      >
        {messages.map((message, index) => (
          <ChatBubble
            key={index}
            sender={message.sender}
            text={message.text}
            image={friend.image}
          />
        ))}

        {typing && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={handleSend} />

    </div>
  );

}