import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { motion } from "framer-motion";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function GoogleAuthButton({
  onSuccess,
  onError,
  disabled = false,
}) {
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    scope: "openid email profile",

    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);

        /*
         * Google gives us an OAuth access token.
         *
         * Send it to the Aura Gaze backend.
         * The backend gets the Google user information,
         * creates/finds the MongoDB user,
         * and returns the Aura Gaze JWT.
         */

        const response = await axios.post(
          `${backendURL}/auth/google`,
          {
            accessToken: tokenResponse.access_token,
          }
        );

        const data = response.data;

        // Store Aura Gaze authentication
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);

        if (onSuccess) {
          onSuccess(data);
        }
      } catch (error) {
        console.error(
          "Google authentication failed:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Google authentication failed. Please try again.";

        if (onError) {
          onError(message);
        }
      } finally {
        setLoading(false);
      }
    },

    onError: () => {
      setLoading(false);

      if (onError) {
        onError(
          "Google sign-in was cancelled or failed."
        );
      }
    },
  });

  const handleGoogleLogin = () => {
    if (disabled || loading) return;

    setLoading(true);
    googleLogin();
  };

  return (
    <motion.button
      type="button"
      onClick={handleGoogleLogin}
      disabled={disabled || loading}
      whileHover={{
        scale:
          disabled || loading
            ? 1
            : 1.02,
      }}
      whileTap={{
        scale:
          disabled || loading
            ? 1
            : 0.98,
      }}
      className="
        w-full
        h-14
        rounded-2xl
        flex
        items-center
        justify-center
        gap-3
        bg-white
        text-gray-800
        font-medium
        shadow-lg
        shadow-black/10
        border
        border-white/20
        transition-all
        duration-200
        hover:bg-gray-50
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      {/* Google G logo */}
      <span
        className="
          w-6
          h-6
          rounded-full
          flex
          items-center
          justify-center
          font-bold
          text-lg
        "
      >
        G
      </span>

      <span>
        {loading
          ? "Connecting to Google..."
          : "Continue with Google"}
      </span>
    </motion.button>
  );
}