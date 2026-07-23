import { useEffect, useRef, useState } from "react";

import ChatLayout from "../components/layout/ChatLayout";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import ErrorBoundary from "../components/ErrorBoundary";

import {
  getFriend,
  getHistory,
  sendMessage as sendMessageToAI,
} from "../services/chatService";

export default function Chat() {
  const messagesEndRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [typing, setTyping] = useState(false);

  const [friend, setFriend] = useState({
    name: "",
    image: "",
  });

  const [nickname, setNickname] = useState("");

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    loadChat();
  }, []);

  const loadChat = async () => {
    try {
      setLoading(true);

      const friendData = await getFriend();

      setNickname(friendData?.nickname || "");

      setFriend({
        name: friendData?.friend?.name || "Friend",
        image: friendData?.friend?.image || "",
      });

      const history = await getHistory();

      const formatted = (history || []).map((msg) => ({
        sender: msg.sender,
        text: msg.message,
        timestamp: msg.createdAt || new Date().toISOString(),
      }));

      setMessages(formatted);
    } catch (err) {
      console.error(err);

      setLoadError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load chat."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, typing]);

  const wait = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // ============================================================
  // Timing helpers
  // ============================================================
  // First bubble gets a genuine "thinking" pause that scales with
  // reply length (longer thought = longer pause), capped so it
  // never feels sluggish. Every bubble after that uses a short,
  // mostly-fixed beat with a little randomness so a burst of
  // short replies reads as quick natural typing rather than a
  // metronome.

  const thinkingDelay = (text = "") =>
    Math.min(700 + text.length * 18, 2000);

  const quickBeatDelay = () =>
    400 + Math.floor(Math.random() * 200); // 400–600ms

  // ============================================================
  // Send Message
  // ============================================================

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTyping(true);

    try {
      const response = await sendMessageToAI(text);

      const replies = Array.isArray(response.reply)
        ? response.reply
        : [response.reply];

      for (let i = 0; i < replies.length; i++) {
        const reply = replies[i];

        const delay = i === 0 ? thinkingDelay(reply) : quickBeatDelay();

        await wait(delay);

        setTyping(false);

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: reply,
            timestamp: new Date().toISOString(),
          },
        ]);

        if (i < replies.length - 1) {
          setTyping(true);
        }
      }
    } catch (err) {
      console.error(err);

      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry 😭 Something went wrong. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    setTyping(false);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#090414]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-white/80 text-lg">
            Loading your conversation...
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-screen bg-[#090414] flex items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center">
          <h1 className="text-2xl text-white font-semibold mb-3">
            Couldn't load chat
          </h1>

          <p className="text-white/60">
            {loadError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ChatLayout
        header={
          <ChatHeader
            friend={friend}
            nickname={nickname}
            isTyping={typing}
          />
        }
        input={
          <MessageInput
            onSend={handleSend}
          />
        }
      >
        <MessageList
          messages={messages}
          friend={friend}
          typing={typing}
          messagesEndRef={messagesEndRef}
        />
      </ChatLayout>
    </ErrorBoundary>
  );
}