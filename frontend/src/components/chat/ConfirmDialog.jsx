import { AnimatePresence, motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";

import GlassCard from "../ui/GlassCard";
import colors from "../../theme/colors";
import spacing from "../../theme/spacing";

// ==========================================
// Reusable Confirmation Dialog
// ==========================================
// A single glass-styled confirm modal reused for every
// destructive action (clear chat, delete selected, delete one
// message) instead of three one-off implementations. Visually
// matches ProfileModal's open/close animation and GlassCard
// styling for consistency.

export default function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  danger = true,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[110] flex items-center justify-center px-4"
          style={{
            background: "rgba(7,3,18,.72)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full"
            style={{ maxWidth: 380 }}
          >
            <GlassCard size="sm" maxWidth={380} glow blur>
              <div
                className="relative z-20 flex flex-col items-center text-center"
                style={{ padding: spacing.padding.lg }}
              >
                <div
                  className="flex items-center justify-center rounded-full mb-4"
                  style={{
                    width: 52,
                    height: 52,
                    background: danger
                      ? "rgba(248,113,113,.12)"
                      : colors.card.glass,
                    border: `1px solid ${
                      danger ? "rgba(248,113,113,.3)" : colors.border.normal
                    }`,
                  }}
                >
                  <FiAlertTriangle
                    size={22}
                    style={{ color: danger ? "#F87171" : colors.text.secondary }}
                  />
                </div>

                <h3
                  className="text-lg font-semibold"
                  style={{
                    color: colors.text.primary,
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {title}
                </h3>

                <p
                  className="mt-2 text-sm leading-6"
                  style={{ color: colors.text.muted }}
                >
                  {message}
                </p>

                <div className="flex items-center gap-3 w-full mt-6">
                  <motion.button
                    onClick={onCancel}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 rounded-2xl py-3 text-sm font-medium"
                    style={{
                      background: colors.card.glass,
                      border: `1px solid ${colors.border.normal}`,
                      color: colors.text.secondary,
                    }}
                  >
                    {cancelLabel}
                  </motion.button>

                  <motion.button
                    onClick={onConfirm}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 rounded-2xl py-3 text-sm font-semibold"
                    style={{
                      background: danger
                        ? "linear-gradient(to right, #EF4444, #F87171)"
                        : `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.accent})`,
                      color: "#fff",
                      boxShadow: danger
                        ? "0 0 25px rgba(248,113,113,.4)"
                        : `0 0 25px ${colors.glow.violet}`,
                    }}
                  >
                    {confirmLabel}
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}