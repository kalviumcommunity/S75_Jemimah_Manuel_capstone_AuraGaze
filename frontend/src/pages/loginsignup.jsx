import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import bgImg from "../assets/images/background/bg.png";

export default function LoginSignup() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-[#090413]">

      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55" />

      {/* Purple Glow */}
      <div className="absolute w-[900px] h-[900px] rounded-full bg-[#8B5CFF]/20 blur-[220px]" />

      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 45, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="
          relative
          z-10
          w-[92%]
          max-w-[780px]
          rounded-[42px]
          border
          border-white/15
          bg-white/[0.08]
          backdrop-blur-[35px]
          shadow-[0_30px_120px_rgba(0,0,0,0.55)]
          px-20
          py-16
        "
      >
        {/* Welcome */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-center text-white text-7xl font-semibold"
          style={{
            fontFamily: "'Playfair Display', serif",
            textShadow:
              "0 0 22px rgba(220,190,255,0.95), 0 0 50px rgba(155,92,255,0.6)",
          }}
        >
          Welcome
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-7 text-center text-[21px] leading-9 text-[#D8C8FF]"
        >
          Every meaningful friendship starts with a simple hello.
          <br />
          Let's begin yours today.
          <span className="ml-2">💜</span>
        </motion.p>

        {/* Buttons */}
        <div className="mt-16 space-y-7">

          {/* Login */}
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 45px rgba(180,120,255,0.55)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/login")}
            className="
              w-full
              h-[60px]
              rounded-full
              bg-gradient-to-r
              from-[#8F5BFF]
              via-[#A96FFF]
              to-[#C58CFF]
              text-white
              text-[20px]
              font-semibold
              tracking-wide
              shadow-[0_12px_35px_rgba(157,92,255,0.45)]
              transition-all
              duration-300
            "
          >
            Continue with Login
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-5">
            <div className="flex-1 h-px bg-white/15" />

            <span className="text-white/45 text-sm tracking-[8px]">
              OR
            </span>

            <div className="flex-1 h-px bg-white/15" />
          </div>

          {/* Signup */}
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/signup")}
            className="
              w-full
              h-[60px]
              rounded-full
              border
              border-white/20
              bg-white/10
              backdrop-blur-xl
              text-white
              text-[20px]
              font-semibold
              tracking-wide
              transition-all
              duration-300
              hover:bg-white/15
              hover:border-[#D5B3FF]
            "
          >
            Create New Journey
          </motion.button>

        </div>
      </motion.div>
    </div>
  );
}