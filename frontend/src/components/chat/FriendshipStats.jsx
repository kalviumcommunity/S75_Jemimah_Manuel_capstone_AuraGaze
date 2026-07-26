import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMessageCircle, FiCalendar, FiHeart, FiMic } from "react-icons/fi";

import colors from "../../theme/colors";
import spacing from "../../theme/spacing";

// ==========================================
// Count-Up Hook
// ==========================================
// Animates a number from 0 to its target value over a
// fixed duration using requestAnimationFrame, with an
// ease-out curve so the count settles smoothly rather
// than stopping abruptly.

function useCountUp(target = 0, duration = 1200, startDelay = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    let startTime;
    let timeoutId;

    const easeOutQuad = (t) => t * (2 - t);

    const tick = (now) => {
      if (!startTime) startTime = now;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setValue(Math.round(easeOutQuad(progress) * target));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    timeoutId = setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target, duration, startDelay]);

  return value;
}

// ==========================================
// Single Stat Card
// ==========================================

function StatCard({ icon: Icon, label, value, delay }) {
  const animatedValue = useCountUp(value, 1300, delay);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
      className="relative flex flex-col items-center text-center"
      style={{
        padding: spacing.padding.md,
        borderRadius: "20px",
        background: colors.card.glass,
        border: `1px solid ${colors.border.light}`,
      }}
    >
      {/* Soft icon glow behind the icon */}
      <div
        className="flex items-center justify-center rounded-full mb-2"
        style={{
          width: 40,
          height: 40,
          background: `radial-gradient(circle, ${colors.glow.violet}, transparent 70%)`,
        }}
      >
        <Icon size={18} style={{ color: colors.text.secondary }} />
      </div>

      <motion.span
        className="font-semibold"
        style={{
          fontSize: "26px",
          color: colors.text.primary,
          fontFamily: "'Playfair Display', serif",
        }}
      >
        {animatedValue.toLocaleString()}
      </motion.span>

      <span
        className="mt-1 text-[12px] tracking-wide"
        style={{ color: colors.text.muted }}
      >
        {label}
      </span>
    </motion.div>
  );
}

// ==========================================
// Friendship Stats Grid
// ==========================================

export default function FriendshipStats({
  messagesExchanged = 0,
  daysTogether = 0,
  memoriesCreated = 0,
  conversations = 0,
}) {
  const stats = [
    {
      icon: FiMessageCircle,
      label: "Messages Exchanged",
      value: messagesExchanged,
      delay: 0,
    },
    {
      icon: FiCalendar,
      label: "Days Together",
      value: daysTogether,
      delay: 100,
    },
    {
      icon: FiHeart,
      label: "Memories Created",
      value: memoriesCreated,
      delay: 200,
    },
    {
      icon: FiMic,
      label: "Conversations",
      value: conversations,
      delay: 300,
    },
  ];

  return (
    <div
      className="grid grid-cols-2 w-full"
      style={{ gap: spacing.gap.sm }}
    >
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}