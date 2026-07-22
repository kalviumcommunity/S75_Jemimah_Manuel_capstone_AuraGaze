import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import femaleImg from "../../assets/images/gender/female.png";
import maleImg from "../../assets/images/gender/male.png";
import bgImg from "../../assets/images/background/bg.png";

import AuthLayout from "../../components/layout/AuthLayout";
import { useOnboarding } from "../../context/OnboardingContext";

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
    <AuthLayout size="md"
      step={4}
      totalSteps={5}
      title="Who would you feel the most comfortable talking to?"
      subtitle="The person you choose will always be here for you. 💜"
      bgImage={bgImg}
    >
      {!showReply ? (
        <>
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

              {/* Subtle bottom gradient for text legibility only — NOT a blur over the image */}
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

          <button
            onClick={handleContinue}
            disabled={!gender}
            className="mt-10 w-full rounded-2xl py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#9A5DFF] to-[#C58CFF] shadow-[0_0_25px_rgba(157,92,255,0.6)] hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
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

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-3xl text-white"
          >
            Got it 💜
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-5 text-white/70 text-lg"
          >
            I'll make sure you always feel heard and understood.
          </motion.p>
        </motion.div>
      )}
    </AuthLayout>
  );
}