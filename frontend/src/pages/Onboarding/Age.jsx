import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import bgImg from "../../assets/images/background/bg.png";

import OnboardingLayout from "../../components/OnboardingLayout";
import { useOnboarding } from "../../context/OnboardingContext";

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
    <OnboardingLayout
      step={5}
      totalSteps={5}
      title="How old would you like me to be?"
      subtitle="Choose the age that feels most comfortable to you. 💜"
      bgImage={bgImg}
    >
      {!showReply ? (
        <>
          <div className="flex flex-col items-center">

            <motion.h1
              key={age}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="text-7xl font-bold text-white mb-10"
              style={{
                textShadow:
                  "0 0 18px rgba(197,140,255,.9),0 0 45px rgba(157,92,255,.55)",
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

          <button
            onClick={handleContinue}
            className="mt-12 w-full rounded-2xl py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#9A5DFF] to-[#C58CFF] shadow-[0_0_25px_rgba(157,92,255,0.6)] hover:scale-105 transition"
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
              transition={{ repeat: Infinity, duration: .6 }}
              className="w-3 h-3 rounded-full bg-[#CDBBFF]"
            />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: .6, delay: .15 }}
              className="w-3 h-3 rounded-full bg-[#CDBBFF]"
            />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: .6, delay: .3 }}
              className="w-3 h-3 rounded-full bg-[#CDBBFF]"
            />

          </div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-4xl text-white font-semibold"
          >
            {age}...
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-5 text-white/80 text-lg"
          >
            Perfect.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6 }}
            className="mt-3 text-white/70 text-lg"
          >
            I'll always be just the age you imagined me to be. 💜
          </motion.p>

        </motion.div>
      )}
    </OnboardingLayout>
  );
}