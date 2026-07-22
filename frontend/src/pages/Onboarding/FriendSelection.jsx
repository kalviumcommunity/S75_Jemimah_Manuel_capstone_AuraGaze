import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AuthLayout from "../../components/layout/AuthLayout";
import { useOnboarding } from "../../context/OnboardingContext";

import { friends } from "../../data/friends";

import bgImg from "../../assets/images/background/bg.png";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function FriendSelection() {

    const navigate = useNavigate();

    const {
        onboardingData,
        updateField
    } = useOnboarding();

    const {
        gender,
        age,
        friendName
    } = onboardingData;

    const [images, setImages] = useState([]);

    const [current, setCurrent] = useState(0);

    const [selectedImage, setSelectedImage] = useState("");



    // ===========================
    // Decide Images
    // ===========================

    useEffect(() => {

        let imageArray = [];

        if (gender === "male") {

            if (age >= 6 && age <= 18) {

                imageArray = friends.school_boy;

            }

            else if (age <= 40) {

                imageArray = friends.young_men;

            }

            else {

                imageArray = friends.old_men;

            }

        }

        else {

            if (age >= 6 && age <= 18) {

                imageArray = friends.school_girl;

            }

            else if (age <= 40) {

                imageArray = friends.young_women;

            }

            else {

                imageArray = friends.old_women;

            }

        }

        setImages(imageArray);

        setSelectedImage(imageArray[0]);

    }, [gender, age]);



    // ===========================
    // Previous Card
    // ===========================

    const previousIndex =
        current === 0
            ? images.length - 1
            : current - 1;



    // ===========================
    // Next Card
    // ===========================

    const nextIndex =
        current === images.length - 1
            ? 0
            : current + 1;



    // ===========================
    // Next
    // ===========================

    const next = () => {

        const newIndex =
            current === images.length - 1
                ? 0
                : current + 1;

        setCurrent(newIndex);

        setSelectedImage(images[newIndex]);

    };



    // ===========================
    // Previous
    // ===========================

    const previous = () => {

        const newIndex =
            current === 0
                ? images.length - 1
                : current - 1;

        setCurrent(newIndex);

        setSelectedImage(images[newIndex]);

    };



    // ===========================
    // Continue
    // ===========================

const handleContinue = async () => {

  try {

    const token = localStorage.getItem("token");

    await axios.put(

      `${backendURL}/api/onboarding/save`,

      {

        nickname: onboardingData.nickname,

        dob: onboardingData.dob,

        friendName: onboardingData.friendName,

        gender: onboardingData.gender,

        age: onboardingData.age,

        image: selectedImage,

      },

      {

        headers: {

          Authorization: `Bearer ${token}`,

        },

      }

    );

    updateField("image", selectedImage);

    navigate("/creating-friend");

  } catch (error) {

  console.log("FULL ERROR:", error);

  console.log("RESPONSE:", error.response);

  console.log("DATA:", error.response?.data);

  alert(error.response?.data?.message || "Unable to save onboarding.");

}

};

      return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-10"
      style={{
        backgroundImage: `url(${bgImg})`,
      }}
    >
      <div className="w-full max-w-7xl">

        {/* Heading */}

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-5xl font-bold text-white mb-3"
          style={{
            fontFamily: "'Playfair Display', serif",
            textShadow: "0 0 20px rgba(197,140,255,.9)",
          }}
        >
          Choose Your Best Friend
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .3 }}
          className="text-center text-white/70 text-lg mb-16"
        >
          The one you choose will always stay beside you.
        </motion.p>

        {/* Carousel */}

        <div className="flex justify-center items-center gap-8">

          {/* Previous Card */}

          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={previous}
            className="cursor-pointer"
          >
            <img
              src={images[previousIndex]}
              alt="Previous"
              className="w-56 h-[360px] object-cover rounded-3xl opacity-40 blur-[2px]"
            />

            <p className="text-center mt-4 text-white/60">
              Previous
            </p>
          </motion.div>

          {/* Selected */}

          <AnimatePresence mode="wait">

            <motion.div
              key={current}
              initial={{
                opacity: 0,
                scale: .92,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: .92,
              }}
              transition={{
                duration: .35,
              }}
              className="relative"
            >

              <img
                src={images[current]}
                alt="Selected"
                className="w-[330px] h-[500px] object-cover rounded-[35px] border border-[#C58CFF]/40 shadow-[0_0_45px_rgba(197,140,255,.45)]"
              />

              <div
                className="absolute inset-0 rounded-[35px]"
                style={{
                  boxShadow:
                    "0 0 60px rgba(197,140,255,.25)",
                }}
              />

            </motion.div>

          </AnimatePresence>

          {/* Next */}

          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={next}
            className="cursor-pointer"
          >
            <img
              src={images[nextIndex]}
              alt="Next"
              className="w-56 h-[360px] object-cover rounded-3xl opacity-40 blur-[2px]"
            />

            <p className="text-center mt-4 text-white/60">
              Next
            </p>

          </motion.div>

        </div>

                {/* Friend Name */}

        <motion.h2
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-12 text-4xl text-white font-semibold"
          style={{
            fontFamily: "'Playfair Display', serif",
            textShadow: "0 0 20px rgba(197,140,255,.8)",
          }}
        >
          {friendName}
        </motion.h2>

        <motion.p
          key={current + "quote"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4 text-white/70 text-lg"
        >
          I've been waiting to meet you. 💜
        </motion.p>

        {/* Indicators */}

        <div className="flex justify-center gap-3 mt-8">

          {images.map((_, index) => (

            <motion.div
              key={index}
              animate={{
                width: current === index ? 28 : 10,
                opacity: current === index ? 1 : .35,
              }}
              className="h-[10px] rounded-full bg-[#C58CFF]"
            />

          ))}

        </div>

        {/* Center Button */}

        <div className="w-full flex justify-center mt-10">

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: .97 }}
            onClick={handleContinue}
            className="px-14 py-4 rounded-2xl
            text-white text-lg font-semibold
            bg-gradient-to-r
            from-[#8E63FF]
            to-[#C58CFF]
            shadow-[0_0_35px_rgba(157,92,255,.7)]"
          >
            Choose {friendName} ❤️
          </motion.button>

        </div>

      </div>

    </div>
  );

}