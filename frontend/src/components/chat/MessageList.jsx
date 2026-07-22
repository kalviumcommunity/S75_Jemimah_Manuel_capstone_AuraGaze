import { motion } from "framer-motion";
import ChatBubble from "./ChatBubble";
import DateDivider from "./DateDivider";
import TypingIndicator from "./TypingIndicator";

const cleanMessageText = (rawText) => {
  if (typeof rawText !== "string") return rawText;
  return rawText.replace(/<msg>/gi, "").trim();
};

export default function MessageList({
  messages = [],
  friend,
  typing,
  messagesEndRef,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex flex-col"
    >
      <DateDivider label="Today" />

      {messages.map((message, index) => {
        const previous = messages[index - 1];
        const next = messages[index + 1];

        const isSameSenderAsPrev = previous?.sender === message.sender;
        const isSameSenderAsNext = next?.sender === message.sender;

        const showAvatar =
          message.sender === "ai" && (!isSameSenderAsNext || !next);

        return (
          <div
            key={index}
            className={`w-full ${
              isSameSenderAsPrev ? "mt-1" : "mt-3"
            }`}
          >
            <ChatBubble
              sender={message.sender}
              text={cleanMessageText(message.text)}
              image={showAvatar ? friend?.image : null}
              timestamp={message.timestamp}
              isGrouped={isSameSenderAsPrev}
            />
          </div>
        );
      })}

      {/* Typing Indicator */}
      {typing && (
        <div className="mt-3">
          <TypingIndicator />
        </div>
      )}

      <div ref={messagesEndRef} className="h-4" />
    </motion.div>
  );
}