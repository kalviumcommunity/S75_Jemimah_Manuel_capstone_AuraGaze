import { motion } from "framer-motion";

import ChatBubble from "./ChatBubble";
import DateDivider from "./DateDivider";
import TypingIndicator from "./TypingIndicator";

/*
 * Messages from the same sender are visually grouped
 * when they occur within 5 minutes.
 */
const GROUP_WINDOW_MS = 5 * 60 * 1000;

/*
 * Clean special message separator tokens.
 */
const cleanMessageText = (rawText) => {
  if (typeof rawText !== "string") {
    return rawText ?? "";
  }

  return rawText
    .replace(/<msg>/gi, "")
    .trim();
};

/*
 * Safely check whether two timestamps
 * belong to the same calendar day.
 */
const isSameCalendarDay = (a, b) => {
  if (!a || !b) {
    return false;
  }

  const firstDate = new Date(a);
  const secondDate = new Date(b);

  if (
    Number.isNaN(firstDate.getTime()) ||
    Number.isNaN(secondDate.getTime())
  ) {
    return false;
  }

  return (
    firstDate.toDateString() ===
    secondDate.toDateString()
  );
};

/*
 * Determine whether two messages belong
 * to the same visual message group.
 */
const isSameGroup = (a, b) => {
  if (!a || !b) {
    return false;
  }

  if (a.sender !== b.sender) {
    return false;
  }

  if (
    !isSameCalendarDay(
      a.timestamp,
      b.timestamp
    )
  ) {
    return false;
  }

  const firstTime = new Date(
    a.timestamp
  ).getTime();

  const secondTime = new Date(
    b.timestamp
  ).getTime();

  if (
    Number.isNaN(firstTime) ||
    Number.isNaN(secondTime)
  ) {
    return false;
  }

  return (
    Math.abs(secondTime - firstTime) <
    GROUP_WINDOW_MS
  );
};

/*
 * Date divider label.
 */
const getDateLabel = (isoString) => {
  if (!isoString) {
    return "";
  }

  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const today = new Date();

  const yesterday = new Date(today);
  yesterday.setDate(
    today.getDate() - 1
  );

  if (
    isSameCalendarDay(
      date,
      today
    )
  ) {
    return "Today";
  }

  if (
    isSameCalendarDay(
      date,
      yesterday
    )
  ) {
    return "Yesterday";
  }

  return date.toLocaleDateString(
    undefined,
    {
      month: "long",
      day: "numeric",
      year:
        date.getFullYear() !==
        today.getFullYear()
          ? "numeric"
          : undefined,
    }
  );
};

/*
 * Split one stored message into
 * multiple visual message bubbles.
 *
 * Supported:
 * 1. Blank lines
 * 2. <msg>
 */
const splitIntoBlocks = (text) => {
  if (typeof text !== "string") {
    return [];
  }

  return text
    .split(/\n\s*\n+|<msg>/gi)
    .map((block) => block.trim())
    .filter(Boolean);
};

/*
 * Expand stored messages into visual bubbles.
 *
 * Original message objects are NOT modified.
 */
const expandMessages = (messages) => {
  const expanded = [];

  messages.forEach(
    (message, messageIndex) => {
      if (!message) {
        return;
      }

      const originalText =
        typeof message.text === "string"
          ? message.text
          : "";

      const blocks =
        splitIntoBlocks(
          originalText
        );

      /*
       * Normal single message.
       */
      if (blocks.length <= 1) {
        expanded.push({
          ...message,

          _key: `${
            message.id ??
            "message"
          }_${messageIndex}`,

          text:
            blocks[0] ??
            originalText,

          fullText:
            originalText,

          attachments:
            Array.isArray(
              message.attachments
            )
              ? message.attachments
              : [],
        });

        return;
      }

      /*
       * Multiple visual bubbles
       * from one stored message.
       */
      blocks.forEach(
        (block, blockIndex) => {
          let adjustedTimestamp =
            message.timestamp;

          if (message.timestamp) {
            const baseTime =
              new Date(
                message.timestamp
              ).getTime();

            if (
              !Number.isNaN(
                baseTime
              )
            ) {
              /*
               * Add 1ms per split block.
               * This keeps ordering stable
               * without visibly changing
               * the displayed timestamp.
               */
              adjustedTimestamp =
                new Date(
                  baseTime +
                    blockIndex
                ).toISOString();
            }
          }

          expanded.push({
            ...message,

            _key: `${
              message.id ??
              "message"
            }__${blockIndex}`,

            text: block,

            fullText:
              originalText,

            /*
             * Attachments belong only
             * to the first visual bubble.
             */
            attachments:
              blockIndex === 0
                ? Array.isArray(
                    message.attachments
                  )
                  ? message.attachments
                  : []
                : [],

            timestamp:
              adjustedTimestamp,
          });
        }
      );
    }
  );

  return expanded;
};

/*
 * Message spacing.
 */
const BASE_MESSAGE_GAP = "gap-1.5";
const GROUP_BOUNDARY_EXTRA_GAP = "mt-1.5";

export default function MessageList({
  messages = [],
  friend,
  typing = false,
  messagesEndRef,
  selectionMode = false,
  selectedIds = new Set(),
  onToggleSelect,
  onEditMessage,
  onDeleteMessage,
}) {
  /*
   * Always work with an array.
   */
  const safeMessages = Array.isArray(
    messages
  )
    ? messages
    : [];

  const renderList =
    expandMessages(
      safeMessages
    );

  /*
   * Normalize selectedIds.
   */
  const isMessageSelected = (id) => {
    if (
      selectedIds instanceof Set
    ) {
      return selectedIds.has(id);
    }

    if (
      Array.isArray(selectedIds)
    ) {
      return selectedIds.includes(
        id
      );
    }

    return false;
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`
        flex
        w-full
        min-w-0
        flex-col
        ${BASE_MESSAGE_GAP}
        pb-2
      `}
    >
      {renderList.map(
        (message, index) => {
          const previous =
            renderList[
              index - 1
            ];

          const next =
            renderList[
              index + 1
            ];

          /*
           * Show date divider for
           * first message or day change.
           */
          const showDateDivider =
            !previous ||
            !isSameCalendarDay(
              previous.timestamp,
              message.timestamp
            );

          /*
           * Group information.
           */
          const isFirstInGroup =
            showDateDivider ||
            !isSameGroup(
              previous,
              message
            );

          const isLastInGroup =
            !isSameGroup(
              message,
              next
            );

          return (
            <div
              key={
                message._key
              }
              className="
                w-full
                min-w-0
              "
            >
              {/* Date divider */}
              {showDateDivider && (
                <DateDivider
                  label={getDateLabel(
                    message.timestamp
                  )}
                />
              )}

              {/* Group spacing */}
              <div
                className={`
                  w-full
                  min-w-0
                  ${
                    isFirstInGroup
                      ? GROUP_BOUNDARY_EXTRA_GAP
                      : ""
                  }
                `}
              >
                <ChatBubble
                  id={
                    message.id
                  }
                  sender={
                    message.sender
                  }
                  text={cleanMessageText(
                    message.text
                  )}
                  editSourceText={cleanMessageText(
                    message.fullText
                  )}
                  image={
                    message.sender ===
                    "ai"
                      ? friend?.image
                      : null
                  }
                  attachments={
                    Array.isArray(
                      message.attachments
                    )
                      ? message.attachments
                      : []
                  }
                  timestamp={
                    message.timestamp
                  }
                  isFirstInGroup={
                    isFirstInGroup
                  }
                  isLastInGroup={
                    isLastInGroup
                  }
                  selectionMode={
                    selectionMode
                  }
                  isSelected={isMessageSelected(
                    message.id
                  )}
                  onToggleSelect={
                    onToggleSelect
                  }
                  onEdit={
                    onEditMessage
                  }
                  onDelete={
                    onDeleteMessage
                  }
                />
              </div>
            </div>
          );
        }
      )}

      {/* Typing indicator */}
      {typing && (
        <div
          className={`
            w-full
            min-w-0
            ${GROUP_BOUNDARY_EXTRA_GAP}
          `}
        >
          <TypingIndicator />
        </div>
      )}

      {/* Scroll anchor */}
      <div
        ref={messagesEndRef}
        className="
          h-2
          w-full
          shrink-0
        "
        aria-hidden="true"
      />
    </motion.div>
  );
}