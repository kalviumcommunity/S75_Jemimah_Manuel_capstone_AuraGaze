const multer = require("multer");

// ==========================================
// Multer Configuration — Chat Attachment Upload
// ==========================================
//
// Separate from middleware/upload.js (profile picture upload):
// chat attachments need a wider set of mime types (images,
// video, common documents) and support for multiple files per
// message, so they get their own multer instance instead of
// reusing the profile-image one.
//
// Like the profile picture upload, files are kept in memory
// and converted to base64 data URIs in the controller — no
// disk storage or external bucket involved, keeping this
// consistent with the rest of the app. Because each attachment
// ends up living inside its own Chat document, the per-file
// limit below is kept well under MongoDB's 16MB per-document
// cap even after base64's ~33% size inflation.
//
// ==========================================

const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  // Video
  "video/mp4",
  "video/quicktime",
  "video/webm",
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-zip-compressed",
];

// 8MB raw file limit per attachment. Base64 inflates this to
// roughly 11MB — safely under MongoDB's 16MB document limit,
// with headroom for the rest of the Chat document.
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

// Cap how many files can ride on a single message.
const MAX_FILES_PER_MESSAGE = 4;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new Error(
        "Unsupported file type. Please upload an image, video, or common document format."
      ),
      false
    );
  }

  cb(null, true);
};

const chatUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: MAX_FILES_PER_MESSAGE,
  },
});

module.exports = chatUpload;