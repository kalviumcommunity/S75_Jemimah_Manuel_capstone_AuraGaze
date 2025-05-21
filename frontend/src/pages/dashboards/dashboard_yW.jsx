import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function YoungWomanSelect() {
  const navigate = useNavigate();

  const imageList = [
    "YW1.png",
    "YW2.png",
    "YW3.png",
    "YW4.png",
    "YW5.png",
    "YW6.png",
    "YW7.png",
    "YW8.png",
    "YW9.png",
    "YW10.png",
    "YW11.png",
    "YW12.png",
    "YW13.png",
    "YW14.png",
    "YW15.png",
    "YW16.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const goNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const handleImageSelect = () => {
    const selectedImage = imageList[currentIndex];
    localStorage.setItem("selectedYoungWomanImage", selectedImage);
    navigate("/chat");
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.5 },
    }),
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/183279-870457579_medium.mp4" type="video/mp4" />
      </video>

      {/* Overlay content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <button
          onClick={goPrev}
          className="text-white text-5xl mr-6 hover:scale-110 transition"
        >
          ❮
        </button>

        {/* Main image + button card */}
        <div
          className="w-[400px] h-[650px] sm:w-[450px] sm:h-[700px] md:w-[500px] md:h-[750px] 
                     bg-[rgba(255,255,255,0.15)] border border-white rounded-xl shadow-2xl 
                     flex flex-col items-center justify-between p-4 cursor-pointer 
                     backdrop-blur-md overflow-hidden"
        >
          {/* Image area */}
          <div
            className="flex-1 w-full flex items-center justify-center overflow-hidden"
            onClick={handleImageSelect}
          >
            <AnimatePresence custom={direction} mode="wait">
              <motion.img
                key={imageList[currentIndex]}
                src={`/young_women/${imageList[currentIndex]}`}
                alt="Young Woman"
                className="max-h-[90%] w-auto object-contain rounded-xl"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
              />
            </AnimatePresence>
          </div>

          {/* Select Button */}
          <button
            onClick={handleImageSelect}
            className="mt-4 bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Select
          </button>
        </div>

        <button
          onClick={goNext}
          className="text-white text-5xl ml-6 hover:scale-110 transition"
        >
          ❯
        </button>
      </div>
    </div>
  );
}
