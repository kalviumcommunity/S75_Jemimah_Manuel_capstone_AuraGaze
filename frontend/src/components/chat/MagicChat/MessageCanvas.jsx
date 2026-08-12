import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import ScrollMessage from "./ScrollMessage";
import useScrollCollision from "../../../hooks/useScrollCollision";
import colors from "../../../theme/colors";

export default function MessageCanvas({
  messages = [],
  friend,
  typing = false,
  scrollContainerRef,
  messagesEndRef,
}) {
  const [containerWidth, setContainerWidth] = useState(760);

  useEffect(() => {
    const el = scrollContainerRef?.current;
    if (!el) return;

    const measure = () => setContainerWidth(el.clientWidth || 760);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => observer.disconnect();
  }, [scrollContainerRef]);

  const { positions, totalHeight } = useScrollCollision({
    messages,
    containerWidth: Math.max(containerWidth - 32, 280),
  });

  const positionMap = new Map(positions.map((p) => [p.id, p]));

  return (
    <div
      ref={scrollContainerRef}
      className="
        relative
        w-full
        h-full
        overflow-y-auto
        overflow-x-hidden
        scroll-smooth
        px-4
        py-6
        scrollbar-thin
        scrollbar-track-transparent
        scrollbar-thumb-white/10
      "
    >
      <div
        className="relative w-full mx-auto"
        style={{ maxWidth: 720, minHeight: totalHeight }}
      >
        {messages.map((message) => {
          const pos = positionMap.get(message.id ?? "");
          if (!pos) return null;

          return (
            <ScrollMessage
              key={message.id ?? `${pos.x}-${pos.y}`}
              id={message.id}
              sender={message.sender}
              text={message.text}
              image={friend?.image}
              attachments={message.attachments}
              timestamp={message.timestamp}
              x={pos.x}
              y={pos.y}
              rotate={pos.rotate}
              width={pos.width}
            />
          );
        })}

        {typing && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              top: Math.max(totalHeight - 40, 0),
              background: colors.card.glass,
              border: `1px solid ${colors.border.light}`,
              backdropFilter: "blur(12px)",
            }}
          >
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: dot * 0.16 }}
                className="w-2 h-2 rounded-full"
                style={{ background: colors.brand.lavender }}
              />
            ))}
          </motion.div>
        )}

        <div
          ref={messagesEndRef}
          style={{
            position: "absolute",
            top: totalHeight,
            left: 0,
            height: 1,
            width: 1,
          }}
        />
      </div>
    </div>
  );
}