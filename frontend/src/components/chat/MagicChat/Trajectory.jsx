import { motion } from "framer-motion";

export default function Trajectory({
  visible = false,
  points = [],
}) {
  if (
    !visible ||
    points.length === 0
  ) {
    return null;
  }

  return (
    <div
      className="
        absolute
        inset-0
        pointer-events-none
        z-[200]
        overflow-hidden
      "
    >
      {points.map(
        (
          point,
          index
        ) => (
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay:
                index * 0.025,

              duration:
                0.14,
            }}
            className="absolute"
            style={{
              left:
                `calc(50% + ${point.x}px)`,

              bottom:
                `${72 + point.y}px`,

              transform:
                "translate(-50%, 50%)",
            }}
          >
            <div
              className="
                absolute
                rounded-full
                pointer-events-none
              "
              style={{
                width: 18,
                height: 18,
                left: -6,
                top: -6,

                background:
                  "radial-gradient(circle, rgba(180,130,255,.35), transparent 70%)",

                filter:
                  "blur(5px)",
              }}
            />

            <motion.div
              animate={{
                scale: [
                  1,
                  1.35,
                  1,
                ],

                opacity: [
                  0.65,
                  1,
                  0.65,
                ],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay:
                  index * 0.07,
              }}
              className="
                rounded-full
              "
              style={{
                width: 6,
                height: 6,

                background:
                  "#C084FC",

                boxShadow:
                  "0 0 8px rgba(192,132,252,.9), 0 0 18px rgba(168,85,247,.65)",
              }}
            />
          </motion.div>
        )
      )}
    </div>
  );
}