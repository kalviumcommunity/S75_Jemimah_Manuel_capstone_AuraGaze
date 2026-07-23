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
      const response = await axios.post(`${backendURL}/auth/signup`, formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);

      navigate("/nickname");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
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
          marginBottom: spacing.margin.lg,
        }}
      >
        <Typography
          variant="hero"
          align="center"
          animate
          style={{
            marginBottom: spacing.margin.sm,
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(42px, 6vw, 64px)",
            lineHeight: 1.15,
            textShadow:
              "0 0 12px rgba(197,140,255,0.85), 0 0 28px rgba(157,92,255,0.6), 0 0 55px rgba(124,92,252,0.45)",
          }}
        >
          Create Account
        </Typography>

        <Typography
  variant="subtitle"
  align="center"
  animate
  style={{
    maxWidth: 420,
    margin: "0 auto",
    fontSize: "16px",
    lineHeight: 1.6,
    opacity: 0.9,
  }}
>
  Begin your beautiful friendship journey.
  <br />
  Create your account and get started{"\u00A0"}💜
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
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Choose a username"
          autoComplete="username"
          required
        />

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

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Retype your password"
          autoComplete="new-password"
          required
          error={error === "Passwords do not match." ? error : undefined}
        />

        <div style={{ marginTop: spacing.margin.lg }}>
          <PrimaryButton type="submit" loading={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </PrimaryButton>
        </div>

        <div
          className="flex items-center"
          style={{
            marginTop: spacing.margin.lg,
            marginBottom: spacing.margin.lg,
            gap: spacing.margin.md,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.12)" }} />

          <Typography variant="caption" style={{ letterSpacing: "4px" }}>
            OR
          </Typography>

          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.12)" }} />
        </div>

        <SecondaryButton type="button" onClick={() => navigate("/login")}>
          Already have an account?
        </SecondaryButton>
      </form>
    </AuthLayout>
  );
}