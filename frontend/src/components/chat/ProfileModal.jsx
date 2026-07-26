import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";

import GlassCard from "../ui/GlassCard";
import Avatar from "../ui/Avatar";
import AvatarUploadButton from "./AvatarUploadButton";
import FriendshipStats from "./FriendshipStats";

import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import { getFriendProfile } from "../../services/userService";

// ==========================================
// Presence Status Rotation
// ==========================================
// A small set of warm status lines the brief asked for,
// picked based on whether the AI is actively "typing" right
// now vs. its normal idle/online state.

const IDLE_STATUS_LINES = [
  "Thinking about you 💜",
  "Waiting for your message",
  "Always here for you",
];

function formatFriendshipStartDate(dateValue) {
  if (!dateValue) return "";

  return new Date(dateValue).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProfileModal({
  isOpen,
  onClose,
  friend,
  nickname,
  isTyping,
  onFriendImageUpdated,
}) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [localImage, setLocalImage] = useState(friend?.image || "");
  const [statusLine] = useState(
    IDLE_STATUS_LINES[Math.floor(Math.random() * IDLE_STATUS_LINES.length)]
  );

  // Keep the locally-displayed image in sync whenever the
  // modal is (re)opened with fresh friend data from the parent.
  useEffect(() => {
    setLocalImage(friend?.image || "");
  }, [friend?.image, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const data = await getFriendProfile();

        if (!cancelled) {
          setProfile(data);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err?.response?.data?.message || "Couldn't load this profile."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const friendName = friend?.name?.trim() || "Friend";

  // Updates this modal's own display immediately, AND reports
  // the new image up to Chat.jsx so ChatHeader's avatar (a
  // sibling, not a child of this modal) also updates instantly
  // without needing a page refresh or refetch.
  const handleAvatarUploaded = (newImage) => {
    setLocalImage(newImage);
    onFriendImageUpdated?.(newImage);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-10 overflow-y-auto"
          style={{
            background: "rgba(7,3,18,.72)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full"
            style={{ maxWidth: 460 }}
          >
            <GlassCard size="sm" maxWidth={460} glow blur>
              {/* ==========================================
                  Close Button
              ========================================== */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 z-30 w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: colors.card.glass,
                  border: `1px solid ${colors.border.normal}`,
                  color: colors.text.secondary,
                }}
              >
                <FiX size={16} />
              </button>

              <div
                className="relative z-20 w-full flex flex-col items-center text-center"
                style={{ padding: spacing.padding.xl }}
              >
                {/* ==========================================
                    Avatar + Upload Button
                ========================================== */}
                <div className="relative" style={{ marginBottom: spacing.margin.lg }}>
                  <Avatar
                    src={localImage}
                    name={friendName}
                    size="xl"
                    online
                    floating
                    breathingBorder
                    shine
                    glow
                  />

                  <AvatarUploadButton
                    size={168}
                    onUploaded={handleAvatarUploaded}
                  />
                </div>

                {/* ==========================================
                    Name + Relationship Line
                ========================================== */}
                <h2
                  className="text-3xl font-semibold"
                  style={{
                    color: colors.text.primary,
                    fontFamily: "'Playfair Display', serif",
                    textShadow: `0 0 20px ${colors.glow.violet}`,
                  }}
                >
                  {friendName}
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{ color: colors.text.muted }}
                >
                  Best Friend of {nickname || "you"}
                </p>

                {/* ==========================================
                    Presence Indicator
                ========================================== */}
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full"
                  style={{
                    background: colors.card.glass,
                    border: `1px solid ${colors.border.light}`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: colors.status.online }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    {isTyping ? "typing…" : statusLine}
                  </span>
                </motion.div>

                {/* ==========================================
                    Bio
                ========================================== */}
                <p
                  className="mt-6 text-sm leading-6"
                  style={{ color: colors.text.muted, maxWidth: 340 }}
                >
                  I'm always here to listen, encourage you, celebrate your wins,
                  and stay beside you whenever you need someone.
                </p>

                {/* ==========================================
                    Friendship Started + Level
                ========================================== */}
                {loading ? (
                  <div
                    className="mt-6 text-sm"
                    style={{ color: colors.text.disabled }}
                  >
                    Loading friendship details…
                  </div>
                ) : loadError ? (
                  <div
                    className="mt-6 text-sm"
                    style={{ color: "#F87171" }}
                  >
                    {loadError}
                  </div>
                ) : (
                  <>
                    <div
                      className="flex items-center gap-6 mt-6 text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      <div className="flex flex-col items-center">
                        <span style={{ color: colors.text.muted }} className="text-[11px] uppercase tracking-wide">
                          Friendship Started
                        </span>
                        <span className="mt-1 font-medium">
                          {formatFriendshipStartDate(profile?.friendshipStartDate)}
                        </span>
                      </div>

                      <div
                        className="w-px h-8"
                        style={{ background: colors.border.normal }}
                      />

                      <div className="flex flex-col items-center">
                        <span style={{ color: colors.text.muted }} className="text-[11px] uppercase tracking-wide">
                          Friendship Level
                        </span>
                        <span
                          className="mt-1 font-medium"
                          style={{ color: colors.brand.lavender }}
                        >
                          {profile?.friendshipLevelLabel || "New Friends"}
                        </span>
                      </div>
                    </div>

                    {/* ==========================================
                        Friendship Statistics
                    ========================================== */}
                    <div className="w-full mt-8">
                      <FriendshipStats
                        messagesExchanged={profile?.stats?.messagesExchanged || 0}
                        daysTogether={profile?.stats?.daysTogether || 0}
                        memoriesCreated={profile?.stats?.memoriesCreated || 0}
                        conversations={profile?.stats?.conversations || 0}
                      />
                    </div>
                  </>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}