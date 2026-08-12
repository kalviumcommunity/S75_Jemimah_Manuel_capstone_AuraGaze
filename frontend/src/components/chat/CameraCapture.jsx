import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCamera, FiRotateCcw, FiCheck, FiImage } from "react-icons/fi";

// Converts a base64 data URL (what react-webcam's getScreenshot() returns)
// into a real File object, so it can flow through the exact same
// handleFilesSelected pipeline as gallery/document picks.
function dataUrlToFile(dataUrl, filename) {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/data:(.*);base64/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  return new File([bytes], filename, { type: mime });
}

export default function CameraCapture({ onCapture, onClose, onFallbackToFilePicker }) {
  const webcamRef = useRef(null);
  const [captured, setCaptured] = useState(null); // data URL of the just-taken shot
  const [error, setError] = useState("");

  const handleCapture = useCallback(() => {
    const shot = webcamRef.current?.getScreenshot();
    if (shot) setCaptured(shot);
  }, []);

  const handleUsePhoto = () => {
    if (!captured) return;
    onCapture(dataUrlToFile(captured, `photo-${Date.now()}.jpg`));
  };

  const handleRetake = () => setCaptured(null);

  const handleUserMediaError = () => {
    setError("Camera access was denied or unavailable.");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-black/70
          backdrop-blur-sm
          px-4
        "
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="
            relative
            w-full
            max-w-md
            rounded-3xl
            border
            border-white/10
            bg-[#150b28]/95
            backdrop-blur-2xl
            shadow-[0_20px_60px_rgba(0,0,0,0.5)]
            overflow-hidden
          "
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="
              absolute
              top-3
              right-3
              z-10
              h-8
              w-8
              rounded-full
              bg-black/50
              flex
              items-center
              justify-center
              text-white
              hover:bg-black/70
              transition-colors
            "
          >
            <FiX size={16} />
          </button>

          {/* Viewfinder / captured preview / error state */}
          <div className="bg-black/40 aspect-[4/3] flex items-center justify-center">
            {error ? (
              <div className="flex flex-col items-center gap-4 px-6 text-center text-white/70">
                <FiCamera size={32} className="text-violet-300" />
                <p className="text-sm">{error}</p>
                <button
                  onClick={() => {
                    onClose();
                    onFallbackToFilePicker?.();
                  }}
                  className="
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-2xl
                    text-sm
                    bg-violet-500/20
                    border
                    border-violet-400/30
                    text-violet-200
                    hover:bg-violet-500/30
                    transition-colors
                  "
                >
                  <FiImage size={14} />
                  Choose from files instead
                </button>
              </div>
            ) : captured ? (
              <img src={captured} alt="Captured" className="w-full h-full object-cover" />
            ) : (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                onUserMediaError={handleUserMediaError}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Controls */}
          {!error && (
            <div className="px-5 py-4 flex items-center justify-center gap-3">
              {captured ? (
                <>
                  <button
                    onClick={handleRetake}
                    className="
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2.5
                      rounded-2xl
                      text-sm
                      text-white/80
                      bg-white/[0.06]
                      border
                      border-white/15
                      hover:bg-white/10
                      transition-colors
                    "
                  >
                    <FiRotateCcw size={14} />
                    Retake
                  </button>

                  <button
                    onClick={handleUsePhoto}
                    className="
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2.5
                      rounded-2xl
                      text-sm
                      text-white
                      bg-gradient-to-r
                      from-violet-500
                      to-fuchsia-500
                      shadow-[0_0_20px_rgba(168,85,247,.4)]
                      hover:brightness-110
                      transition-[filter]
                    "
                  >
                    <FiCheck size={14} />
                    Use photo
                  </button>
                </>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={handleCapture}
                  className="
                    h-14
                    w-14
                    rounded-full
                    flex
                    items-center
                    justify-center
                    bg-gradient-to-r
                    from-violet-500
                    to-fuchsia-500
                    shadow-[0_0_25px_rgba(168,85,247,.55)]
                    text-white
                  "
                >
                  <FiCamera size={22} />
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}