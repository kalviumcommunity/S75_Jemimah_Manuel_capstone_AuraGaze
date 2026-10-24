import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useOnboarding } from "../../context/OnboardingContext";
import AuthLayout from "../../components/layout/AuthLayout";
import Typography from "../../components/ui/Typography";
import PrimaryButton from "../../components/ui/PrimaryButton";
import spacing from "../../theme/spacing";

// The current backend and companion image filter use a numeric age.
// These representative values keep the existing API contract working:
// 10 = 6–15, 30 = 20–40, and 55 = 40–70.
const AGE_OPTIONS = [
  {
    id: "school",
    label: "6–15 years",
    description: "A young, school-age companion",
    savedAge: 10,
  },
  {
    id: "youngAdult",
    label: "20–40 years",
    description: "A young adult companion",
    savedAge: 30,
  },
  {
    id: "mature",
    label: "40–70 years",
    description: "A mature companion",
    savedAge: 55,
  },
];

function getInitialOption(savedAgeValue) {
  const savedAge = Number(savedAgeValue);
  if (savedAge >= 6 && savedAge <= 15) return "school";
  if (savedAge >= 40) return "mature";
  return "youngAdult";
}

export default function Age() {
  const navigate = useNavigate();
  const { onboardingData, updateField } = useOnboarding();

  const [selectedRange, setSelectedRange] = useState(() =>
    getInitialOption(onboardingData.age)
  );
  const [showReply, setShowReply] = useState(false);

  const handleContinue = (rangeToUse = selectedRange) => {
    if (showReply) return;

    const selectedOption = AGE_OPTIONS.find((option) => option.id === rangeToUse);
    if (!selectedOption) return;

    setSelectedRange(selectedOption.id);
    updateField("age", selectedOption.savedAge);
    setShowReply(true);
  };

  useEffect(() => {
    if (showReply) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const currentIndex = AGE_OPTIONS.findIndex((option) => option.id === selectedRange);
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const nextIndex = (currentIndex + direction + AGE_OPTIONS.length) % AGE_OPTIONS.length;
        const nextRange = AGE_OPTIONS[nextIndex].id;
        setSelectedRange(nextRange);
        window.requestAnimationFrame(() => {
          document.querySelector(`[data-age-option="${nextRange}"]`)?.focus();
        });
        return;
      }

      if (event.key !== "Enter" || event.repeat) return;

      const target = event.target;
      if (target instanceof HTMLElement && target.closest(".onboarding-continue")) {
        return; // The Continue button's native Enter activation handles this.
      }

      const optionButton =
        target instanceof HTMLElement ? target.closest("[data-age-option]") : null;
      if (optionButton) {
        event.preventDefault();
        handleContinue(optionButton.dataset.ageOption);
        return;
      }

      event.preventDefault();
      handleContinue();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRange, showReply]);

  useEffect(() => {
    if (!showReply) return undefined;

    const timeoutId = window.setTimeout(() => navigate("/friend-selection"), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [showReply, navigate]);

  return (
    <AuthLayout size="md">
      {!showReply ? (
        <div>
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
              What age range should your best friend be in?
            </Typography>
            <Typography
              variant="subtitle"
              align="center"
              animate
              style={{ maxWidth: 480, margin: "0 auto", lineHeight: 1.8 }}
            >
              Choose the age range that feels right for your companion. 💜
            </Typography>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="group" aria-label="Companion age range">
            {AGE_OPTIONS.map((option) => {
              const isSelected = selectedRange === option.id;

              return (
                <motion.button
                  key={option.id}
                  type="button"
                  data-age-option={option.id}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRange(option.id)}
                  aria-pressed={isSelected}
                  className={`rounded-2xl border p-5 text-center transition-all duration-300 min-h-[145px] ${
                    isSelected
                      ? "border-[#D5B3FF] bg-violet-500/25 shadow-[0_0_30px_rgba(197,140,255,0.35)]"
                      : "border-white/15 bg-white/[0.06] hover:border-violet-300/50"
                  }`}
                >
                  <span className="block text-xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {option.label}
                  </span>
                  <span className="mt-3 block text-sm leading-relaxed text-white/70">
                    {option.description}
                  </span>
                  {isSelected && (
                    <span className="mt-3 inline-block text-sm text-[#DCC2FF]">✓ Selected</span>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div style={{ marginTop: spacing.margin.xl }}>
            <PrimaryButton
              className="onboarding-continue"
              onClick={() => handleContinue()}
            >
              Continue →
            </PrimaryButton>
          </div>
        </div>
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
            A perfect fit 💜
          </Typography>
          <Typography variant="subtitle" align="center" style={{ marginTop: spacing.margin.md }}>
            Let's find your best friend's look.
          </Typography>
        </motion.div>
      )}
    </AuthLayout>
  );
}
