import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bgImg from "../assets/images/background/bg.png";

/* ===========================================================
   Floating Particle
=========================================================== */
const FloatingParticle = ({
  size,
  top,
  left,
  duration,
  delay,
  opacity,
}) => {
  return (
    <motion.div
      className="absolute rounded-full bg-violet-300"
      style={{
        width: size,
        height: size,
        top,
        left,
        opacity,
        filter: "blur(1px)",
      }}
      animate={{
        y: [0, -20, 0],
        x: [0, 8, 0],
        opacity: [opacity, opacity * 1.4, opacity],
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export default function LoginSignup() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-[#070312]">

      {/* ==========================================================
          BACKGROUND IMAGE
      ========================================================== */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* ==========================================================
          DARK OVERLAY
      ========================================================== */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/60" />

      {/* ==========================================================
          AMBIENT GLOW LAYERS
      ========================================================== */}

      {/* Center Glow */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="
          absolute
          w-[780px]
          h-[780px]
          rounded-full
          bg-violet-500/15
          blur-[220px]
        "
      />

      {/* Left Glow */}
      <motion.div
        animate={{
          x: [-15, 15, -15],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="
          absolute
          -left-44
          top-32
          w-[520px]
          h-[520px]
          rounded-full
          bg-fuchsia-600/15
          blur-[180px]
        "
      />

      {/* Right Glow */}
      <motion.div
        animate={{
          x: [15, -15, 15],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="
          absolute
          -right-44
          bottom-24
          w-[520px]
          h-[520px]
          rounded-full
          bg-purple-500/15
          blur-[180px]
        "
      />

      {/* ==========================================================
          FLOATING PARTICLES
      ========================================================== */}

      <FloatingParticle
        size={5}
        top="10%"
        left="15%"
        duration={6}
        delay={0}
        opacity={0.35}
      />

      <FloatingParticle
        size={3}
        top="18%"
        left="70%"
        duration={8}
        delay={1}
        opacity={0.45}
      />

      <FloatingParticle
        size={4}
        top="72%"
        left="25%"
        duration={7}
        delay={2}
        opacity={0.30}
      />

      <FloatingParticle
        size={6}
        top="78%"
        left="80%"
        duration={9}
        delay={1}
        opacity={0.40}
      />

      <FloatingParticle
        size={4}
        top="48%"
        left="12%"
        duration={7}
        delay={3}
        opacity={0.35}
      />

      <FloatingParticle
        size={5}
        top="38%"
        left="90%"
        duration={8}
        delay={2}
        opacity={0.30}
      />

      <FloatingParticle
        size={3}
        top="22%"
        left="45%"
        duration={6}
        delay={4}
        opacity={0.45}
      />

      <FloatingParticle
        size={5}
        top="82%"
        left="55%"
        duration={10}
        delay={0}
        opacity={0.35}
      />

      {/* ==========================================================
          GLASS CARD
      ========================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 45,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.75,
          ease: "easeOut",
        }}
        whileHover={{
          y: -5,
        }}
        className="
          relative
          z-10
          w-[92%]
          max-w-[650px]
          overflow-hidden
          rounded-[38px]
          border
          border-white/10
          bg-gradient-to-b
          from-white/[0.12]
          via-white/[0.08]
          to-white/[0.05]
          backdrop-blur-[35px]
          shadow-[0_30px_120px_rgba(0,0,0,0.60)]
        "
      >

        {/* Inner Glass Highlight */}
        <div
          className="
            absolute
            inset-0
            rounded-[38px]
            border
            border-white/5
            pointer-events-none
          "
        />

        {/* Top Shine */}
        <div
          className="
            absolute
            inset-x-0
            top-0
            h-[1px]
            bg-gradient-to-r
            from-transparent
            via-white/30
            to-transparent
          "
        />

        {/* ==========================================================
              CONTENT STARTS HERE
        ========================================================== */}
                {/* Welcome */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="pt-14 text-center text-white text-[72px] font-semibold tracking-tight"
          style={{
            fontFamily: "'Playfair Display', serif",
            textShadow:
              "0 0 14px rgba(255,255,255,.45), 0 0 40px rgba(168,85,247,.28)",
          }}
        >
          Welcome
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="mt-5 px-10 text-center"
        >
          <p className="text-[21px] leading-9 text-[#E4D7FF] font-light">
            Every meaningful friendship begins with
            <br />
            one simple conversation.
          </p>

          <p className="mt-5 text-[17px] tracking-wide text-[#CDB9FF]/90">
            Your AI companion is waiting.
            <span className="ml-2 text-xl">💜</span>
          </p>
        </motion.div>

        {/* Buttons */}
        <div className="mt-12 px-10 pb-12 space-y-5">

          {/* Login Button */}
          <motion.button
            whileHover={{
              scale: 1.02,
              y: -2,
              boxShadow: "0 18px 55px rgba(165,92,255,.45)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/login")}
            className="
              group
              relative
              overflow-hidden
              w-full
              h-[62px]
              rounded-full
              bg-gradient-to-r
              from-[#8B5CF6]
              via-[#A855F7]
              to-[#C084FC]
              text-white
              text-[20px]
              font-semibold
              tracking-wide
              shadow-[0_12px_35px_rgba(139,92,246,.40)]
              transition-all
              duration-300
            "
          >

            {/* Shimmer */}
            <span
              className="
                absolute
                inset-y-0
                -left-[40%]
                w-[35%]
                skew-x-[-25deg]
                bg-white/25
                blur-md
                transition-all
                duration-700
                group-hover:left-[120%]
              "
            />

            <span className="relative z-10">
              Continue with Login
            </span>

          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-1">

            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/5" />

            <span className="uppercase tracking-[4px] text-xs text-white/40">
              or
            </span>

            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/20 to-white/5" />

          </div>

          {/* Signup Button */}
          <motion.button
            whileHover={{
              scale: 1.02,
              y: -2,
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/signup")}
            className="
              w-full
              h-[62px]
              rounded-full
              border
              border-white/10
              bg-gradient-to-b
              from-white/12
              to-white/5
              backdrop-blur-xl
              text-white
              text-[20px]
              font-semibold
              tracking-wide
              shadow-[0_8px_25px_rgba(0,0,0,.25)]
              transition-all
              duration-300
              hover:border-violet-300/40
              hover:bg-white/10
            "
          >
            Begin a New Friendship
          </motion.button>

        </div>

      </motion.div>

    </div>
  );
}