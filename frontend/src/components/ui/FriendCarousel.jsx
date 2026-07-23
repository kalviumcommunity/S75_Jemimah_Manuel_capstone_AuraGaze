import { motion, AnimatePresence } from "framer-motion";

import Typography from "./Typography";
import PrimaryButton from "./PrimaryButton";

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
          Cover Flow — full-width relative stage.
          Side cards are absolutely positioned at
          fixed viewport percentages, so their
          placement is guaranteed regardless of
          content width or column sizing.
      ========================================== */}

      <div
        className="relative w-full"
        style={{
          height: 480,
          perspective: 1600,
        }}
      >
        {/* Previous Card — pinned near the left edge */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={previous}
          className="cursor-pointer select-none"
          style={{
            position: "absolute",
            left: "3%",
            top: "50%",
            transformStyle: "preserve-3d",
          }}
          initial={false}
          animate={{ y: "-50%" }}
        >
          <motion.div
            animate={{
              rotateY: 26,
              opacity: 0.72,
            }}
            transition={{ duration: 0.4 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <img
              src={images[previousIndex]}
              alt="Previous Friend"
              style={{
                width: 240,
                height: 370,
                objectFit: "cover",
                borderRadius: 26,
                border: "1px solid rgba(255,255,255,.12)",
                boxShadow: "0 25px 70px rgba(0,0,0,.5)",
                filter: "blur(1px) brightness(.85)",
              }}
            />
          </motion.div>
        </motion.div>

        {/* Selected Friend — perfectly centered */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.9, y: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: "-60%" }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              x: "-50%",
              zIndex: 20,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: -45,
                borderRadius: 50,
                background:
                  "radial-gradient(circle, rgba(168,85,247,.32), transparent 70%)",
                filter: "blur(65px)",
                zIndex: -2,
              }}
            />

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

            <motion.img
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              src={images[current]}
              alt={friendName}
              style={{
                width: 300,
                height: 460,
                objectFit: "cover",
                borderRadius: 32,
                border: "1px solid rgba(213,179,255,.5)",
                boxShadow: "0 30px 100px rgba(168,85,247,.45)",
                position: "relative",
                zIndex: 2,
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 32,
                border: "1px solid rgba(255,255,255,.15)",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,.05), 0 0 60px rgba(168,85,247,.25)",
                pointerEvents: "none",
                zIndex: 4,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Next Card — pinned near the right edge */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={next}
          className="cursor-pointer select-none"
          style={{
            position: "absolute",
            right: "3%",
            top: "50%",
            transformStyle: "preserve-3d",
          }}
          initial={false}
          animate={{ y: "-50%" }}
        >
          <motion.div
            animate={{
              rotateY: -26,
              opacity: 0.72,
            }}
            transition={{ duration: 0.4 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <img
              src={images[nextIndex]}
              alt="Next Friend"
              style={{
                width: 240,
                height: 370,
                objectFit: "cover",
                borderRadius: 26,
                border: "1px solid rgba(255,255,255,.12)",
                boxShadow: "0 25px 70px rgba(0,0,0,.5)",
                filter: "blur(1px) brightness(.85)",
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Quote */}
      <motion.div
        key={current}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ marginTop: "18px", textAlign: "center" }}
      >
        <Typography
          variant="subtitle"
          align="center"
          animate
          style={{ fontSize: "16px", opacity: 0.9 }}
        >
          {companionQuotes[current % companionQuotes.length]}
        </Typography>
      </motion.div>

      {/* Indicators */}
      <div
        className="flex justify-center items-center"
        style={{ gap: 10, marginTop: "14px" }}
      >
        {images.map((_, index) => (
          <motion.div
            key={index}
            animate={{
              width: current === index ? 26 : 8,
              opacity: current === index ? 1 : 0.35,
              backgroundColor: current === index ? "#C58CFF" : "#FFFFFF",
            }}
            transition={{ duration: 0.25 }}
            style={{
              height: 8,
              borderRadius: 999,
              boxShadow:
                current === index ? "0 0 14px rgba(197,140,255,.7)" : "none",
            }}
          />
        ))}
      </div>

      {/* Choose Button */}
      <div className="w-full flex justify-center" style={{ marginTop: "22px" }}>
        <div style={{ maxWidth: 300, width: "100%" }}>
          <PrimaryButton onClick={handleContinue}>
            Choose {friendName} 💖
          </PrimaryButton>
        </div>
      </div>
    </>
  );
}