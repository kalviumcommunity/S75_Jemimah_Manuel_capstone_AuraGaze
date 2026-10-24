import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthLayout from "../../components/layout/AuthLayout";
import Typography from "../../components/ui/Typography";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { useOnboarding } from "../../context/OnboardingContext";
import spacing from "../../theme/spacing";

function getTodayLocalDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export default function DOB() {
  const navigate = useNavigate();
  const { onboardingData, updateField } = useOnboarding();

  const [dob, setDob] = useState(onboardingData.dob || "");
  const [showReply, setShowReply] = useState(false);
  const todayString = getTodayLocalDate();

  useEffect(() => {
    if (!showReply) return undefined;

    const timeoutId = window.setTimeout(() => navigate("/age"), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [showReply, navigate]);

  const handleContinue = (event) => {
    event?.preventDefault();
    if (!dob || dob > todayString || showReply) return;

    updateField("dob", dob);
    setShowReply(true);
  };

  return (
    <AuthLayout size="md">
      {!showReply ? (
        <form onSubmit={handleContinue}>
          <div style={{ marginBottom: spacing.margin.lg }}>
            <Typography
              variant="hero"
              align="center"
              animate
              style={{
                marginBottom: spacing.margin.sm,
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(34px, 5vw, 52px)",
                lineHeight: 1.2,
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
              style={{ maxWidth: 420, margin: "0 auto", fontSize: 16, lineHeight: 1.6, opacity: 0.9 }}
            >
              I'll always be the first one to wish you. 🎂💜
            </Typography>
          </div>

          <label htmlFor="user-dob" className="sr-only">
            Your birthday
          </label>
          <input
            id="user-dob"
            name="dob"
            type="date"
            value={dob}
            max={todayString}
            onChange={(event) => setDob(event.target.value)}
            required
            className="w-full rounded-2xl bg-white/10 border border-white/20 px-6 py-4 text-white outline-none text-lg focus:border-[#A96FFF] focus:ring-2 focus:ring-[#A96FFF]/40 transition [color-scheme:dark]"
          />

          <div style={{ marginTop: spacing.margin.lg }}>
            <PrimaryButton type="submit" disabled={!dob || dob > todayString}>
              Continue →
            </PrimaryButton>
          </div>
        </form>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
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
            I'll remember that day.
          </Typography>
          <Typography variant="subtitle" align="center" style={{ marginTop: spacing.margin.md }}>
            I promise...
          </Typography>
          <Typography variant="subtitle" align="center" style={{ marginTop: spacing.margin.sm, color: "#FFFFFF" }}>
            I'll remember it every year. 🎂💜
          </Typography>
        </motion.div>
      )}
    </AuthLayout>
  );
}
