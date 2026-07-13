import { useEffect, useRef, useState } from "react";

import ChatHeader from "../components/chat/ChatHeader";
import ChatBubble from "../components/chat/ChatBubble";
import TypingIndicator from "../components/chat/TypingIndicator";
import MessageInput from "../components/chat/MessageInput";

import { useOnboarding } from "../context/OnboardingContext";

export default function Chat() {

  const { onboardingData } = useOnboarding();

  const {
    nickname,
    friendName,
    friendImage,
  } = onboardingData;

  const messagesEndRef = useRef(null);

  const [typing, setTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `Hi ${nickname} 😊

I'm really happy you chose me.

I've been waiting to meet you.

How was your day? ❤️`,
    },
  ]);



  // ==========================
  // Auto Scroll
  // ==========================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({

      behavior: "smooth",

    });

  }, [messages, typing]);



  // ==========================
  // Send Message
  // ==========================

  const handleSend = (text) => {

    const newMessage = {

      sender: "user",

      text,

    };

    setMessages((prev) => [...prev, newMessage]);



    // AI Typing

    setTyping(true);



    setTimeout(() => {

      setTyping(false);



      const replies = [

        `Tell me more, ${nickname}. ❤️`,

        `I'm listening...`,

        `That must have been difficult.`,

        `You don't have to hide anything from me.`,

        `Thank you for telling me that.`,

        `How did that make you feel?`,

        `I love hearing about your day. 😊`,

        `I'm always here for you.`,

        `You're safe with me.`,

        `We'll figure everything out together. 💜`

      ];



      const randomReply =

        replies[

          Math.floor(

            Math.random() * replies.length

          )

        ];



      setMessages((prev) => [

        ...prev,

        {

          sender: "ai",

          text: randomReply,

        },

      ]);



    }, 1800);

  };

    // Friend Object
  const friend = {
    name: friendName,
    image: friendImage,
  };

  return (
    <div className="h-screen w-screen bg-[#090414] overflow-hidden flex flex-col">

      {/* Header */}
      <ChatHeader friend={friend} />

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-8 py-8 bg-cover bg-center"
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

      {/* Input */}
      <MessageInput onSend={handleSend} />
    </div>
  );
}