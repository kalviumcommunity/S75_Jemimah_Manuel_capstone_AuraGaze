import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import bgImg from "../../assets/images/background/bg.png";

export default function CreatingFriend() {

  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);

  const [message, setMessage] = useState(
    "Preparing personality..."
  );

  useEffect(() => {

    const messages = [
      "Preparing personality...",
      "Learning your name...",
      "Creating memories...",
      "Giving your friend a heart...",
      "Almost ready..."
    ];

    let index = 0;

    const interval = setInterval(() => {

      setProgress((prev) => {

        const next = prev + 2;

        if (next >= 20 && next < 40)
          setMessage(messages[1]);

        if (next >= 40 && next < 60)
          setMessage(messages[2]);

        if (next >= 60 && next < 80)
          setMessage(messages[3]);

        if (next >= 80)
          setMessage(messages[4]);

        if (next >= 100) {

          clearInterval(interval);

          setTimeout(() => {

            navigate("/chat");

          }, 700);

          return 100;
        }

        return next;

      });

    }, 80);

    return () => clearInterval(interval);

  }, []);

  return (

    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImg})`,
      }}
    >

      <motion.div

        initial={{
          opacity: 0,
          scale: .9,
        }}

        animate={{
          opacity: 1,
          scale: 1,
        }}

        className="w-[650px]
        rounded-[40px]
        backdrop-blur-xl
        bg-white/5
        border border-white/10
        p-12
        shadow-[0_0_70px_rgba(140,92,255,.25)]"

      >

        <motion.h1

          animate={{
            opacity: [1,.5,1],
          }}

          transition={{
            repeat: Infinity,
            duration: 2,
          }}

          className="text-5xl text-center font-bold text-white"

          style={{
            fontFamily: "'Playfair Display', serif",
          }}

        >

          ✨ Creating Your Best Friend

        </motion.h1>

        <p
          className="mt-10
          text-center
          text-xl
          text-white/80"
        >
          {message}
        </p>

        <div
          className="mt-12
          h-4
          rounded-full
          bg-white/10
          overflow-hidden"
        >

          <motion.div

            animate={{
              width: `${progress}%`,
            }}

            className="h-full
            rounded-full
            bg-gradient-to-r
            from-[#8E63FF]
            to-[#C58CFF]"

          />

        </div>

        <p
          className="text-center
          text-white
          mt-5
          text-lg"
        >

          {progress}%

        </p>

      </motion.div>

    </div>

  );

}