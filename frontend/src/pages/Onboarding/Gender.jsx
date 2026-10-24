import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import femaleImg from "../../assets/images/gender/female.png";
import maleImg from "../../assets/images/gender/male.png";

import AuthLayout from "../../components/layout/AuthLayout";
import Typography from "../../components/ui/Typography";
import PrimaryButton from "../../components/ui/PrimaryButton";

import { useOnboarding } from "../../context/OnboardingContext";
import spacing from "../../theme/spacing";

export default function Gender() {
  const navigate = useNavigate();
  const { onboardingData, updateField } = useOnboarding();

  const [gender, setGender] = useState(onboardingData.gender || "");
  const [showReply, setShowReply] = useState(false);

  const handleContinue = () => {
    if (!gender || showReply) return;
    updateField("gender", gender);
    setShowReply(true);
  };

  useEffect(() => {
    if (showReply) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const nextGender = event.key === "ArrowLeft" ? "female" : "male";
        setGender(nextGender);
        window.requestAnimationFrame(() => {
          document.querySelector(`[data-gender-option="${nextGender}"]`)?.focus();
        });
        return;
      }

      if (event.key !== "Enter" || event.repeat) return;

      const target = event.target;
      const isContinueButton =
        target instanceof HTMLElement && target.closest(".onboarding-continue");
      if (isContinueButton) return; // Let the focused button's normal Enter activation work.

      const isGenderCard =
        target instanceof HTMLElement && target.closest("[data-gender-option]");

      if (isGenderCard && !gender) return; // First Enter can select a focused card.

      event.preventDefault();
      handleContinue();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gender, showReply]);

  useEffect(() => {
    if (!showReply) return undefined;

    const timeoutId = window.setTimeout(() => navigate("/friend-name"), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [showReply, navigate]);

  const genderCardClass = (value) =>
    `relative cursor-pointer rounded-[28px] overflow-hidden border transition-all duration-300 text-left p-0 bg-transparent ${
      gender === value
        ? "border-[#D5B3FF] shadow-[0_0_40px_rgba(197,140,255,0.8)]"
        : "border-[#A46CFF]/40 shadow-[0_0_20px_rgba(124,92,252,0.25)]"
    }`;

  return (
    <AuthLayout size="md">
      {!showReply ? (
        <div>
          <div style={{ marginBottom: spacing.margin.lg }}>
            <Typography
              variant="hero"
              align="center"
              animate
              style={{
                marginBottom: spacing.margin.sm,
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(26px, 3.5vw, 34px)",
                lineHeight: 1.25,
                textShadow:
                  "0 0 12px rgba(197,140,255,0.85), 0 0 28px rgba(157,92,255,0.6), 0 0 55px rgba(124,92,252,0.45)",
              }}
            >
              Who would you feel the most comfortable talking to?
            </Typography>

            <Typography
              variant="subtitle"
              align="center"
              animate
              style={{ maxWidth: 480, margin: "0 auto", lineHeight: 1.5 }}
            >
              The person you choose will always be here for you. 💜
            </Typography>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <motion.button
              type="button"
              data-gender-option="female"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setGender("female")}
              aria-pressed={gender === "female"}
              aria-label="Choose female"
              className={genderCardClass("female")}
            >
              <img src={femaleImg} alt="Female" className="w-full h-[420px] object-cover object-top" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1A0B33]/90 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <h2
                  className="text-[#F8F4FF] text-3xl md:text-4xl font-semibold tracking-wide"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    textShadow:
                      "0 0 12px rgba(197,140,255,0.85), 0 0 28px rgba(157,92,255,0.6), 0 0 55px rgba(124,92,252,0.45)",
                  }}
                >
                  Female
                </h2>
                <div className="flex items-center justify-center mt-3">
                  <div className="h-[1px] w-12 bg-[#D7BEFF]/70" />
                  <div className="mx-2 text-[#EBD9FF] text-sm">✦</div>
                  <div className="h-[1px] w-12 bg-[#D7BEFF]/70" />
                </div>
              </div>
            </motion.button>

            <motion.button
              type="button"
              data-gender-option="male"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setGender("male")}
              aria-pressed={gender === "male"}
              aria-label="Choose male"
              className={genderCardClass("male")}
            >
              <img src={maleImg} alt="Male" className="w-full h-[420px] object-cover object-top" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1A0B33]/90 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <h2
                  className="text-[#F8F4FF] text-3xl md:text-4xl font-semibold tracking-wide"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    textShadow:
                      "0 0 12px rgba(197,140,255,0.85), 0 0 28px rgba(157,92,255,0.6), 0 0 55px rgba(124,92,252,0.45)",
                  }}
                >
                  Male
                </h2>
                <div className="flex items-center justify-center mt-3">
                  <div className="h-[1px] w-12 bg-[#D7BEFF]/70" />
                  <div className="mx-2 text-[#EBD9FF] text-sm">✦</div>
                  <div className="h-[1px] w-12 bg-[#D7BEFF]/70" />
                </div>
              </div>
            </motion.button>
          </div>

      

          <div style={{ marginTop: spacing.margin.xl }}>
            <PrimaryButton
              className="onboarding-continue"
              onClick={handleContinue}
              disabled={!gender}
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
            Got it 💜
          </Typography>
          <Typography variant="subtitle" align="center" style={{ marginTop: spacing.margin.md }}>
            I'll make sure you always feel heard and understood.
          </Typography>
        </motion.div>
      )}
    </AuthLayout>
  );
}
