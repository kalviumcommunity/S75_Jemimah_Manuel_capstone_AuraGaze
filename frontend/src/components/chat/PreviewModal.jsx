import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiFile, FiTrash2 } from "react-icons/fi";

function formatFileSize(bytes) {
  if (bytes === null || bytes === undefined) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PreviewModal({ attachment, onClose, onRemove }) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const isImage = Boolean(attachment?.previewUrl);

  return (
    <AnimatePresence>
      {attachment && (
        <motion.div
          key="backdrop"
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
            key="card"
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

            {/* Preview area */}
            <div className="flex items-center justify-center bg-black/30 max-h-[60vh] min-h-[200px]">
              {isImage ? (
                <img
                  src={attachment.previewUrl}
                  alt={attachment.name}
                  className="max-h-[60vh] w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 py-14 text-white/70">
                  <div
                    className="
                      h-16
                      w-16
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      bg-violet-500/15
                      border
                      border-violet-400/20
                      text-violet-300
                    "
                  >
                    <FiFile size={26} />
                  </div>
                  <span className="text-sm">{attachment.name}</span>
                </div>
              )}
            </div>

            {/* Info + actions */}
            <div className="px-5 py-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-white truncate">{attachment.name}</p>
                <p className="text-xs text-white/40 mt-0.5">{formatFileSize(attachment.size)}</p>
              </div>

              {onRemove && (
                <button
                  onClick={() => {
                    onRemove(attachment.id);
                    onClose();
                  }}
                  className="
                    shrink-0
                    flex
                    items-center
                    gap-2
                    px-3
                    py-2
                    rounded-2xl
                    text-sm
                    text-red-300
                    bg-red-500/10
                    border
                    border-red-400/20
                    hover:bg-red-500/20
                    transition-colors
                  "
                >
                  <FiTrash2 size={14} />
                  Remove
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}