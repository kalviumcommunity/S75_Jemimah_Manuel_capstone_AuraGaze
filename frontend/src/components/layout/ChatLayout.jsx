import { motion } from "framer-motion";

import BackgroundGlow from "../ui/BackgroundGlow";
import AnimatedParticles from "../ui/AnimatedParticles";

import bgImg from "../../assets/images/background/bg.png";

export default function ChatLayout({
  header,
  children,
  input,
}) {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#070312]">

      {/* ================= Background ================= */}

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImg})`,
        }}
      />

      <BackgroundGlow />
      <AnimatedParticles />

      <div className="absolute inset-0 bg-gradient-to-b from-[#090414]/20 via-[#12091F]/60 to-[#090414]/95" />
      <div className="absolute inset-0 bg-black/20" />

      {/* ================= Main ================= */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="relative z-20 flex h-full flex-col"
      >

        {/* ================= Header ================= */}

        <div className="shrink-0">
          {header}
        </div>

        {/* ================= Messages ================= */}

        <main
          className="
            flex-1
            overflow-y-auto
            overflow-x-hidden
            scroll-smooth

            px-4
            sm:px-6
            md:px-8
            lg:px-10
            xl:px-14

            py-8
            pb-40

            scrollbar-thin
            scrollbar-track-transparent
            scrollbar-thumb-white/10
          "
        >
          <div
            className="
              w-full
              max-w-[2000px]
              mx-auto
            "
          >
            {children}
          </div>
        </main>

        {/* ================= Input ================= */}

        <div
          className="
            shrink-0

            border-t
            border-white/10

            bg-[#090414]/55

            backdrop-blur-2xl

            px-4
            sm:px-6
            md:px-8
            lg:px-10
            xl:px-14

            py-5
          "
        >
          <div
            className="
              w-full
              max-w-[1700px]
              mx-auto
            "
          >
            <motion.div
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                delay: 0.15,
              }}
              className="
                rounded-[30px]

                border
                border-white/10

                bg-white/[0.05]

                backdrop-blur-3xl

                shadow-[0_20px_60px_rgba(0,0,0,.45)]

                overflow-hidden
              "
            >
              {input}
            </motion.div>
          </div>
        </div>

      </motion.div>

    </div>
  );
}