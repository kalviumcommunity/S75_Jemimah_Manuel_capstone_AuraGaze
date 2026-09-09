import { useMemo } from "react";

/*
 * Magic Chat message positioning.
 *
 * User messages can contain:
 *
 * target: {
 *   x: number,
 *   y: number
 * }
 *
 * When a target exists, the message tries to land there.
 *
 * AI messages without a target are automatically positioned
 * around the conversation.
 */

const MIN_TOP = 40;
const GAP = 24;
const DEFAULT_WIDTH = 220;

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function rectanglesOverlap(a, b) {
  return !(
    a.right + GAP < b.left ||
    a.left > b.right + GAP ||
    a.bottom + GAP < b.top ||
    a.top > b.bottom + GAP
  );
}

function getMessageHeight(message) {
  const text = message?.text || "";

  /*
   * Rough visual height estimation.
   *
   * This doesn't need to be exact because ScrollMessage
   * itself is animated and the messages have generous spacing.
   */

  const charsPerLine = 28;

  const lines = Math.max(
    1,
    Math.ceil(text.length / charsPerLine)
  );

  const imageHeight =
    message?.attachments?.some((a) =>
      a?.mimetype?.startsWith("image/")
    )
      ? 170
      : 0;

  return Math.min(
    220,
    58 + lines * 22 + imageHeight
  );
}

export default function useScrollCollision({
  messages = [],
  containerWidth = 720,
}) {
  return useMemo(() => {
    const safeWidth = Math.max(
      containerWidth,
      280
    );

    const positions = [];

    const occupied = [];

    /*
     * -------------------------------------------------------
     * Find a free position for automatic messages.
     * -------------------------------------------------------
     */
    const findFreePosition = ({
      preferredX,
      preferredY,
      width,
      height,
    }) => {
      const maxX = Math.max(
        safeWidth - width,
        10
      );

      let x = clamp(
        preferredX,
        10,
        maxX
      );

      let y = Math.max(
        preferredY,
        MIN_TOP
      );

      /*
       * First try the preferred position.
       */
      let candidate = {
        left: x,
        top: y,
        right: x + width,
        bottom: y + height,
      };

      let attempts = 0;

      /*
       * If it overlaps another message,
       * move downward until a free area is found.
       */
      while (
        occupied.some((rect) =>
          rectanglesOverlap(
            candidate,
            rect
          )
        ) &&
        attempts < 100
      ) {
        y += 35;

        candidate = {
          left: x,
          top: y,
          right: x + width,
          bottom: y + height,
        };

        attempts++;
      }

      /*
       * If the target is occupied, try horizontally
       * around it before going endlessly downward.
       */
      if (
        occupied.some((rect) =>
          rectanglesOverlap(
            candidate,
            rect
          )
        )
      ) {
        const offsets = [
          -width - 30,
          width + 30,
          -width * 0.5,
          width * 0.5,
          0,
        ];

        for (const offset of offsets) {
          const testX = clamp(
            x + offset,
            10,
            maxX
          );

          const test = {
            left: testX,
            top: y,
            right: testX + width,
            bottom: y + height,
          };

          if (
            !occupied.some((rect) =>
              rectanglesOverlap(
                test,
                rect
              )
            )
          ) {
            candidate = test;
            break;
          }
        }
      }

      return {
        x: candidate.left,
        y: candidate.top,
        width,
        height,
      };
    };

    /*
     * -------------------------------------------------------
     * POSITION EVERY MESSAGE
     * -------------------------------------------------------
     */
    messages.forEach(
      (message, index) => {
        const width =
          message?.width ||
          DEFAULT_WIDTH;

        const height =
          getMessageHeight(message);

        /*
         * ---------------------------------------------------
         * TARGETED MESSAGE
         *
         * This is the important part.
         *
         * If the user launched a scroll toward:
         *
         * { x: 420, y: 300 }
         *
         * we preserve that location.
         * ---------------------------------------------------
         */
        if (message?.target) {
          const targetX =
            Number(message.target.x);

          const targetY =
            Number(message.target.y);

          if (
            Number.isFinite(targetX) &&
            Number.isFinite(targetY)
          ) {
            /*
             * IMPORTANT:
             *
             * We DON'T move the message away from the
             * target just because another message exists.
             *
             * The selected target is the user's intended
             * landing position.
             *
             * Collision is only used as a fallback if the
             * target is completely invalid/outside canvas.
             */

            const x = clamp(
              targetX - width / 2,
              10,
              Math.max(
                safeWidth - width,
                10
              )
            );

            const y = Math.max(
              targetY - height / 2,
              MIN_TOP
            );

            const position = {
              id:
                message.id ??
                message._id ??
                `message-${index}`,

              x,
              y,

              width,
              height,

              /*
               * Small rotation makes the paper feel natural.
               */
              rotate:
                message.rotate ??
                (index % 2 === 0
                  ? -1.2
                  : 1.2),
            };

            positions.push(position);

            occupied.push({
              left: x,
              top: y,
              right: x + width,
              bottom: y + height,
            });

            return;
          }
        }

        /*
         * ---------------------------------------------------
         * NORMAL / AI MESSAGE
         * ---------------------------------------------------
         */

        const isAI =
          message?.sender === "ai";

        /*
         * Alternate sides so AI and user messages don't
         * become a boring vertical list.
         */
        const preferredX = isAI
          ? 35
          : safeWidth -
            width -
            35;

        /*
         * Place newer messages progressively lower.
         */
        const preferredY =
          index === 0
            ? MIN_TOP
            : positions.reduce(
                (max, position) =>
                  Math.max(
                    max,
                    position.y +
                      position.height +
                      35
                  ),
                MIN_TOP
              );

        const result =
          findFreePosition({
            preferredX,
            preferredY,
            width,
            height,
          });

        positions.push({
          id:
            message.id ??
            message._id ??
            `message-${index}`,

          x: result.x,
          y: result.y,

          width,
          height,

          rotate:
            message.rotate ??
            (index % 2 === 0
              ? -1.2
              : 1.2),
        });

        occupied.push({
          left: result.x,
          top: result.y,
          right:
            result.x + width,
          bottom:
            result.y + height,
        });
      }
    );

    /*
     * -------------------------------------------------------
     * TOTAL CANVAS HEIGHT
     * -------------------------------------------------------
     */

    const totalHeight = Math.max(
      560,
      positions.reduce(
        (max, position) =>
          Math.max(
            max,
            position.y +
              position.height +
              100
          ),
        560
      )
    );

    return {
      positions,
      totalHeight,
    };
  }, [
    messages,
    containerWidth,
  ]);
}