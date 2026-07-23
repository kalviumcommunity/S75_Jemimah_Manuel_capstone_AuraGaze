import { motion, AnimatePresence } from "framer-motion";

import Typography from "./Typography";
import PrimaryButton from "./PrimaryButton";

import spacing from "../../theme/spacing";

export default function FriendCarousel({
  images,
  current,
  previous,
  next,
  friendName,
  companionQuotes,
  handleContinue,
}) {
  const previousIndex = current === 0 ? images.length - 1 : current - 1;
  const nextIndex = current === images.length - 1 ? 0 : current + 1;

  return (
    <>
      {/* ==========================================
          Premium Carousel
      ========================================== */}

      <div className="relative flex items-center justify-center">
        {/* ======================================
            Previous Card
        ====================================== */}

        <motion.div
          whileHover={{ scale: 0.92, rotateY: -18, x: -10 }}
          whileTap={{ scale: 0.88 }}
          transition={{ duration: 0.25 }}
          onClick={previous}
          className="cursor-pointer select-none"
          style={{
            perspective: 1200,
            marginRight: 30,
          }}
        >
          <motion.div
            animate={{
              rotateY: -18,
              scale: 0.88,
              opacity: 0.38,
            }}
            transition={{ duration: 0.35 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <img
              src={images[previousIndex]}
              alt="Previous Friend"
              style={{
                width: 240,
                height: 370,
                objectFit: "cover",
                borderRadius: 28,
                border: "1px solid rgba(255,255,255,.12)",
                boxShadow: "0 20px 60px rgba(0,0,0,.45)",
                filter: "blur(1px) brightness(.75)",
              }}
            />
          </motion.div>
        </motion.div>

        {/* ======================================
            Selected Friend
        ====================================== */}

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{ position: "relative", zIndex: 20 }}
          >
            {/* Ambient Glow */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.45, 0.75, 0.45],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: -35,
                borderRadius: 50,
                background:
                  "radial-gradient(circle, rgba(168,85,247,.28), transparent 70%)",
                filter: "blur(55px)",
                zIndex: -2,
              }}
            />

            {/* Card Reflection */}
            <motion.div
              animate={{ x: ["-180%", "240%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                inset: 0,
                width: 90,
                background: "rgba(255,255,255,.16)",
                transform: "rotate(14deg)",
                filter: "blur(18px)",
                pointerEvents: "none",
                zIndex: 3,
              }}
            />

            {/* Selected Image */}
            <motion.img
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              src={images[current]}
              alt={friendName}
              style={{
                width: 340,
                height: 520,
                objectFit: "cover",
                borderRadius: 34,
                border: "1px solid rgba(213,179,255,.45)",
                boxShadow: "0 25px 80px rgba(168,85,247,.40)",
                position: "relative",
                zIndex: 2,
              }}
            />

            {/* Premium Border Glow */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 34,
                border: "1px solid rgba(255,255,255,.15)",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,.05), 0 0 60px rgba(168,85,247,.22)",
                pointerEvents: "none",
                zIndex: 4,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* ======================================
            Next Card
        ====================================== */}

        <motion.div
          whileHover={{ scale: 0.92, rotateY: 18, x: 10 }}
          whileTap={{ scale: 0.88 }}
          transition={{ duration: 0.25 }}
          onClick={next}
          className="cursor-pointer select-none"
          style={{
            perspective: 1200,
            marginLeft: 30,
          }}
        >
          <motion.div
            animate={{
              rotateY: 18,
              scale: 0.88,
              opacity: 0.38,
            }}
            transition={{ duration: 0.35 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <img
              src={images[nextIndex]}
              alt="Next Friend"
              style={{
                width: 240,
                height: 370,
                objectFit: "cover",
                borderRadius: 28,
                border: "1px solid rgba(255,255,255,.12)",
                boxShadow: "0 20px 60px rgba(0,0,0,.45)",
                filter: "blur(1px) brightness(.75)",
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ======================================
          Friend Details
      ====================================== */}

      <motion.div
        key={current}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          marginTop: spacing.margin["2xl"],
          textAlign: "center",
        }}
      >
        <Typography
          variant="pageTitle"
          align="center"
          animate
          style={{
            marginBottom: spacing.margin.sm,
            background: "linear-gradient(180deg,#FFFFFF,#E9D8FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 18px rgba(168,85,247,.40)",
          }}
        >
          {friendName}
        </Typography>

        <Typography
          variant="bodyLarge"
          align="center"
          animate
          style={{
            maxWidth: 520,
            margin: "0 auto",
            lineHeight: 1.8,
            opacity: 0.88,
          }}
        >
          {companionQuotes[current % companionQuotes.length]}
        </Typography>
      </motion.div>

      {/* ======================================
          Carousel Indicators
      ====================================== */}

      <div
        className="flex justify-center items-center"
        style={{
          gap: 12,
          marginTop: spacing.margin.xl,
        }}
      >
        {images.map((_, index) => (
          <motion.div
            key={index}
            animate={{
              width: current === index ? 34 : 10,
              opacity: current === index ? 1 : 0.35,
              backgroundColor: current === index ? "#C58CFF" : "#FFFFFF",
            }}
            transition={{ duration: 0.25 }}
            style={{
              height: 10,
              borderRadius: 999,
              boxShadow:
                current === index ? "0 0 18px rgba(197,140,255,.7)" : "none",
            }}
          />
        ))}
      </div>

      {/* ======================================
          Navigation Buttons
      ====================================== */}

      <div
        className="flex items-center justify-center"
        style={{
          gap: 18,
          marginTop: spacing.margin["2xl"],
        }}
      >
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={previous}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,.15)",
            background: "rgba(255,255,255,.08)",
            backdropFilter: "blur(18px)",
            color: "white",
            fontSize: 24,
            cursor: "pointer",
          }}
        >
          ←
        </motion.button>

        <PrimaryButton onClick={handleContinue} className="px-12">
          Choose {friendName} ❤️
        </PrimaryButton>

        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={next}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,.15)",
            background: "rgba(255,255,255,.08)",
            backdropFilter: "blur(18px)",
            color: "white",
            fontSize: 24,
            cursor: "pointer",
          }}
        >
          →
        </motion.button>
      </div>
    </>
  );
}