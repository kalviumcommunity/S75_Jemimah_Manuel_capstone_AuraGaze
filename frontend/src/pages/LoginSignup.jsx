import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthLayout from "../components/layout/AuthLayout";

import Typography from "../components/ui/Typography";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "../components/ui/SecondaryButton";

import spacing from "../theme/spacing";
import animations from "../theme/animations";

export default function LoginSignup() {
  const navigate = useNavigate();

  return (
    <AuthLayout size="md">
      <motion.div
        initial={animations.fadeUp.hidden}
        animate={animations.fadeUp.visible}
        transition={{
          duration: animations.duration.slow,
        }}
        style={{
          textAlign: "center",
        }}
      >
        <motion.div
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            fontSize: "46px",
            marginBottom: spacing.margin.md,
          }}
        >
          
        </motion.div>

        <Typography
          variant="caption"
          align="center"
          style={{
            letterSpacing: "0.35em",
            marginBottom: spacing.margin.sm,
          }}
        >
          AURA GAZE ✨
        </Typography>

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
          Welcome
        </Typography>

        <Typography
          variant="subtitle"
          align="center"
          style={{
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          Every meaningful friendship begins with
          one simple conversation.
        </Typography>

        <Typography
          variant="body"
          align="center"
          style={{
            marginTop: spacing.margin.lg,
            opacity: 0.9,
          }}
        >
          Your AI companion is waiting 💜
        </Typography>
      </motion.div>

      <div
        style={{
          marginTop: spacing.margin.hero,
        }}
      >
        <PrimaryButton size="lg" onClick={() => navigate("/login")}>
          Continue with Login
        </PrimaryButton>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacing.gap.md,
            marginTop: spacing.margin.lg,
            marginBottom: spacing.margin.lg,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,.18), transparent)",
            }}
          />

          <Typography
            variant="caption"
            align="center"
            style={{
              opacity: 0.65,
              textTransform: "uppercase",
            }}
          >
            OR
          </Typography>

          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to left, transparent, rgba(255,255,255,.18), transparent)",
            }}
          />
        </div>

        <SecondaryButton size="lg" variant="glass" onClick={() => navigate("/signup")}>
          Begin a New Friendship
        </SecondaryButton>
      </div>
    </AuthLayout>
  );
}