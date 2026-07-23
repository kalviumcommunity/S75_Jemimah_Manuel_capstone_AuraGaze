import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AuthLayout from "../../components/layout/AuthLayout";
import Typography from "../../components/ui/Typography";
import FriendCarousel from "../../components/ui/FriendCarousel";

import spacing from "../../theme/spacing";

import { useOnboarding } from "../../context/OnboardingContext";
import { friends } from "../../data/friends";

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
      console.log(error);
      alert(error.response?.data?.message || "Unable to save onboarding.");
    }
  };

  return (
    <AuthLayout size="lg">
      {/* ==========================================
          Hero Section
      ========================================== */}

      <div
        style={{
          position: "relative",
          marginBottom: spacing.margin["2xl"],
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.45, 0.75, 0.45],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: "50%",
            top: "-35px",
            transform: "translateX(-50%)",
            width: 520,
            height: 220,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,.22) 0%, rgba(168,85,247,.10) 45%, transparent 75%)",
            filter: "blur(70px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <Typography
          variant="caption"
          align="center"
          animate
          style={{
            position: "relative",
            zIndex: 2,
            display: "block",
            marginBottom: spacing.margin.md,
            letterSpacing: "8px",
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          STEP 6 OF 6 ✨
        </Typography>

        <Typography
          variant="hero"
          align="center"
          animate
          style={{
            position: "relative",
            zIndex: 2,
            marginBottom: spacing.margin.sm,
            background:
              "linear-gradient(180deg,#FFFFFF 0%,#FFFFFF 30%,#F7F0FF 60%,#E6D4FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: `
              0 0 8px rgba(255,255,255,.95),
              0 0 18px rgba(255,255,255,.80),
              0 0 36px rgba(168,85,247,.55),
              0 0 72px rgba(139,92,246,.40),
              0 0 120px rgba(168,85,247,.22)
            `,
          }}
        >
          Choose Your Best Friend
        </Typography>

        <Typography
          variant="subtitle"
          align="center"
          animate
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 620,
            margin: "0 auto",
            lineHeight: 1.8,
            fontSize: "1.15rem",
          }}
        >
          This is the beginning of your friendship.
          <br />
          Choose the companion who feels right for you.{"\u00A0"}💜
        </Typography>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 160 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          style={{
            height: 3,
            margin: "28px auto 0",
            borderRadius: 999,
            background: "linear-gradient(to right,#8B5CF6,#D8B4FE,#8B5CF6)",
            boxShadow: "0 0 25px rgba(168,85,247,.5)",
          }}
        />
      </div>

      {/* ==========================================
          Carousel
      ========================================== */}

      <FriendCarousel
        images={images}
        current={current}
        previous={previous}
        next={next}
        friendName={friendName}
        companionQuotes={companionQuotes}
        handleContinue={handleContinue}
      />
    </AuthLayout>
  );
}