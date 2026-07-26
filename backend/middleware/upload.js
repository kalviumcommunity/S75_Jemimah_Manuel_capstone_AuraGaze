const multer = require("multer");

// ==========================================
// Multer Configuration — Profile Image Upload
// ==========================================
//
// Images are stored as base64 strings directly on the
// User document (user.friend.image), matching the existing
// schema already used for onboarding-selected friend images.
//
// Memory storage (not disk) is used because we only need
// the raw buffer momentarily to convert it to base64 —
// nothing needs to persist to disk.
//
// ==========================================

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// 3MB raw file limit. Base64 encoding inflates size by
// roughly 33%, so a 3MB image becomes ~4MB as a string —
// comfortably under MongoDB's 16MB per-document limit,
// even accounting for the rest of the User document's
// fields and headroom for future growth.
const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new Error(
        "Unsupported file type. Please upload a JPG, JPEG, PNG, or WEBP image."
      ),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
});

module.exports = upload;