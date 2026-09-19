import {
  useEffect,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

import ScrollMessage from "./ScrollMessage";
import TargetCursor from "./TargetCursor";
import FlyingScroll from "./FlyingScroll";

import useScrollCollision from "../../../hooks/useScrollCollision";
import colors from "../../../theme/colors";

/*
 * The bottom of the screen is occupied by the
 * slingshot/input UI.
 *
 * Messages and targets should stay above that area.
 */
const BOTTOM_SAFE_ZONE = 225;

export default function MessageCanvas({
  messages = [],
  friend,
  typing = false,

  scrollContainerRef,
  messagesEndRef,

  // Magic Chat
  magicMode = false,
  target = null,
  targetLocked = false,
  onTargetChange,
  onTargetLock,

  // Flying scroll
  flyingScroll = null,
  onFlyingComplete,
}) {
  const localCanvasRef =
    useRef(null);

  const innerCanvasRef =
    useRef(null);

  const [containerWidth, setContainerWidth] =
    useState(760);

  const [containerHeight, setContainerHeight] =
    useState(600);

  // =========================================================
  // CONNECT PARENT REF + MEASURE VIEWPORT
  // =========================================================

  useEffect(() => {
    const el =
      localCanvasRef.current;

    if (!el) {
      return;
    }

    if (scrollContainerRef) {
      scrollContainerRef.current =
        el;
    }

    const measure = () => {
      setContainerWidth(
        el.clientWidth || 760
      );

      setContainerHeight(
        el.clientHeight || 600
      );
    };

    measure();

    const observer =
      new ResizeObserver(
        measure
      );

    observer.observe(el);

    return () => {
      observer.disconnect();

      if (
        scrollContainerRef?.current ===
        el
      ) {
        scrollContainerRef.current =
          null;
      }
    };
  }, [
    scrollContainerRef,
  ]);

  // =========================================================
  // TARGET TRACKING
  // =========================================================

  useEffect(() => {
    if (!magicMode) {
      return;
    }

    const canvas =
      localCanvasRef.current;

    const innerCanvas =
      innerCanvasRef.current;

    if (
      !canvas ||
      !innerCanvas
    ) {
      return;
    }

    const handlePointerMove =
      (event) => {
        /*
         * Once the target is locked, don't move it.
         */
        if (targetLocked) {
          return;
        }

        /*
         * IMPORTANT:
         *
         * Use the FULL inner canvas width.
         *
         * Previously the inner canvas had maxWidth: 720,
         * which made the target feel stuck around the center.
         */
        const rect =
          innerCanvas.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left;

        const y =
          event.clientY -
          rect.top;

        /*
         * Target should work throughout the visible
         * chat area, but not underneath the slingshot.
         */
        const horizontalPadding =
          35;

        const verticalPadding =
          35;

        const maxX =
          Math.max(
            horizontalPadding,
            innerCanvas.clientWidth -
              horizontalPadding
          );

        /*
         * Only use the currently visible part
         * of the canvas for the target.
         */
        const visibleBottom =
          canvas.scrollTop +
          canvas.clientHeight -
          BOTTOM_SAFE_ZONE;

        const maxY =
          Math.max(
            verticalPadding,
            Math.min(
              visibleBottom -
                rect.top +
                canvas.scrollTop,
              innerCanvas.scrollHeight -
                verticalPadding
            )
          );

        /*
         * Because rect.top changes with scrolling,
         * convert pointer position into world coordinates.
         */
        const worldX =
          event.clientX -
          rect.left;

        const worldY =
          event.clientY -
          rect.top;

        const nextPosition = {
          x: Math.max(
            horizontalPadding,
            Math.min(
              worldX,
              maxX
            )
          ),

          y: Math.max(
            verticalPadding,
            Math.min(
              worldY,
              maxY
            )
          ),
        };

        onTargetChange?.(
          nextPosition
        );
      };

    canvas.addEventListener(
      "pointermove",
      handlePointerMove
    );

    return () => {
      canvas.removeEventListener(
        "pointermove",
        handlePointerMove
      );
    };
  }, [
    magicMode,
    targetLocked,
    onTargetChange,
  ]);

  // =========================================================
  // MESSAGE POSITIONS
  // =========================================================

  const {
    positions,
    totalHeight,
  } = useScrollCollision({
    messages,

    containerWidth:
      Math.max(
        containerWidth,
        280
      ),

    /*
     * Tell the collision system how much
     * space is currently visible.
     */
    containerHeight,

    bottomSafeZone:
      BOTTOM_SAFE_ZONE,
  });

  const positionMap =
    new Map(
      positions.map(
        (position) => [
          position.id,
          position,
        ]
      )
    );

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      ref={localCanvasRef}
      className="
        relative
        w-full
        h-full
        overflow-y-auto
        overflow-x-hidden
        scroll-smooth
        px-4
        py-6
        scrollbar-thin
        scrollbar-track-transparent
        scrollbar-thumb-white/10
      "
    >
      {/*
       * IMPORTANT:
       *
       * No max-width: 720px here.
       *
       * The Magic Chat world now uses the entire
       * available screen width.
       */}
      <div
        ref={innerCanvasRef}
        data-magic-canvas
        className="
          relative
          w-full
          min-w-0
          mx-auto
        "
        style={{
          minHeight:
            Math.max(
              totalHeight,
              containerHeight
            ),
        }}
      >
        {/* =================================================
            TARGET CURSOR
        ================================================= */}

        {magicMode &&
          target && (
            <TargetCursor
              x={target.x}
              y={target.y}
              locked={
                targetLocked
              }
              visible={
                !flyingScroll?.visible
              }
              onClick={
                onTargetLock
              }
            />
          )}

        {/* =================================================
            FLYING SCROLL
        ================================================= */}

        {flyingScroll?.visible && (
          <FlyingScroll
            start={
              flyingScroll.start
            }
            target={
              flyingScroll.target
            }
            visible={
              flyingScroll.visible
            }
            duration={
              flyingScroll.duration ??
              1.15
            }
            rotation={
              flyingScroll.rotation ??
              720
            }
            scale={
              flyingScroll.scale ??
              1
            }
            onComplete={
              onFlyingComplete
            }
          />
        )}

        {/* =================================================
            MESSAGES
        ================================================= */}

        {messages.map(
          (
            message,
            index
          ) => {
            const id =
              message.id ??
              message._id ??
              `message-${index}`;

            const pos =
              positionMap.get(
                id
              );

            if (!pos) {
              return null;
            }

            /*
             * The newest message gets the special
             * LATEST appearance.
             */
            const isRecent =
              index ===
              messages.length - 1;

            return (
              <ScrollMessage
                key={id}
                id={id}
                sender={
                  message.sender
                }
                text={
                  message.text
                }
                image={
                  friend?.image
                }
                attachments={
                  message.attachments ||
                  []
                }
                timestamp={
                  message.timestamp
                }
                x={pos.x}
                y={pos.y}
                rotate={
                  pos.rotate
                }
                width={
                  pos.width
                }
                anchored={
                  pos.anchored
                }
                isRecent={
                  isRecent
                }
              />
            );
          }
        )}

        {/* =================================================
            TYPING INDICATOR
        ================================================= */}

        {typing && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              absolute
              left-1/2
              -translate-x-1/2
              flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              z-20
            "
            style={{
              /*
               * Keep typing indicator inside
               * the currently visible area.
               */
              top:
                Math.max(
                  80,
                  Math.min(
                    totalHeight - 55,
                    containerHeight -
                      BOTTOM_SAFE_ZONE -
                      20
                  )
                ),

              background:
                colors.card.glass,

              border:
                `1px solid ${colors.border.light}`,

              backdropFilter:
                "blur(12px)",
            }}
          >
            {[0, 1, 2].map(
              (dot) => (
                <motion.span
                  key={dot}
                  animate={{
                    y: [
                      0,
                      -5,
                      0,
                    ],

                    opacity: [
                      0.4,
                      1,
                      0.4,
                    ],
                  }}
                  transition={{
                    duration: 0.7,
                    repeat:
                      Infinity,
                    delay:
                      dot * 0.16,
                  }}
                  className="
                    w-2
                    h-2
                    rounded-full
                  "
                  style={{
                    background:
                      colors
                        .brand
                        .lavender,
                  }}
                />
              )
            )}
          </motion.div>
        )}

        {/* =================================================
            END MARKER
        ================================================= */}

        <div
          ref={messagesEndRef}
          style={{
            position:
              "absolute",

            top:
              totalHeight,

            left: 0,

            height: 1,

            width: 1,
          }}
        />
      </div>
    </div>
  );
}