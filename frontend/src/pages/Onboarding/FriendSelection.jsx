import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import BackgroundGlow from "../../components/ui/BackgroundGlow";
import AnimatedParticles from "../../components/ui/AnimatedParticles";
import Typography from "../../components/ui/Typography";
import FriendCarousel from "../../components/ui/FriendCarousel";

import { useOnboarding } from "../../context/OnboardingContext";
import { friends } from "../../data/friends";
import gradients from "../../theme/gradients";

import logo from "../../assets/images/background/logo.png";
import bgImg from "../../assets/images/background/bg.png";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function FriendSelection() {
  const navigate = useNavigate();

  const { onboardingData, updateField } = useOnboarding();
  const { gender, age, friendName } = onboardingData;

  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");

  const companionQuotes = useMemo(
    () => [
      "I've been waiting to meet you. 💜",
      "Let's create unforgettable memories together.",
      "You'll never have to feel alone again.",
      "I'll always be here whenever you need me.",
      "Our story begins today ✨",
      "Every adventure starts with one hello.",
      "I'm excited to know everything about you.",
      "Let's laugh, dream and grow together.",
      "Your happiness matters to me.",
      "I can't wait to become your best friend.",
    ],
    []
  );

  useEffect(() => {
    let imageArray = [];

    if (gender === "male") {
      if (age >= 6 && age <= 18) {
        imageArray = friends.school_boy;
      } else if (age <= 40) {
        imageArray = friends.young_men;
      } else {
        imageArray = friends.old_men;
      }
    } else {
      if (age >= 6 && age <= 18) {
        imageArray = friends.school_girl;
      } else if (age <= 40) {
        imageArray = friends.young_women;
      } else {
        imageArray = friends.old_women;
      }
    }

    setImages(imageArray);
    setCurrent(0);
    setSelectedImage(imageArray[0]);
  }, [gender, age]);

  const previous = () => {
    const index = current === 0 ? images.length - 1 : current - 1;
    setCurrent(index);
    setSelectedImage(images[index]);
  };

  const next = () => {
    const index = current === images.length - 1 ? 0 : current + 1;
    setCurrent(index);
    setSelectedImage(images[index]);
  };

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
      alert(error.response?.data?.message || "Unable to save onboarding.");
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundPosition: "center 85%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <BackgroundGlow />
      <AnimatedParticles />

      <div
        className="absolute inset-0"
        style={{ background: gradients.overlay.auth }}
      />

      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-50 cursor-pointer border-none bg-transparent p-0"
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute w-32 h-32 rounded-full bg-violet-500/20 blur-3xl" />

          <img
            src={logo}
            alt="Aura Gaze"
            className="relative w-24 h-24 object-contain"
            style={{
              filter: "drop-shadow(0 0 18px rgba(168,85,247,.65))",
            }}
          />
        </div>
      </button>

      {/* Heading — kept narrow & centered, separate from the full-width carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 w-full max-w-xl px-6 text-center"
        style={{ marginBottom: "14px" }}
      >
        <Typography
          variant="hero"
          align="center"
          animate
          style={{
            marginBottom: "6px",
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(26px, 3.5vw, 36px)",
            lineHeight: 1.15,
            textShadow:
              "0 0 12px rgba(197,140,255,0.85), 0 0 28px rgba(157,92,255,0.6), 0 0 55px rgba(124,92,252,0.45)",
          }}
        >
          Choose Your Best Friend
        </Typography>

        <Typography
          variant="subtitle"
          align="center"
          animate
          style={{ fontSize: "14px", opacity: 0.9 }}
        >
          Choose the companion who feels right for you.{"\u00A0"}💜
        </Typography>
      </motion.div>

      {/* Carousel — full width, the dominant element on the page */}
<div className="relative z-20" style={{ width: "100vw" }}>
  <FriendCarousel
    images={images}
    current={current}
    previous={previous}
    next={next}
    friendName={friendName}
    companionQuotes={companionQuotes}
    handleContinue={handleContinue}
  />
</div>
    </div>
  );
}