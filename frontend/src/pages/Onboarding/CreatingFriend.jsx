import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout";
import Typography from "../../components/ui/Typography";

import spacing from "../../theme/spacing";

export default function CreatingFriend() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);

  const [message, setMessage] = useState("Preparing personality...");

  useEffect(() => {
    const messages = [
      "Preparing personality...",
      "Learning your name...",
      "Creating memories...",
      "Giving your friend a heart...",
      "Almost ready...",
    ];

    let index = 0;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;

        if (next >= 20 && next < 40) setMessage(messages[1]);
        if (next >= 40 && next < 60) setMessage(messages[2]);
        if (next >= 60 && next < 80) setMessage(messages[3]);
        if (next >= 80) setMessage(messages[4]);

        if (next >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            navigate("/chat");
          }, 700);

          return 100;
        }

        return next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthLayout size="md">
      {/* ===========================
          Hero Section
      =========================== */}

      <motion.div
        animate={{
          opacity: [1, 0.5, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        style={{
          marginBottom: spacing.margin.lg,
        }}
      >
        <Typography
          variant="hero"
          align="center"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            lineHeight: 1.2,
            textShadow:
              "0 0 12px rgba(197,140,255,0.85), 0 0 28px rgba(157,92,255,0.6), 0 0 55px rgba(124,92,252,0.45)",
          }}
        >
          ✨ Creating Your Best Friend
        </Typography>
      </motion.div>

      <Typography
        variant="subtitle"
        align="center"
        style={{
          fontSize: "16px",
          opacity: 0.9,
        }}
      >
        {message}
      </Typography>

      {/* ===========================
          Progress Bar
      =========================== */}

      <div
        className="h-4 rounded-full bg-white/10 overflow-hidden"
        style={{ marginTop: spacing.margin.xl }}
      >
        <motion.div
          animate={{
            width: `${progress}%`,
          }}
          className="h-full rounded-full bg-gradient-to-r from-[#8E63FF] to-[#C58CFF]"
        />
      </div>

      <Typography
        variant="subtitle"
        align="center"
        style={{
          marginTop: spacing.margin.sm,
          color: "#FFFFFF",
          fontSize: "18px",
        }}
      >
        {progress}%
      </Typography>
    </AuthLayout>
  );
}