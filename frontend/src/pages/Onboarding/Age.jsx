import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useOnboarding } from "../../context/OnboardingContext";

import AuthLayout from "../../components/layout/AuthLayout";
import Typography from "../../components/ui/Typography";
import PrimaryButton from "../../components/ui/PrimaryButton";

import spacing from "../../theme/spacing";

export default function Age() {
  const navigate = useNavigate();
  const { updateField } = useOnboarding();

  const [age, setAge] = useState(24);
  const [showReply, setShowReply] = useState(false);

  const handleContinue = () => {
    updateField("age", age);

    setShowReply(true);

    setTimeout(() => {
      navigate("/friend-selection");
    }, 3500);
  };

  return (
    <AuthLayout size="md">
      {!showReply ? (
        <>
          {/* ===========================
              Hero Section
          =========================== */}

          <div
            style={{
              marginBottom: spacing.margin.xl,
            }}
          >
            <Typography
              variant="hero"
              align="center"
              animate
              style={{
                marginBottom: spacing.margin.md,
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 40px)",
                lineHeight: 1.3,
                textShadow:
                  "0 0 12px rgba(197,140,255,0.85), 0 0 28px rgba(157,92,255,0.6), 0 0 55px rgba(124,92,252,0.45)",
              }}
            >
              How old would you like me to be?
            </Typography>

            <Typography
              variant="subtitle"
              align="center"
              animate
              style={{
                maxWidth: 480,
                margin: "0 auto",
                lineHeight: 1.8,
              }}
            >
              Choose the age that feels most comfortable to you.{"\u00A0"}💜
            </Typography>
          </div>

          {/* ===========================
              Age Slider
          =========================== */}

          <div className="flex flex-col items-center">
            <motion.h1
  key={age}
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.25 }}
  className="text-7xl font-bold text-white"
  style={{
    fontFamily: "'Playfair Display', serif",
    textShadow:
      "0 0 12px rgba(197,140,255,0.85), 0 0 28px rgba(157,92,255,0.6), 0 0 55px rgba(124,92,252,0.45)",
    marginBottom: spacing.margin.xl,
  }}
>
  {age}
</motion.h1>

            <input
              type="range"
              min="6"
              max="70"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full accent-[#B17DFF] cursor-pointer"
            />

            <div className="flex justify-between w-full mt-2 text-white/60">
              <span>6</span>
              <span>70</span>
            </div>
          </div>

          <div style={{ marginTop: spacing.margin.xl }}>
            <PrimaryButton onClick={handleContinue}>
              Continue →
            </PrimaryButton>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="flex justify-center gap-2 mb-6">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="w-3 h-3 rounded-full bg-[#CDBBFF]"
            />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
              className="w-3 h-3 rounded-full bg-[#CDBBFF]"
            />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
              className="w-3 h-3 rounded-full bg-[#CDBBFF]"
            />
          </div>

          <Typography
            variant="hero"
            align="center"
            style={{
              fontFamily: "'Playfair Display', serif",
              textShadow:
                "0 0 12px rgba(197,140,255,0.85), 0 0 28px rgba(157,92,255,0.6), 0 0 55px rgba(124,92,252,0.45)",
            }}
          >
            {age}...
          </Typography>

          <Typography
            variant="subtitle"
            align="center"
            style={{
              marginTop: spacing.margin.md,
            }}
          >
            Perfect.
          </Typography>

          <Typography
            variant="subtitle"
            align="center"
            style={{
              marginTop: spacing.margin.sm,
            }}
          >
            I'll always be just the age you imagined me to be.{"\u00A0"}💜
          </Typography>
        </motion.div>
      )}
    </AuthLayout>
  );
}