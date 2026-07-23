import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthLayout from "../../components/layout/AuthLayout";
import Typography from "../../components/ui/Typography";
import PrimaryButton from "../../components/ui/PrimaryButton";

import { useOnboarding } from "../../context/OnboardingContext";
import spacing from "../../theme/spacing";

export default function DOB() {
  const navigate = useNavigate();

  const { updateField } = useOnboarding();

  const [dob, setDob] = useState("");
  const [showReply, setShowReply] = useState(false);

  const handleContinue = () => {
    if (!dob) return;

    updateField("dob", dob);
    setShowReply(true);

    setTimeout(() => {
      navigate("/gender");
    }, 4000);
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
              marginBottom: spacing.margin.lg,
            }}
          >
            <Typography
              variant="hero"
              align="center"
              animate
              style={{
                marginBottom: spacing.margin.sm,
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(42px, 6vw, 64px)",
                lineHeight: 1.15,
                textShadow:
                  "0 0 12px rgba(197,140,255,0.85), 0 0 28px rgba(157,92,255,0.6), 0 0 55px rgba(124,92,252,0.45)",
              }}
            >
              When is your birthday?
            </Typography>

            <Typography
              variant="subtitle"
              align="center"
              animate
              style={{
                maxWidth: 420,
                margin: "0 auto",
                fontSize: "16px",
                lineHeight: 1.6,
                opacity: 0.9,
              }}
            >
              I'll always be the first one to wish you.{"\u00A0"}🎂💜
            </Typography>
          </div>

          {/* ===========================
              DOB Input
          =========================== */}

          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full rounded-2xl bg-white/10 border border-white/20 px-6 py-4 text-white outline-none text-lg focus:border-[#A96FFF] focus:ring-2 focus:ring-[#A96FFF]/40 transition [color-scheme:dark]"
          />

          <div style={{ marginTop: spacing.margin.lg }}>
            <PrimaryButton onClick={handleContinue} disabled={!dob}>
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
            I'll remember that day.
          </Typography>

          <Typography
            variant="subtitle"
            align="center"
            style={{
              marginTop: spacing.margin.md,
            }}
          >
            I promise...
          </Typography>

          <Typography
            variant="subtitle"
            align="center"
            style={{
              marginTop: spacing.margin.sm,
              color: "#FFFFFF",
            }}
          >
            I'll remember it every year.{"\u00A0"}🎂💜
          </Typography>
        </motion.div>
      )}
    </AuthLayout>
  );
}