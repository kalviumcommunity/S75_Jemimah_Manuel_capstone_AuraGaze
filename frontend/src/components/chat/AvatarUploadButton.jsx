import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCamera, FiCheck, FiX } from "react-icons/fi";

import colors from "../../theme/colors";
import { updateFriendImage } from "../../services/userService";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3MB — matches backend limit

// ==========================================
// Floating Camera / Edit Button + Upload Flow
// ==========================================
// Sits at the bottom-right of the avatar. Clicking opens the
// device's native file picker. After a valid image is chosen,
// switches to a preview + Save/Cancel state instead of
// uploading immediately, so the user can back out before
// anything is sent to the server.

export default function AvatarUploadButton({
  size = 168, // matches Avatar "xl" size by default
  onUploaded, // (newImageDataUri) => void — called after a successful save
}) {
  const fileInputRef = useRef(null);

  const [previewSrc, setPreviewSrc] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const buttonSize = Math.max(36, Math.round(size * 0.26));

  const openPicker = () => {
    setError("");
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    // Reset the input so selecting the same file twice in a
    // row still fires onChange.
    e.target.value = "";

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please choose a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError("Image must be smaller than 3MB.");
      return;
    }

    setError("");
    setSelectedFile(file);
    setPreviewSrc(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    if (previewSrc) URL.revokeObjectURL(previewSrc);
    setPreviewSrc(null);
    setSelectedFile(null);
    setError("");
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError("");

    try {
      const result = await updateFriendImage(selectedFile);

      onUploaded?.(result.image);

      if (previewSrc) URL.revokeObjectURL(previewSrc);
      setPreviewSrc(null);
      setSelectedFile(null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Couldn't update the picture. Try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* ==========================================
          Floating Camera Button
      ========================================== */}
      <motion.button
        onClick={openPicker}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="absolute rounded-full flex items-center justify-center overflow-hidden"
        style={{
          width: buttonSize,
          height: buttonSize,
          bottom: -buttonSize * 0.12,
          right: -buttonSize * 0.12,
          background: colors.card.glass,
          border: `1px solid ${colors.border.strong}`,
          backdropFilter: "blur(12px)",
          boxShadow: `0 0 20px ${colors.glow.violet}`,
        }}
      >
        {/* Ripple pulse behind the icon */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="absolute inset-0 rounded-full"
          style={{ background: colors.glow.violet }}
        />

        {/* Shimmer sweep */}
        <motion.div
          animate={{ x: ["-150%", "220%"] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
          className="absolute inset-y-0 pointer-events-none"
          style={{
            width: buttonSize * 0.6,
            background:
              "linear-gradient(105deg, transparent, rgba(255,255,255,.4), transparent)",
            transform: "skewX(-15deg)",
          }}
        />

        <FiCamera
          size={buttonSize * 0.45}
          style={{ color: colors.text.primary, position: "relative", zIndex: 2 }}
        />
      </motion.button>

      {/* ==========================================
          Preview + Save/Cancel Overlay
      ========================================== */}
      <AnimatePresence>
        {previewSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-6"
            style={{ background: "rgba(7,3,18,.75)", backdropFilter: "blur(6px)" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative flex flex-col items-center rounded-[28px] p-8"
              style={{
                background: colors.background.secondary,
                border: `1px solid ${colors.border.normal}`,
                boxShadow: `0 30px 80px ${colors.shadow.dark}`,
                maxWidth: 360,
                width: "100%",
              }}
            >
              <p
                className="mb-5 text-sm font-medium"
                style={{ color: colors.text.secondary }}
              >
                New profile picture
              </p>

              <div
                className="relative rounded-full overflow-hidden mb-6"
                style={{
                  width: 160,
                  height: 160,
                  border: `2px solid ${colors.border.strong}`,
                  boxShadow: `0 0 30px ${colors.glow.violet}`,
                }}
              >
                <img
                  src={previewSrc}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {error && (
                <p
                  className="mb-4 text-sm text-center"
                  style={{ color: "#F87171" }}
                >
                  {error}
                </p>
              )}

              <div className="flex items-center gap-3 w-full">
                <motion.button
                  onClick={handleCancel}
                  disabled={uploading}
                  whileHover={{ scale: uploading ? 1 : 1.03 }}
                  whileTap={{ scale: uploading ? 1 : 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium"
                  style={{
                    background: colors.card.glass,
                    border: `1px solid ${colors.border.normal}`,
                    color: colors.text.secondary,
                    opacity: uploading ? 0.5 : 1,
                  }}
                >
                  <FiX size={16} />
                  Cancel
                </motion.button>

                <motion.button
                  onClick={handleSave}
                  disabled={uploading}
                  whileHover={{ scale: uploading ? 1 : 1.03 }}
                  whileTap={{ scale: uploading ? 1 : 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold"
                  style={{
                    background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.accent})`,
                    color: colors.text.primary,
                    boxShadow: `0 0 25px ${colors.glow.violet}`,
                    opacity: uploading ? 0.7 : 1,
                  }}
                >
                  {uploading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                    />
                  ) : (
                    <>
                      <FiCheck size={16} />
                      Save
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}