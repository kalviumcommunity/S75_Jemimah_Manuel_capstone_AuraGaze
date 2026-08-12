import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiFile,
  FiDownload,
  FiEdit3,
  FiTrash2,
  FiCheck,
  FiX,
} from "react-icons/fi";
import PreviewModal from "./PreviewModal";

function formatFileSize(bytes) {
  if (bytes === null || bytes === undefined) return "";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ChatBubble({
  id,
  sender,
  text,
  editSourceText,
  image,
  attachments = [],
  timestamp,
  isFirstInGroup = true,
  isLastInGroup = true,
  selectionMode = false,
  isSelected = false,
  onToggleSelect,
  onEdit,
  onDelete,
}) {
  const isAI = sender === "ai";
  const isUser = sender === "user";

  /*
   * The complete original message text.
   * This is important when a message has been split into fragments.
   */
  const editableText = editSourceText ?? text ?? "";

  const [previewing, setPreviewing] = useState(null);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(editableText);

  /*
   * Format timestamp.
   */
  const time = timestamp
    ? new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  /*
   * Separate attachments.
   */
  const images = attachments.filter((attachment) =>
    attachment.mimetype?.startsWith("image/")
  );

  const videos = attachments.filter((attachment) =>
    attachment.mimetype?.startsWith("video/")
  );

  const files = attachments.filter(
    (attachment) =>
      !attachment.mimetype?.startsWith("image/") &&
      !attachment.mimetype?.startsWith("video/")
  );

  /*
   * Don't render completely empty messages.
   */
  const hasRenderableContent =
    Boolean(text?.trim()) ||
    images.length > 0 ||
    videos.length > 0 ||
    files.length > 0;

  if (!hasRenderableContent && !isEditing) {
    return null;
  }

  /*
   * Open image preview.
   */
  const openImagePreview = (attachment) => {
    setPreviewing({
      name: attachment.name,
      size: attachment.size,
      previewUrl: attachment.url,
    });
  };

  /*
   * Selection mode.
   */
  const handleBubbleClick = () => {
    if (selectionMode) {
      onToggleSelect?.(id);
    }
  };

  /*
   * Editing.
   */
  const startEditing = () => {
    setEditValue(editableText);
    setIsEditing(true);
    setActionsVisible(false);
  };

  const cancelEditing = () => {
    setEditValue(editableText);
    setIsEditing(false);
  };

  const saveEdit = () => {
    const trimmed = editValue.trim();

    if (!trimmed || trimmed === editableText) {
      setIsEditing(false);
      return;
    }

    onEdit?.(id, trimmed);
    setIsEditing(false);
  };

  const handleEditKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      saveEdit();
    }

    if (event.key === "Escape") {
      cancelEditing();
    }
  };

  /*
   * Bubble tail.
   */
  const tailCornerClass = isLastInGroup
    ? isAI
      ? "rounded-bl-md"
      : "rounded-br-md"
    : isAI
    ? "rounded-bl-3xl"
    : "rounded-br-3xl";

  return (
    <>
      <motion.div
        layout
        initial={
          isUser
            ? {
                opacity: 0,
                x: 24,
                scale: 0.98,
              }
            : {
                opacity: 0,
                y: 10,
                scale: 0.98,
              }
        }
        animate={{
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`
          group
          relative
          flex
          w-full
          min-w-0
          items-end
          ${isAI ? "justify-start" : "justify-end"}
        `}
        onMouseEnter={() => {
          if (!selectionMode) {
            setActionsVisible(true);
          }
        }}
        onMouseLeave={() => {
          setActionsVisible(false);
        }}
      >
        {/* =========================================================
            SELECTION CHECKBOX
        ========================================================= */}
        {selectionMode && (
          <motion.button
            type="button"
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            onClick={handleBubbleClick}
            className="
              mr-2
              flex
              h-6
              w-6
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              transition-all
            "
            style={{
              background: isSelected
                ? "#8B5CF6"
                : "rgba(255,255,255,.06)",
              borderColor: isSelected
                ? "#8B5CF6"
                : "rgba(255,255,255,.2)",
            }}
            aria-label={
              isSelected
                ? "Deselect message"
                : "Select message"
            }
          >
            {isSelected && (
              <FiCheck
                size={13}
                className="text-white"
              />
            )}
          </motion.button>
        )}

        {/* =========================================================
            AI AVATAR
        ========================================================= */}
        {isAI && (
          <div
            className="
              mr-2
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border
              border-white/20
              bg-white/10
              shadow-[0_4px_18px_rgba(139,92,246,0.18)]
            "
          >
            {image ? (
              <img
                src={image}
                alt="friend"
                className="
                  block
                  h-full
                  w-full
                  object-cover
                  object-top
                "
              />
            ) : (
              <FiUser
                size={16}
                className="text-white"
              />
            )}
          </div>
        )}

        {/* =========================================================
            MESSAGE COLUMN
        ========================================================= */}
        <div
          className={`
            flex
            min-w-0
            w-auto
            max-w-[calc(100%-3rem)]
            flex-col

            sm:max-w-[78%]
            md:max-w-[72%]
            lg:max-w-[68%]
            xl:max-w-[64%]

            ${isAI ? "items-start" : "items-end"}
          `}
        >
          {/* =======================================================
              BUBBLE OUTER CONTAINER

              IMPORTANT:
              There is NO overflow-hidden here.

              The text is therefore never clipped by the bubble's
              visual/background layer.
          ======================================================= */}
          <div
            onClick={handleBubbleClick}
            className={`
              relative
              isolate
              w-fit
              max-w-full
              min-w-[72px]
              min-h-[42px]

              rounded-[22px]
              ${tailCornerClass}

              ${
                selectionMode
                  ? "cursor-pointer"
                  : ""
              }

              ${
                isSelected
                  ? "ring-2 ring-violet-400/80 ring-offset-2 ring-offset-transparent"
                  : ""
              }

              ${
                isAI
                  ? "text-white"
                  : "text-[#2C1D54]"
              }
            `}
          >
            {/* =====================================================
                VISUAL BACKGROUND LAYER

                This layer is clipped.

                The actual text/content is NOT inside this layer,
                so rounded-corner clipping can never cut characters.
            ===================================================== */}
            <div
              className={`
                pointer-events-none
                absolute
                inset-0
                -z-10
                overflow-hidden
                rounded-[inherit]
                border

                ${
                  isAI
                    ? `
                      border-white/15
                      bg-gradient-to-br
                      from-violet-500/20
                      via-purple-500/10
                      to-fuchsia-500/5
                    `
                    : `
                      border-white/20
                      bg-gradient-to-br
                      from-[#C9B6F5]
                      via-[#B9A6E8]
                      to-[#A891DD]
                    `
                }
              `}
              style={{
                boxShadow: isAI
                  ? "0 8px 32px rgba(139,92,246,0.18)"
                  : "0 8px 32px rgba(185,166,232,0.35)",
              }}
            >
              {/* =================================================
                  AI BACKDROP BLUR
              ================================================= */}
              {isAI && (
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    rounded-[inherit]
                  "
                  style={{
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                />
              )}

              {/* =================================================
                  TOP HIGHLIGHT
              ================================================= */}
              <div
                className="
                  pointer-events-none
                  absolute
                  left-0
                  right-0
                  top-0
                  h-px
                "
                style={{
                  background: isAI
                    ? "linear-gradient(to right, transparent, rgba(255,255,255,.45), transparent)"
                    : "linear-gradient(to right, transparent, rgba(255,255,255,.65), transparent)",
                }}
              />

              {/* =================================================
                  SOFT GLOW
              ================================================= */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -left-6
                  -top-6
                  h-24
                  w-24
                  rounded-full
                "
                style={{
                  background: isAI
                    ? "radial-gradient(circle, rgba(196,160,255,.25), transparent 70%)"
                    : "radial-gradient(circle, rgba(255,255,255,.35), transparent 70%)",
                  filter: "blur(8px)",
                }}
              />
            </div>

            {/* =====================================================
                CONTENT LAYER

                THIS IS THE IMPORTANT FIX.

                The content has its own padding and is NOT clipped
                by overflow-hidden.

                The first character therefore always has enough
                room to render completely.
            ===================================================== */}
            <div
              className="
                relative
                z-10
                min-w-0
                max-w-full
                px-4
                py-2.5
              "
            >
              {/* ===================================================
                  IMAGES
              =================================================== */}
              {images.length > 0 && (
                <div
                  className={`
                    relative
                    mb-2
                    grid
                    max-w-full
                    gap-1.5
                    overflow-hidden
                    rounded-2xl

                    ${
                      images.length === 1
                        ? "grid-cols-1"
                        : "grid-cols-2"
                    }
                  `}
                >
                  {images.map((img, index) => (
                    <button
                      type="button"
                      key={`${img.url}-${index}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        openImagePreview(img);
                      }}
                      className="
                        group/image
                        block
                        min-w-0
                        overflow-hidden
                        rounded-2xl
                        border
                        border-white/10
                        bg-black/10
                      "
                    >
                      <img
                        src={img.url}
                        alt={
                          img.name ||
                          "attachment"
                        }
                        className="
                          block
                          h-auto
                          w-full
                          max-h-64
                          object-cover
                          transition-all
                          duration-300
                          group-hover/image:scale-[1.02]
                          group-hover/image:brightness-90
                        "
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* ===================================================
                  VIDEOS
              =================================================== */}
              {videos.length > 0 && (
                <div className="relative mb-2 flex min-w-0 flex-col gap-2">
                  {videos.map((video, index) => (
                    <video
                      key={`${video.url}-${index}`}
                      controls
                      src={video.url}
                      className="
                        block
                        h-auto
                        w-full
                        max-h-72
                        rounded-2xl
                        bg-black/40
                      "
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    />
                  ))}
                </div>
              )}

              {/* ===================================================
                  FILES
              =================================================== */}
              {files.length > 0 && (
                <div className="relative mb-2 flex min-w-0 flex-col gap-2">
                  {files.map((file, index) => (
                    <a
                      key={`${file.url}-${index}`}
                      href={file.url}
                      download={file.name}
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      className={`
                        flex
                        min-w-0
                        w-full
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        px-3
                        py-2.5
                        transition-all

                        ${
                          isAI
                            ? `
                              border-white/15
                              bg-white/[0.06]
                              text-white
                              hover:bg-white/10
                            `
                            : `
                              border-[#2C1D54]/15
                              bg-white/30
                              text-[#2C1D54]
                              hover:bg-white/40
                            `
                        }
                      `}
                    >
                      {/* File icon */}
                      <span
                        className={`
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl

                          ${
                            isAI
                              ? "bg-violet-500/20 text-violet-200"
                              : "bg-[#2C1D54]/10 text-[#2C1D54]"
                          }
                        `}
                      >
                        <FiFile size={16} />
                      </span>

                      {/* File information */}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">
                          {file.name}
                        </span>

                        <span
                          className={`
                            block
                            text-[11px]

                            ${
                              isAI
                                ? "text-white/50"
                                : "text-[#2C1D54]/60"
                            }
                          `}
                        >
                          {formatFileSize(file.size)}
                        </span>
                      </span>

                      {/* Download icon */}
                      <FiDownload
                        size={15}
                        className="shrink-0 opacity-70"
                      />
                    </a>
                  ))}
                </div>
              )}

              {/* ===================================================
                  EDIT MODE
              =================================================== */}
              {isEditing ? (
                <div
                  className="relative min-w-0"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <textarea
                    autoFocus
                    value={editValue}
                    onChange={(event) => {
                      setEditValue(event.target.value);
                    }}
                    onKeyDown={handleEditKeyDown}
                    rows={Math.min(
                      8,
                      Math.max(
                        1,
                        editValue.split("\n").length
                      )
                    )}
                    className={`
                      block
                      w-full
                      min-w-0
                      resize-none
                      rounded-xl
                      bg-transparent
                      px-2.5
                      py-2
                      text-[15px]
                      leading-6
                      outline-none

                      ${
                        isAI
                          ? "text-white"
                          : "text-[#2C1D54]"
                      }
                    `}
                    style={{
                      border: `1px solid ${
                        isAI
                          ? "rgba(255,255,255,.25)"
                          : "rgba(44,29,84,.25)"
                      }`,
                    }}
                  />

                  {/* Edit actions */}
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className={`
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full

                        ${
                          isAI
                            ? "bg-white/10 text-white"
                            : "bg-black/10 text-[#2C1D54]"
                        }
                      `}
                      aria-label="Cancel editing"
                    >
                      <FiX size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={saveEdit}
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        bg-violet-500
                        text-white
                        transition-transform
                        hover:scale-105
                      "
                      aria-label="Save edit"
                    >
                      <FiCheck size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                /* =================================================
                   MESSAGE TEXT
                ================================================= */
                text && (
                  <p
                    className="
                      relative
                      z-20
                      m-0
                      block
                      min-w-0
                      max-w-full

                      whitespace-pre-wrap
                      break-words
                      [overflow-wrap:anywhere]

                      text-[15px]
                      font-normal
                      leading-[1.55]
                      tracking-[0.005em]
                    "
                    style={{
                      /*
                       * Extra safety against browser text clipping.
                       */
                      WebkitTextSizeAdjust: "100%",
                    }}
                  >
                    {text}
                  </p>
                )
              )}

              {/* ===================================================
                  TIMESTAMP
              =================================================== */}
              {time && !isEditing && (
                <div
                  className={`
                    relative
                    z-20
                    mt-1.5
                    flex
                    w-full
                    items-center
                    text-[10px]
                    leading-none

                    ${
                      isAI
                        ? "justify-start text-white/55"
                        : "justify-end text-[#2C1D54]/60"
                    }
                  `}
                >
                  {time}
                </div>
              )}
            </div>
          </div>

          {/* =====================================================
              EDIT / DELETE ACTIONS
          ===================================================== */}
          {!selectionMode && !isEditing && (
            <AnimatePresence>
              {actionsVisible && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -4,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -4,
                    scale: 0.9,
                  }}
                  transition={{
                    duration: 0.15,
                  }}
                  className={`
                    mt-1.5
                    flex
                    items-center
                    gap-2

                    ${
                      isAI
                        ? "justify-start"
                        : "justify-end"
                    }
                  `}
                >
                  {/* Edit */}
                  {isUser && (
                    <motion.button
                      type="button"
                      whileHover={{
                        scale: 1.1,
                      }}
                      whileTap={{
                        scale: 0.92,
                      }}
                      onClick={startEditing}
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/15
                        bg-white/10
                        text-white/70
                        backdrop-blur-md
                        transition-all
                        hover:border-violet-400/40
                        hover:text-violet-300
                      "
                      aria-label="Edit message"
                    >
                      <FiEdit3 size={14} />
                    </motion.button>
                  )}

                  {/* Delete */}
                  <motion.button
                    type="button"
                    whileHover={{
                      scale: 1.1,
                    }}
                    whileTap={{
                      scale: 0.92,
                    }}
                    onClick={() => {
                      onDelete?.(id);
                    }}
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/15
                      bg-white/10
                      text-white/70
                      backdrop-blur-md
                      transition-all
                      hover:border-red-400/40
                      hover:text-red-300
                    "
                    aria-label="Delete message"
                  >
                    <FiTrash2 size={14} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      {/* ===========================================================
          IMAGE PREVIEW
      =========================================================== */}
      <PreviewModal
        attachment={previewing}
        onClose={() => {
          setPreviewing(null);
        }}
      />
    </>
  );
}