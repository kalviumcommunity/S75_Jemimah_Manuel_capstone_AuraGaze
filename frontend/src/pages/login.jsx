import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

import bgImg from "../assets/images/background/bg.png";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${backendURL}/`)
      .then(() => console.log("Backend is awake"))
      .catch((err) => console.log("Backend wakeup failed", err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${backendURL}/auth/login`, formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);

      // Always go straight to chat after login
      navigate("/chat");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-[#090413] px-5 py-10">

      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55" />

      {/* Purple Glow */}
      <div className="absolute w-[900px] h-[900px] rounded-full bg-[#8B5CFF]/20 blur-[220px] pointer-events-none" />

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md rounded-[32px] border border-white/15 bg-white/[0.08] backdrop-blur-[35px] shadow-[0_30px_120px_rgba(0,0,0,0.55)] px-8 py-10 sm:px-12 sm:py-14"
      >

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-center text-white text-4xl sm:text-5xl"
          style={{
            fontFamily: "'Playfair Display', serif",
            textShadow:
              "0 0 12px rgba(197,140,255,0.85), 0 0 28px rgba(157,92,255,0.6), 0 0 55px rgba(124,92,252,0.45)",
          }}
        >
          Welcome Back
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 mb-9 text-center text-[#D8C8FF] text-base sm:text-lg leading-7"
        >
          Your best friend has been waiting.
          <br />
          Login and continue your journey 💜
        </motion.p>

        {error && (
          <div className="mb-5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-center py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label className="text-[#D7BEFF]/80 text-sm">Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl bg-white/10 border border-white/20 px-5 py-4 text-white placeholder:text-white/40 outline-none focus:border-[#A96FFF] focus:ring-2 focus:ring-[#A96FFF]/40 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-[#D7BEFF]/80 text-sm">Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl bg-white/10 border border-white/20 px-5 py-4 text-white placeholder:text-white/40 outline-none focus:border-[#A96FFF] focus:ring-2 focus:ring-[#A96FFF]/40 transition"
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-white/60 hover:text-white transition text-sm"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 45px rgba(180,120,255,0.55)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="block w-full py-4 rounded-2xl bg-gradient-to-r from-[#8F5BFF] via-[#A96FFF] to-[#C58CFF] text-white text-lg sm:text-xl font-semibold shadow-[0_12px_35px_rgba(157,92,255,0.45)] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Continue"}
          </motion.button>

        </form>

      </motion.div>

    </div>
  );
}