import { useMemo } from "react";

// =============================================================
// CONFIGURATION
// =============================================================

const MIN_TOP = 35;

const GAP = 22;

const SIDE_PADDING = 20;

const MIN_WIDTH = 150;

const MAX_WIDTH = 300;

/*
 * Minimum usable world height.
 *
 * This is NOT a huge scrolling world.
 *
 * The visible viewport is used first.
 */
const MIN_WORLD_HEIGHT = 560;

// =============================================================
// HELPERS
// =============================================================

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

// =============================================================
// STABLE HASH
// =============================================================

function hashString(value) {
  const string =
    String(value);

  let hash =
    2166136261;

  for (
    let i = 0;
    i < string.length;
    i++
  ) {
    hash ^=
      string.charCodeAt(i);

    hash =
      Math.imul(
        hash,
        16777619
      );
  }

  return (
    hash >>> 0
  );
}

// =============================================================
// SEEDED RANDOM
// =============================================================

function seededRandom(
  seed
) {
  let value =
    seed >>> 0;

  value +=
    0x6D2B79F5;

  value =
    Math.imul(
      value ^
        (value >>> 15),
      value | 1
    );

  value ^=
    value +
    Math.imul(
      value ^
        (value >>> 7),
      value | 61
    );

  return (
    (
      value ^
      (value >>> 14)
    ) >>>
      0
  ) /
    4294967296;
}

// =============================================================
// RECTANGLE COLLISION
// =============================================================

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

// =============================================================
// MESSAGE HEIGHT
// =============================================================

function getMessageHeight(
  message,
  width
) {
  const text =
    String(
      message?.text || ""
    );

  const charsPerLine =
    Math.max(
      15,
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
    280,
    Math.max(
      58,
      34 +
        lines * 22 +
        18 +
        imageHeight
    )
  );
}

// =============================================================
// MESSAGE WIDTH
// =============================================================

function getMessageWidth(
  message,
  safeWidth
) {
  const desiredWidth =
    message?.sender ===
    "user"
      ? 300
      : 280;

  return Math.min(
    Math.max(
      desiredWidth,
      MIN_WIDTH
    ),

    Math.max(
      safeWidth - 30,
      MIN_WIDTH
    ),

    MAX_WIDTH
  );
}

// =============================================================
// FIND RANDOM FREE POSITION
// =============================================================

function findFreePosition({
  seed,

  safeWidth,

  width,

  height,

  occupied,

  visibleWorldHeight,
}) {
  /*
   * ---------------------------------------------------------
   * CURRENT VISIBLE SCREEN
   * ---------------------------------------------------------
   *
   * AI should initially live ONLY here.
   */

  const usableHeight =
    Math.max(
      MIN_WORLD_HEIGHT,
      visibleWorldHeight
    );

  const maxX =
    Math.max(
      SIDE_PADDING,
      safeWidth -
        width -
        SIDE_PADDING
    );

  const maxY =
    Math.max(
      MIN_TOP,
      usableHeight -
        height -
        SIDE_PADDING
    );

  /*
   * ---------------------------------------------------------
   * RANDOM STARTING POINT
   * ---------------------------------------------------------
   */

  const randomX =
    SIDE_PADDING +
    seededRandom(
      seed + 17
    ) *
      Math.max(
        1,
        maxX -
          SIDE_PADDING
      );

  const randomY =
    MIN_TOP +
    seededRandom(
      seed + 43
    ) *
      Math.max(
        1,
        maxY -
          MIN_TOP
      );

  const initialCandidate = {
    left: clamp(
      randomX,
      SIDE_PADDING,
      maxX
    ),

    top: clamp(
      randomY,
      MIN_TOP,
      maxY
    ),

    right: 0,

    bottom: 0,
  };

  initialCandidate.right =
    initialCandidate.left +
    width;

  initialCandidate.bottom =
    initialCandidate.top +
    height;

  /*
   * If the random position is already free,
   * use it immediately.
   */
  const initialCollision =
    occupied.some(
      (rect) =>
        rectanglesOverlap(
          initialCandidate,
          rect
        )
    );

  if (!initialCollision) {
    return {
      x:
        initialCandidate.left,

      y:
        initialCandidate.top,

      width,

      height,
    };
  }

  // =========================================================
  // SEARCH AROUND RANDOM LOCATION
  // =========================================================

  const startAngle =
    seededRandom(
      seed + 101
    ) *
    Math.PI *
    2;

  for (
    let attempt = 1;
    attempt <= 240;
    attempt++
  ) {
    /*
     * Gradually move farther away
     * from the original random point.
     */
    const radius =
      28 +
      Math.floor(
        attempt / 8
      ) *
        30;

    const angle =
      startAngle +
      attempt *
        0.77;

    const candidateX =
      clamp(
        randomX +
          Math.cos(angle) *
            radius,

        SIDE_PADDING,

        maxX
      );

    const candidateY =
      clamp(
        randomY +
          Math.sin(angle) *
            radius,

        MIN_TOP,

        maxY
      );

    const candidate = {
      left:
        candidateX,

      top:
        candidateY,

      right:
        candidateX +
        width,

      bottom:
        candidateY +
        height,
    };

    const collision =
      occupied.some(
        (rect) =>
          rectanglesOverlap(
            candidate,
            rect
          )
      );

    if (!collision) {
      return {
        x:
          candidate.left,

        y:
          candidate.top,

        width,

        height,
      };
    }
  }

  // =========================================================
  // GRID FALLBACK
  // =========================================================

  /*
   * If the screen is becoming crowded,
   * scan the visible area for a free space.
   */
  const rowStep = 34;

  const columnCount =
    Math.max(
      1,
      Math.floor(
        safeWidth /
          90
      )
    );

  for (
    let row = 0;
    row <
    Math.ceil(
      usableHeight /
        rowStep
    );
    row++
  ) {
    const y =
      MIN_TOP +
      row * rowStep;

    if (
      y + height >
      usableHeight
    ) {
      break;
    }

    for (
      let column = 0;
      column <
      columnCount;
      column++
    ) {
      const columnSeed =
        seed +
        row * 7919 +
        column * 104729;

      const x =
        SIDE_PADDING +
        seededRandom(
          columnSeed
        ) *
          Math.max(
            1,
            maxX -
              SIDE_PADDING
          );

      const candidate = {
        left: clamp(
          x,
          SIDE_PADDING,
          maxX
        ),

        top: y,

        right:
          clamp(
            x,
            SIDE_PADDING,
            maxX
          ) + width,

        bottom:
          y + height,
      };

      const collision =
        occupied.some(
          (rect) =>
            rectanglesOverlap(
              candidate,
              rect
            )
        );

      if (!collision) {
        return {
          x:
            candidate.left,

          y:
            candidate.top,

          width,

          height,
        };
      }
    }
  }

  // =========================================================
  // SCREEN IS FULL
  // =========================================================

  /*
   * At this point we intentionally allow the world
   * to expand downward.
   *
   * This is what creates the "scroll down when filled"
   * behavior.
   */

  const expandedHeight =
    usableHeight +
    260 +
    occupied.length * 35;

  const expandedMaxY =
    Math.max(
      MIN_TOP,
      expandedHeight -
        height -
        SIDE_PADDING
    );

  for (
    let attempt = 1;
    attempt <= 180;
    attempt++
  ) {
    const x =
      SIDE_PADDING +
      seededRandom(
        seed +
          5000 +
          attempt
      ) *
        Math.max(
          1,
          maxX -
            SIDE_PADDING
        );

    const y =
      usableHeight -
      60 +
      seededRandom(
        seed +
          8000 +
          attempt
      ) *
        Math.max(
          1,
          expandedMaxY -
            usableHeight +
            60
        );

    const candidate = {
      left: clamp(
        x,
        SIDE_PADDING,
        maxX
      ),

      top: clamp(
        y,
        usableHeight -
          60,
        expandedMaxY
      ),

      right:
        clamp(
          x,
          SIDE_PADDING,
          maxX
        ) + width,

      bottom:
        clamp(
          y,
          usableHeight -
            60,
          expandedMaxY
        ) + height,
    };

    const collision =
      occupied.some(
        (rect) =>
          rectanglesOverlap(
            candidate,
            rect
          )
      );

    if (!collision) {
      return {
        x:
          candidate.left,

        y:
          candidate.top,

        width,

        height,
      };
    }
  }

  /*
   * Last-resort placement.
   */
  return {
    x:
      SIDE_PADDING,

    y:
      expandedHeight -
      height -
      SIDE_PADDING,

    width,

    height,
  };
}

// =============================================================
// HOOK
// =============================================================

export default function useScrollCollision({
  messages = [],

  containerWidth = 720,

  containerHeight = 600,

  bottomSafeZone = 225,
}) {
  return useMemo(() => {
    const safeWidth =
      Math.max(
        containerWidth,
        280
      );

    /*
     * ---------------------------------------------------------
     * VISIBLE WORLD
     * ---------------------------------------------------------
     *
     * This is the important part.
     *
     * AI messages first use the screen the user is
     * currently looking at.
     */
    const visibleWorldHeight =
      Math.max(
        MIN_WORLD_HEIGHT,

        containerHeight -
          bottomSafeZone -
          30
      );

    const positions = [];

    const occupied = [];

    let maxBottom =
      visibleWorldHeight;

    // =========================================================
    // EVERY MESSAGE
    // =========================================================

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

        const id =
          message?.id ??
          message?._id ??
          `message-${index}`;

        const width =
          getMessageWidth(
            message,
            safeWidth
          );

        const height =
          getMessageHeight(
            message,
            width
          );

        // =====================================================
        // USER TARGET MESSAGE
        // =====================================================

        if (hasTarget) {
          /*
           * User target is ALWAYS exact.
           *
           * x/y = center.
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
            id,

            x:
              centerX,

            y:
              centerY,

            width,

            height,

            rotate: 0,

            anchored: true,
          });

          /*
           * Reserve the area.
           */
          const rect = {
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
          };

          occupied.push(
            rect
          );

          maxBottom =
            Math.max(
              maxBottom,
              rect.bottom
            );

          return;
        }

        // =====================================================
        // RANDOM AI / NORMAL MESSAGE
        // =====================================================

        const seed =
          hashString(
            `${id}|${message?.sender}|${message?.timestamp}|${message?.text}`
          );

        const result =
          findFreePosition({
            seed,

            safeWidth,

            width,

            height,

            occupied,

            visibleWorldHeight,
          });

        const rotationSeed =
          seededRandom(
            seed + 777
          );

        const rotate =
          -1.5 +
          rotationSeed *
            3;

        positions.push({
          id,

          x:
            result.x,

          y:
            result.y,

          width:
            result.width,

          height:
            result.height,

          rotate,

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

        maxBottom =
          Math.max(
            maxBottom,

            result.y +
              result.height
          );
      }
    );

    // =========================================================
    // WORLD HEIGHT
    // =========================================================

    /*
     * Do NOT create a giant world immediately.
     *
     * The world is only as tall as it needs to be.
     */
    const totalHeight =
      Math.max(
        visibleWorldHeight,

        maxBottom +
          100
      );

    return {
      positions,

      totalHeight,
    };
  }, [
    messages,
    containerWidth,
    containerHeight,
    bottomSafeZone,
  ]);
}