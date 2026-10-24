import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [isSaving, setIsSaving] = useState(false);
  const [direction, setDirection] = useState(1);

  const companionQuotes = useMemo(
    () => [
      "I've been waiting to meet you. 💜",
      "Let's create unforgettable memories together.",
      "You'll always have someone to talk to.",
      "Every little moment can become a memory.",
      "Our story begins today. ✨",
      "I'm excited to get to know you.",
      "Let's laugh, dream, and grow together.",
      "Your happiness matters to me.",
    ],
    []
  );

  useEffect(() => {
    const numericAge = Number(age);
    let imageArray = [];

    if (gender === "male") {
      if (numericAge >= 6 && numericAge <= 18) {
        imageArray = friends.school_boy || [];
      } else if (numericAge <= 40) {
        imageArray = friends.young_men || [];
      } else {
        imageArray = friends.old_men || [];
      }
    } else if (gender === "female") {
      if (numericAge >= 6 && numericAge <= 18) {
        imageArray = friends.school_girl || [];
      } else if (numericAge <= 40) {
        imageArray = friends.young_women || [];
      } else {
        imageArray = friends.old_women || [];
      }
    }

    setImages(imageArray);
    setCurrent(0);
    setSelectedImage(imageArray[0] || "");
    setDirection(1);
  }, [gender, age]);

  const previous = useCallback(() => {
    if (!images.length || isSaving) return;
    setDirection(-1);
    const nextIndex = current === 0 ? images.length - 1 : current - 1;
    setCurrent(nextIndex);
    setSelectedImage(images[nextIndex] || "");
  }, [current, images, isSaving]);

  const next = useCallback(() => {
    if (!images.length || isSaving) return;
    setDirection(1);
    const nextIndex = current === images.length - 1 ? 0 : current + 1;
    setCurrent(nextIndex);
    setSelectedImage(images[nextIndex] || "");
  }, [current, images, isSaving]);

  const handleContinue = useCallback(async () => {
    if (isSaving) return;

    const imageToSave = selectedImage || images[current];
    if (!imageToSave) {
      window.alert("Your companion choices are still loading. Please try again in a moment.");
      return;
    }

    if (!backendURL) {
      window.alert("The backend URL is not configured. Please check your frontend environment settings.");
      return;
    }

    setIsSaving(true);

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
          image: imageToSave,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      updateField("image", imageToSave);
      navigate("/creating-friend");
    } catch (error) {
      console.error("Unable to save onboarding profile:", error);
      window.alert(
        error.response?.data?.message ||
          "Unable to save onboarding right now. Please try again."
      );
      setIsSaving(false);
    }
  }, [current, images, isSaving, navigate, onboardingData, selectedImage, updateField]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;

      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        target.closest("input, textarea, select, [contenteditable='true']");
      if (isTyping) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previous();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
        return;
      }

      if (event.key === "Enter") {
        if (target instanceof HTMLElement && target.closest("button")) return;
        event.preventDefault();
        void handleContinue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleContinue, next, previous]);

  const companionName = friendName?.trim() || "your best friend";

  return (
    <main
      className="relative isolate flex h-[100dvh] w-full flex-col justify-between overflow-hidden"
      style={{
        height: "100dvh",
        minHeight: 0,
        paddingTop: "clamp(14px, 2.2vh, 28px)",
        paddingBottom: "clamp(10px, 1.8vh, 20px)",
        boxSizing: "border-box",
        background: "#100622",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundPosition: "center 70%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <BackgroundGlow />
        <AnimatedParticles />
        <div className="absolute inset-0" style={{ background: gradients.overlay.auth }} />
      </div>

      <button
        type="button"
        onClick={() => navigate("/")}
        aria-label="Return to Aura Gaze home"
        className="absolute left-3 top-2.5 z-50 cursor-pointer border-0 bg-transparent p-0 sm:left-6 sm:top-3.5"
      >
        <span className="relative flex h-12 w-12 items-center justify-center sm:h-[68px] sm:w-[68px]">
          <span className="absolute inset-0 rounded-full bg-violet-500/20 blur-2xl" />
          <img
            src={logo}
            alt="Aura Gaze"
            className="relative h-full w-full object-contain"
            style={{ filter: "drop-shadow(0 0 16px rgba(168,85,247,.65))" }}
          />
        </span>
      </button>

      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full shrink-0 px-4 text-center"
      >
        <Typography
          variant="hero"
          align="center"
          animate
          style={{
            marginBottom: 3,
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(22px, 3vw, 36px)",
            lineHeight: 1.1,
            textShadow:
              "0 0 12px rgba(197,140,255,0.72), 0 0 30px rgba(157,92,255,0.48)",
          }}
        >
          Choose Your Best Friend
        </Typography>
        <Typography
          variant="subtitle"
          align="center"
          animate
          style={{ fontSize: "clamp(12px, 1.1vw, 14.5px)", opacity: 0.88 }}
        >
          Choose the companion who feels right for you. <span aria-hidden="true">💜</span>
        </Typography>
      </motion.header>

      <section className="relative z-10 my-auto flex min-h-0 flex-1 items-center justify-center px-1 sm:px-4">
        {images.length > 0 ? (
          <FriendCarousel
            images={images}
            current={current}
            previous={previous}
            next={next}
            direction={direction}
            friendName={companionName}
            companionQuotes={companionQuotes}
            handleContinue={handleContinue}
            isSaving={isSaving}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Typography variant="subtitle" align="center">
              No companion images are available for this selection yet.
            </Typography>
          </div>
        )}
      </section>
    </main>
  );
}