import { motion } from "framer-motion";
import { useEffect } from "react";

import scrollRolled from "../../assets/paper/scroll-rolled.png";

export default function FlyingScroll({
  start = { x: 0, y: 0 },
  target = { x: 0, y: 0 },
  visible = false,
  duration = 1.2,
  rotation = 720,
  scale = 1,
  onComplete,
}) {
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [visible, duration, onComplete]);

  if (!visible) return null;

  const controlX = (start.x + target.x) / 2;
  const controlY = Math.min(start.y, target.y) - 180;

  return (
    <motion.div
      className="absolute pointer-events-none z-50"
      initial={{
        x: start.x,
        y: start.y,
        opacity: 1,
        scale: 0.8,
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
        scale: [0.8, 1, scale],
        opacity: [1, 1, 1],
      }}
      transition={{
        duration,
        ease: "easeInOut",
      }}
    >
      <motion.img
        src={scrollRolled}
        alt="Flying Scroll"
        className="w-16 md:w-20 select-none"
        animate={{
          rotateZ: [0, -10, 10, -5, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}