import { motion } from "framer-motion";

export default function OnboardingLayout({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  bgImage, // optional: pass a page-specific background image
}) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0518] flex items-center justify-center px-5 py-10">

      {/* Background image (page-specific) OR fallback video */}
      {bgImage ? (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        >
          <source src="/183279-870457579_medium.mp4" type="video/mp4" />
        </video>
      )}

      {/* Dark vignette so text stays readable over any background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      {/* Purple ambient glow */}
      <div className="absolute w-[650px] h-[650px] rounded-full bg-[#7C5CFC]/20 blur-[170px] pointer-events-none" />

      {/* Content sits directly on the background — no glass card wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-xl"
      >
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-white/60 text-xs mb-2 tracking-wide">
            <span>{step} / {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-[#9A5DFF] to-[#C58CFF]"
            />
          </div>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-semibold text-white text-center mb-4 leading-tight"
          style={{
            fontFamily: "'Playfair Display', serif",
            textShadow:
              "0 0 12px rgba(197,140,255,0.85), 0 0 28px rgba(157,92,255,0.6), 0 0 55px rgba(124,92,252,0.45)",
          }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-[#D7BEFF]/90 mb-10 text-base md:text-lg"
        >
          {subtitle}
        </motion.p>

        {/* Actual Page */}
        {children}
      </motion.div>
    </div>
  );
}