import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AuthLayout from "../components/layout/AuthLayout";
import Typography from "../components/ui/Typography";
import TextField from "../components/ui/TextField";
import PrimaryButton from "../components/ui/PrimaryButton";

import spacing from "../theme/spacing";

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

      if (response.data.profileCompleted) {
        navigate("/chat");
      } else {
        navigate("/nickname");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout size="md">
      {/* ===========================
          Hero Section
      =========================== */}

      <div
        style={{
          marginBottom: spacing.margin.xl,
        }}
      >
        <Typography
          variant="hero"
          align="center"
          animate
          style={{
            marginBottom: spacing.margin.md,
            fontFamily: "'Playfair Display', serif",
            textShadow:
              "0 0 12px rgba(197,140,255,0.85), 0 0 28px rgba(157,92,255,0.6), 0 0 55px rgba(124,92,252,0.45)",
          }}
        >
          Welcome Back
        </Typography>

        <Typography
          variant="subtitle"
          align="center"
          animate
          style={{
            maxWidth: 420,
            margin: "0 auto",
            lineHeight: 1.8,
          }}
        >
          Your best friend has been waiting.
          <br />
          Login and continue your journey 💜
        </Typography>
      </div>

      {/* ===========================
          Error Message
      =========================== */}

      {error && (
        <div
          style={{
            marginBottom: spacing.margin.lg,
            padding: "14px 18px",
            borderRadius: 18,
            background: "rgba(239,68,68,.12)",
            border: "1px solid rgba(239,68,68,.30)",
            color: "#FCA5A5",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}

      {/* ===========================
          Login Form
      =========================== */}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          autoComplete="email"
          required
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        <div
          className="flex justify-end"
          style={{ marginBottom: spacing.margin.lg }}
        >
          <button
            type="button"
            className="text-white/60 hover:text-white transition text-sm"
          >
            Forgot Password?
          </button>
        </div>

        <PrimaryButton type="submit" loading={loading}>
          {loading ? "Logging in..." : "Continue"}
        </PrimaryButton>
      </form>
    </AuthLayout>
  );
}