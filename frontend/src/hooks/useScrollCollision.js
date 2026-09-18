import { useMemo } from "react";

const MIN_TOP = 40;
const GAP = 24;
const DEFAULT_WIDTH = 220;

function clamp(
  value,
  min,
  max
) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}

function rectanglesOverlap(
  a,
  b
) {
  return !(
    a.right + GAP <
      b.left ||
    a.left >
      b.right + GAP ||
    a.bottom + GAP <
      b.top ||
    a.top >
      b.bottom + GAP
  );
}

function getMessageHeight(
  message,
  width
) {
  const text =
    String(
      message?.text || ""
    );

  /*
   * Approximate line width.
   */

  const charsPerLine =
    Math.max(
      16,
      Math.floor(
        width / 8
      )
    );

  const lines =
    Math.max(
      1,
      Math.ceil(
        text.length /
          charsPerLine
      )
    );

  const imageHeight =
    message?.attachments?.some(
      (attachment) =>
        attachment?.mimetype?.startsWith(
          "image/"
        )
    )
      ? 170
      : 0;

  return Math.min(
    260,
    Math.max(
      58,
      34 +
        lines * 22 +
        18 +
        imageHeight
    )
  );
}

export default function useScrollCollision({
  messages = [],
  containerWidth = 720,
}) {
  return useMemo(() => {
    const safeWidth =
      Math.max(
        containerWidth,
        280
      );

    const positions = [];

    const occupied = [];

    // =======================================================
    // FREE POSITION FOR NORMAL / AI MESSAGES
    // =======================================================

    const findFreePosition = ({
      preferredX,
      preferredY,
      width,
      height,
    }) => {
      const maxX =
        Math.max(
          safeWidth -
            width -
            10,
          10
        );

      const x =
        clamp(
          preferredX,
          10,
          maxX
        );

      let y =
        Math.max(
          preferredY,
          MIN_TOP
        );

      let candidate = {
        left: x,
        top: y,
        right:
          x + width,
        bottom:
          y + height,
      };

      let attempts = 0;

      while (
        occupied.some(
          (rect) =>
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
          right:
            x + width,
          bottom:
            y + height,
        };

        attempts++;
      }

      return {
        x:
          candidate.left,

        y:
          candidate.top,

        width,
        height,
      };
    };

    // =======================================================
    // EVERY MESSAGE
    // =======================================================

    messages.forEach(
      (
        message,
        index
      ) => {
        const isUser =
          message?.sender ===
          "user";

        const hasTarget =
          isUser &&
          message?.target &&
          Number.isFinite(
            Number(
              message.target.x
            )
          ) &&
          Number.isFinite(
            Number(
              message.target.y
            )
          );

        /*
         * User bubbles are slightly narrower than
         * before, which makes them look more like
         * WhatsApp / Instagram.
         */

        const width =
          Math.min(
            isUser
              ? 300
              : 280,

            Math.max(
              safeWidth - 24,
              150
            )
          );

        const height =
          getMessageHeight(
            message,
            width
          );

        // =====================================================
        // TARGETED USER MESSAGE
        // =====================================================

        if (hasTarget) {
          /*
           * IMPORTANT:
           *
           * x/y represent the CENTER.
           *
           * ScrollMessage will use:
           *
           * transform:
           * translate(-50%, -50%)
           *
           * Therefore the bubble center is exactly
           * target.x / target.y.
           */

          const centerX =
            Number(
              message.target.x
            );

          const centerY =
            Number(
              message.target.y
            );

          positions.push({
            id:
              message.id ??
              message._id ??
              `message-${index}`,

            x: centerX,

            y: centerY,

            width,

            height,

            rotate: 0,

            anchored: true,
          });

          /*
           * Occupied rectangle is only used so that
           * future AI messages know this area exists.
           */

          occupied.push({
            left:
              centerX -
              width / 2,

            top:
              centerY -
              height / 2,

            right:
              centerX +
              width / 2,

            bottom:
              centerY +
              height / 2,
          });

          return;
        }

        // =====================================================
        // NORMAL / AI MESSAGE
        // =====================================================

        const isAI =
          message?.sender ===
          "ai";

        const preferredX =
          isAI
            ? 20
            : safeWidth -
              width -
              20;

        const preferredY =
          positions.reduce(
            (
              max,
              position
            ) =>
              Math.max(
                max,
                position.y +
                  (position.anchored
                    ? position.height /
                      2
                    : position.height) +
                  45
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

          x:
            result.x,

          y:
            result.y,

          width:
            result.width,

          height:
            result.height,

          rotate:
            isAI
              ? index % 3 === 0
                ? -0.6
                : 0.5
              : index % 2 === 0
              ? -1
              : 1,

          anchored: false,
        });

        occupied.push({
          left:
            result.x,

          top:
            result.y,

          right:
            result.x +
            result.width,

          bottom:
            result.y +
            result.height,
        });
      }
    );

    // =======================================================
    // CANVAS HEIGHT
    // =======================================================

    const totalHeight =
      Math.max(
        700,

        positions.reduce(
          (
            max,
            position
          ) => {
            if (
              position.anchored
            ) {
              return Math.max(
                max,
                position.y +
                  position.height /
                    2 +
                  140
              );
            }

            return Math.max(
              max,
              position.y +
                position.height +
                140
            );
          },
          700
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