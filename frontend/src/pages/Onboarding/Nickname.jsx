import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useOnboarding } from "../../context/OnboardingContext";
import AuthLayout from "../../components/layout/AuthLayout";
import Typography from "../../components/ui/Typography";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import spacing from "../../theme/spacing";

export default function Nickname() {
  const navigate = useNavigate();
  const { onboardingData, updateField } = useOnboarding();

  const [nickname, setNickname] = useState(onboardingData.nickname || "");
  const [showReply, setShowReply] = useState(false);

  useEffect(() => {
    if (!showReply) return undefined;

    const timeoutId = window.setTimeout(() => navigate("/gender"), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [showReply, navigate]);

  const handleContinue = (event) => {
    event?.preventDefault();
    const cleanedNickname = nickname.trim();
    if (!cleanedNickname || showReply) return;

    updateField("nickname", cleanedNickname);
    setNickname(cleanedNickname);
    setShowReply(true);
  };

  return (
    <AuthLayout size="md">
      {!showReply ? (
        <form onSubmit={handleContinue}>
          <div style={{ marginBottom: spacing.margin.xl }}>
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
              What should I call you?
            </Typography>

            <Typography
              variant="subtitle"
              align="center"
              animate
              style={{ maxWidth: 480, margin: "0 auto", lineHeight: 1.8 }}
            >
              This is the name I'll use whenever we talk ❤️
            </Typography>
          </div>

          <TextField
            label="Nickname"
            name="nickname"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="Enter your nickname"
            autoComplete="off"
            required
          />

          <div style={{ marginTop: spacing.margin.xl }}>
            <PrimaryButton type="submit" disabled={!nickname.trim()}>
              Continue →
            </PrimaryButton>
          </div>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="flex justify-center gap-2 mb-6" aria-label="Loading">
            {[0, 1, 2].map((item) => (
              <motion.div
                key={item}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: item * 0.15 }}
                className="w-3 h-3 rounded-full bg-[#CDBBFF]"
              />
            ))}
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
            Sure, {nickname} ❤️
          </Typography>

          <Typography variant="subtitle" align="center" style={{ marginTop: spacing.margin.md }}>
            This is how I'll address you every day.
          </Typography>
        </motion.div>
      )}
    </AuthLayout>
  );
}