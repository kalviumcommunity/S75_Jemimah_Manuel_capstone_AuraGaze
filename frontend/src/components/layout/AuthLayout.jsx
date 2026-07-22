import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

import logo from "../../assets/images/background/logo.png";
import BackgroundGlow from "../ui/BackgroundGlow";
import AnimatedParticles from "../ui/AnimatedParticles";
import GlassCard from "../ui/GlassCard";

import colors from "../../theme/colors";
import gradients from "../../theme/gradients";
import spacing from "../../theme/spacing";
import animations from "../../theme/animations";

import bgImg from "../../assets/images/background/bg.png";

export default function AuthLayout({
  children,
  size = "md",
  className = "",
}) {

  const navigate = useNavigate();

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        flex
        items-center
        justify-center
      "
      style={{
        background: gradients.background.app,
      }}
    >
      {/* ===========================
          Background Image
      ============================ */}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      {/* ===========================================
    Floating Logo
=========================================== */}

<motion.button
  initial={{
    opacity: 0,
    x: -25,
  }}
  animate={{
    opacity: 1,
    x: 0,
    y: [0, -4, 0],
    scale: [1, 1.04, 1],
  }}
  transition={{
    opacity: {
      duration: 0.6,
    },

    x: {
      duration: 0.6,
    },

    y: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },

    scale: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }}
  whileHover={{
    scale: 1.08,
    rotate: -4,
  }}
  whileTap={{
    scale: 0.95,
  }}
  onClick={() => navigate("/")}
  className="
    absolute
    top-6
    left-6
    z-50
    cursor-pointer
    border-none
    bg-transparent
    p-0
  "
>
  <div
    className="
      relative
      flex
      items-center
      justify-center
    "
  >

    {/* Outer Glow */}

    <div
      className="
        absolute
        w-24
        h-24
        rounded-full
        bg-violet-500/20
        blur-3xl
      "
    />

    {/* Animated Glow */}

    <motion.div
      animate={{
        scale: [1, 1.12, 1],
        opacity: [0.5, 0.85, 0.5],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="
        absolute
        w-20
        h-20
        rounded-full
        bg-fuchsia-500/20
        blur-2xl
      "
    />

    {/* Logo */}

    <img
      src={logo}
      alt="Aura Gaze"
      className="
        relative
        w-22
        h-22
        object-contain
      "
      style={{
        filter:
          "drop-shadow(0 0 18px rgba(168,85,247,.65))",
      }}
    />

  </div>
</motion.button>

      {/* ===========================
          Animated Background Glow
      ============================ */}

      <BackgroundGlow />

      {/* ===========================
          Floating Particles
      ============================ */}

      <AnimatedParticles />

      {/* ===========================
          Overlay
      ============================ */}

      <div
        className="absolute inset-0"
        style={{
          background: gradients.overlay.auth,
        }}
      />

      {/* ===========================
          Main Content
      ============================ */}

      <motion.div
        initial={animations.page.initial}
        animate={animations.page.animate}
        transition={{
          duration: animations.duration.slower,
          ease: animations.easing.spring,
        }}
        className="
          relative
          z-20
          flex
          justify-center
          w-full
        "
        style={{
          paddingLeft: spacing.padding.lg,
          paddingRight: spacing.padding.lg,
        }}
      >
        <GlassCard
          size={size}
          className={className}
          glow
          blur
        >
          <motion.div
  initial={animations.fadeUp.hidden}
  animate={animations.fadeUp.visible}
  transition={{
    delay: animations.delay.md,
    duration: animations.duration.slow,
    ease: animations.easing.smooth,
  }}
  className="relative z-20 w-full"
  style={{
    paddingTop: "36px",
    paddingBottom: "36px",
    paddingLeft: "34px",
    paddingRight: "34px",
  }}
>
  {children}
</motion.div>
        </GlassCard>
      </motion.div>
    </div>
  );
}