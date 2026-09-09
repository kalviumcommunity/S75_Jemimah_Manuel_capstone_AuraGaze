import { motion } from "framer-motion";
import { useEffect } from "react";

import scrollRolled from "../../../assets/paper/scroll-rolled.png";

export default function FlyingScroll({
  start = { x: 0, y: 0 },
  target = { x: 0, y: 0 },
  visible = false,
  duration = 1.1,
  rotation = 720,
  scale = 1,
  onComplete,
}) {
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      onComplete?.();
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [visible, duration, onComplete]);

  if (!visible) return null;

  const distanceX = target.x - start.x;
  const distanceY = target.y - start.y;

  const distance = Math.sqrt(
    distanceX * distanceX +
      distanceY * distanceY
  );

  const controlX =
    start.x + distanceX * 0.5;

  const arcHeight = Math.min(
    280,
    Math.max(130, distance * 0.3)
  );

  const controlY =
    Math.min(start.y, target.y) -
    arcHeight;

  return (
    <motion.div
      className="
        absolute
        pointer-events-none
        z-[100]
      "
      initial={{
        x: start.x,
        y: start.y,
        opacity: 1,
        scale: 0.7,
        rotate: 0,
      }}
      animate={{
        x: [
          start.x,
          controlX,
          target.x,
        ],
        y: [
          start.y,
          controlY,
          target.y,
        ],
        rotate: rotation,
        scale: [
          0.7,
          1.05,
          scale,
        ],
        opacity: [1, 1, 1],
      }}
      transition={{
        duration,
        ease: "easeInOut",
      }}
    >
      {/* Flying glow */}
      <motion.div
        className="
          absolute
          inset-0
          rounded-full
          pointer-events-none
        "
        animate={{
          scale: [
            0.8,
            1.5,
            0.8,
          ],
          opacity: [
            0.25,
            0.55,
            0.25,
          ],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(192,132,252,.6), transparent 70%)",
          filter: "blur(10px)",
        }}
      />

      <motion.img
        src={scrollRolled}
        alt=""
        className="
          relative
          w-16
          md:w-20
          select-none
        "
        animate={{
          rotateZ: [
            0,
            -10,
            10,
            -5,
            0,
          ],
        }}
        transition={{
          duration: 0.45,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}