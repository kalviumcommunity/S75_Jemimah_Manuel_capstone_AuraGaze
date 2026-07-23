import { useState } from "react";
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
  const { updateField } = useOnboarding();

  const [gender, setGender] = useState("");
  const [showReply, setShowReply] = useState(false);

  const handleContinue = () => {
    if (!gender) return;

    updateField("gender", gender);
    setShowReply(true);

    setTimeout(() => {
      navigate("/age");
    }, 3000);
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
    style={{
      maxWidth: 480,
      margin: "0 auto",
      lineHeight: 1.5,
    }}
  >
    The person you choose will always be here for you.{"\u00A0"}💜
  </Typography>
</div>

          {/* ===========================
              Gender Selection
          =========================== */}

          <div className="grid grid-cols-2 gap-6">
            {/* Female */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setGender("female")}
              className={`relative cursor-pointer rounded-[28px] overflow-hidden border transition-all duration-300 ${
                gender === "female"
                  ? "border-[#D5B3FF] shadow-[0_0_40px_rgba(197,140,255,0.8)]"
                  : "border-[#A46CFF]/40 shadow-[0_0_20px_rgba(124,92,252,0.25)]"
              }`}
            >
              <img
                src={femaleImg}
                alt="Female"
                className="w-full h-[420px] object-cover object-top"
              />

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
            </motion.div>

            {/* Male */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setGender("male")}
              className={`relative cursor-pointer rounded-[28px] overflow-hidden border transition-all duration-300 ${
                gender === "male"
                  ? "border-[#D5B3FF] shadow-[0_0_40px_rgba(197,140,255,0.8)]"
                  : "border-[#A46CFF]/40 shadow-[0_0_20px_rgba(124,92,252,0.25)]"
              }`}
            >
              <img
                src={maleImg}
                alt="Male"
                className="w-full h-[420px] object-cover object-top"
              />

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
            </motion.div>
          </div>

          <div style={{ marginTop: spacing.margin.xl }}>
            <PrimaryButton onClick={handleContinue} disabled={!gender}>
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
            Got it{"\u00A0"}💜
          </Typography>

          <Typography
            variant="subtitle"
            align="center"
            style={{
              marginTop: spacing.margin.md,
            }}
          >
            I'll make sure you always feel heard and understood.
          </Typography>
        </motion.div>
      )}
    </AuthLayout>
  );
}