import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiImage, FiCamera, FiFile } from "react-icons/fi";

import CameraCapture from "./CameraCapture";

// Gallery and document still use plain hidden file inputs. Camera
// is special-cased below to open the in-app CameraCapture modal
// instead — the browser's file-input `capture` attribute is only
// honored by mobile browsers, so on desktop it just silently opens
// the OS file picker, which isn't the "take a photo" experience
// we actually want. The hidden camera input below is kept purely
// as a fallback if the user denies camera permission.
const OPTIONS = [
  {
    key: "gallery",
    label: "Photo & video",
    icon: FiImage,
    accept: "image/*,video/*",
  },
  {
    key: "camera",
    label: "Camera",
    icon: FiCamera,
    accept: "image/*",
  },
  {
    key: "document",
    label: "Document",
    icon: FiFile,
    accept: ".pdf,.doc,.docx,.txt,.csv,.xlsx,.zip",
  },
];

export default function AttachmentMenu({ onFilesSelected, onClose }) {
  const inputRefs = useRef({});
  const [showCamera, setShowCamera] = useState(false);

  const handlePick = (key) => {
    inputRefs.current[key]?.click();
  };

  const handleOptionClick = (key) => {
    if (key === "camera") {
      setShowCamera(true);
      return;
    }
    handlePick(key);
  };

  const handleChange = (e) => {
    onFilesSelected(e.target.files);
    e.target.value = ""; // reset so picking the same file again still fires onChange
    onClose?.();
  };

  const handlePhotoCaptured = (file) => {
    onFilesSelected([file]);
    setShowCamera(false);
    onClose?.();
  };

  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-white/40 mb-2 px-1">
        Attach
      </p>

      <div className="flex flex-col gap-1">
        {OPTIONS.map(({ key, label, icon: Icon, accept }) => (
          <motion.button
            key={key}
            whileHover={{ x: 2 }}
            onClick={() => handleOptionClick(key)}
            className="
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2.5
              rounded-2xl
              text-white/80
              hover:bg-white/10
              hover:text-violet-200
              transition-colors
              text-sm
            "
          >
            <span
              className="
                h-8
                w-8
                shrink-0
                rounded-full
                flex
                items-center
                justify-center
                bg-violet-500/15
                border
                border-violet-400/20
                text-violet-300
              "
            >
              <Icon size={15} />
            </span>

            {label}

            {/* Camera's input is fallback-only now, triggered from
                CameraCapture's error state if permission is denied. */}
            <input
              ref={(el) => (inputRefs.current[key] = el)}
              type="file"
              accept={accept}
              multiple={key !== "camera"}
              hidden
              onChange={handleChange}
            />
          </motion.button>
        ))}
      </div>

      {showCamera && (
        <CameraCapture
          onCapture={handlePhotoCaptured}
          onClose={() => setShowCamera(false)}
          onFallbackToFilePicker={() => handlePick("camera")}
        />
      )}
    </div>
  );
}