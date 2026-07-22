import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthLayout from "../../components/layout/AuthLayout";
import { useOnboarding } from "../../context/OnboardingContext";
import bgImg from "../../assets/images/background/bg.png";

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
    <AuthLayout size="md"
      step={3}
      totalSteps={5}
      title="When is your birthday?"
      subtitle="I'll always be the first one to wish you. 🎂💜"
      bgImage={bgImg}
    >
      {!showReply ? (
        <>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full rounded-2xl bg-white/10 border border-white/20 px-6 py-4 text-white outline-none text-lg focus:border-[#A96FFF] focus:ring-2 focus:ring-[#A96FFF]/40 transition [color-scheme:dark]"
          />

          <button
            onClick={handleContinue}
            disabled={!dob}
            className="mt-8 w-full rounded-2xl py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#9A5DFF] to-[#C58CFF] shadow-[0_0_25px_rgba(157,92,255,0.6)] hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="text-3xl text-white font-semibold"
            style={{
              fontFamily: "'Playfair Display', serif",
              textShadow:
                "0 0 12px rgba(197,140,255,0.85), 0 0 28px rgba(157,92,255,0.6), 0 0 55px rgba(124,92,252,0.45)",
            }}
          >
            I'll remember that day.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-5 text-[#D7BEFF]/90 text-lg"
          >
            I promise...
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="mt-3 text-white text-lg"
          >
            I'll remember it every year. 🎂💜
          </motion.p>
        </motion.div>
      )}
    </AuthLayout>
  );
}