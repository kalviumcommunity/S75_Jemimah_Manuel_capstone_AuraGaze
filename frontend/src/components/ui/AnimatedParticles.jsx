import { motion } from "framer-motion";

const particles = [
  {
    size: 5,
    top: "8%",
    left: "12%",
    duration: 7,
    delay: 0,
    opacity: 0.35,
  },
  {
    size: 4,
    top: "18%",
    left: "72%",
    duration: 8,
    delay: 1,
    opacity: 0.4,
  },
  {
    size: 6,
    top: "28%",
    left: "42%",
    duration: 9,
    delay: 2,
    opacity: 0.3,
  },
  {
    size: 3,
    top: "38%",
    left: "88%",
    duration: 7,
    delay: 0.5,
    opacity: 0.45,
  },
  {
    size: 5,
    top: "48%",
    left: "15%",
    duration: 10,
    delay: 2,
    opacity: 0.3,
  },
  {
    size: 4,
    top: "58%",
    left: "65%",
    duration: 8,
    delay: 3,
    opacity: 0.35,
  },
  {
    size: 6,
    top: "72%",
    left: "28%",
    duration: 11,
    delay: 1,
    opacity: 0.3,
  },
  {
    size: 5,
    top: "82%",
    left: "78%",
    duration: 9,
    delay: 0,
    opacity: 0.4,
  },
  {
    size: 3,
    top: "90%",
    left: "48%",
    duration: 8,
    delay: 2,
    opacity: 0.35,
  },
];

export default function AnimatedParticles() {
  return (
    <>
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-violet-300 pointer-events-none"
          style={{
            width: particle.size,
            height: particle.size,
            top: particle.top,
            left: particle.left,
            opacity: particle.opacity,
            filter: "blur(1px)",
          }}
          animate={{
            y: [0, -18, 0],
            x: [0, 10, 0],
            scale: [1, 1.2, 1],
            opacity: [
              particle.opacity,
              particle.opacity * 1.5,
              particle.opacity,
            ],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}