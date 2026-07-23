import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AuthLayout from "../components/layout/AuthLayout";
import Typography from "../components/ui/Typography";
import TextField from "../components/ui/TextField";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "../components/ui/SecondaryButton";

import spacing from "../theme/spacing";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${backendURL}/auth/signup`,
        formData
      );

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "username",
        response.data.username
      );

      navigate("/nickname");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Signup failed. Please try again."
      );
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
          position: "relative",
          marginBottom: spacing.margin.xl,
        }}
      >
        {/* Glow Behind Title */}

        <div
          style={{
            position: "absolute",

            left: "50%",
            top: "8px",

            transform: "translateX(-50%)",

            width: 380,
            height: 150,

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(168,85,247,.30) 0%, rgba(168,85,247,.16) 45%, transparent 80%)",

            filter: "blur(48px)",

            pointerEvents: "none",

            zIndex: 0,
          }}
        />

        <Typography
          variant="hero"
          align="center"
          animate
          style={{
            position: "relative",

            zIndex: 2,

            marginBottom: spacing.margin.md,

            background:
              "linear-gradient(180deg,#FFFFFF 0%,#FFFFFF 28%,#F7F0FF 60%,#E4D2FF 100%)",

            WebkitBackgroundClip: "text",

            WebkitTextFillColor: "transparent",

            textShadow: `
              0 0 8px rgba(255,255,255,.90),
              0 0 18px rgba(255,255,255,.75),
              0 0 36px rgba(168,85,247,.55),
              0 0 72px rgba(139,92,246,.40),
              0 0 120px rgba(168,85,247,.22)
            `,
          }}
        >
          Create Account
        </Typography>

        <Typography
          variant="subtitle"
          align="center"
          animate
          style={{
            position: "relative",

            zIndex: 2,

            maxWidth: 420,

            margin: "0 auto",

            lineHeight: 1.8,
          }}
        >
          Begin your beautiful friendship journey.
          <br />
          Create your account and get started 💜
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
          Signup Form
      =========================== */}

      <form onSubmit={handleSubmit}>
        {/* ===========================
            Email
        =========================== */}

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

        {/* ===========================
            Username
        =========================== */}

        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Choose a username"
          autoComplete="username"
          required
        />

        {/* ===========================
            Password
        =========================== */}

        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          autoComplete="new-password"
          required
        />

        {/* ===========================
            Confirm Password
        =========================== */}

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Retype your password"
          autoComplete="new-password"
          required
          error={
            error === "Passwords do not match."
              ? error
              : undefined
          }
        />

        <div
          style={{
            marginTop: spacing.margin.xl,
          }}
        >
          <PrimaryButton
            type="submit"
            loading={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </PrimaryButton>
        </div>

        {/* ===========================
            Divider
        =========================== */}

        <div
          className="flex items-center"
          style={{
            marginTop: spacing.margin.xl,
            marginBottom: spacing.margin.xl,
            gap: spacing.margin.md,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background: "rgba(255,255,255,.12)",
            }}
          />

          <Typography
            variant="caption"
            style={{
              letterSpacing: "4px",
            }}
          >
            OR
          </Typography>

          <div
            style={{
              flex: 1,
              height: 1,
              background: "rgba(255,255,255,.12)",
            }}
          />
        </div>

        {/* ===========================
            Login Button
        =========================== */}

        <SecondaryButton
          type="button"
          onClick={() => navigate("/login")}
        >
          Already have an account?
        </SecondaryButton>
      </form>
    </AuthLayout>
  );
}