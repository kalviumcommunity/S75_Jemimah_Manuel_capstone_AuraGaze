import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import ScrollMessage from "./ScrollMessage";
import TargetCursor from "./TargetCursor";
import FlyingScroll from "./FlyingScroll";

import useScrollCollision from "../../../hooks/useScrollCollision";
import colors from "../../../theme/colors";

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
  const localCanvasRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(760);

  /*
   * ---------------------------------------------------------
   * Keep the parent's ref connected to our scroll container.
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const el = localCanvasRef.current;

    if (!el) return;

    if (scrollContainerRef) {
      scrollContainerRef.current = el;
    }

    const measure = () => {
      setContainerWidth(el.clientWidth || 760);
    };

    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(el);

    return () => {
      observer.disconnect();

      if (scrollContainerRef?.current === el) {
        scrollContainerRef.current = null;
      }
    };
  }, [scrollContainerRef]);

  /*
   * ---------------------------------------------------------
   * TARGET TRACKING
   *
   * Target coordinates are stored relative to the inner
   * message canvas, not the browser viewport.
   *
   * This is important because the chat can scroll.
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!magicMode) return;

    const canvas = localCanvasRef.current;

    if (!canvas) return;

    const handlePointerMove = (event) => {
      /*
       * Once target is locked, stop moving it.
       */
      if (targetLocked) return;

      const rect = canvas.getBoundingClientRect();

      const x =
        event.clientX -
        rect.left +
        canvas.scrollLeft;

      const y =
        event.clientY -
        rect.top +
        canvas.scrollTop;

      /*
       * Keep target inside the usable chat area.
       */
      const padding = 30;

      const maxX = Math.max(
        canvas.scrollWidth - padding,
        padding
      );

      const maxY = Math.max(
        canvas.scrollHeight - padding,
        padding
      );

      const nextPosition = {
        x: Math.max(
          padding,
          Math.min(x, maxX)
        ),
        y: Math.max(
          padding,
          Math.min(y, maxY)
        ),
      };

      onTargetChange?.(nextPosition);
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

  /*
   * ---------------------------------------------------------
   * MESSAGE COLLISION / POSITIONING
   * ---------------------------------------------------------
   */
  const { positions, totalHeight } =
    useScrollCollision({
      messages,
      containerWidth: Math.max(
        containerWidth - 32,
        280
      ),
    });

  const positionMap = new Map(
    positions.map((position) => [
      position.id,
      position,
    ])
  );

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
      <div
        className="
          relative
          w-full
          mx-auto
        "
        style={{
          maxWidth: 720,
          minHeight: Math.max(
            totalHeight,
            520
          ),
        }}
      >
        {/* =================================================
            TARGET CURSOR
        ================================================= */}

        {magicMode && target && (
          <TargetCursor
            x={target.x}
            y={target.y}
            locked={targetLocked}
            visible={!flyingScroll?.visible}
            onClick={onTargetLock}
          />
        )}

        {/* =================================================
            FLYING SCROLL
        ================================================= */}

        {flyingScroll?.visible && (
          <FlyingScroll
            start={flyingScroll.start}
            target={flyingScroll.target}
            visible={flyingScroll.visible}
            duration={flyingScroll.duration ?? 1.1}
            rotation={flyingScroll.rotation ?? 720}
            scale={flyingScroll.scale ?? 1}
            onComplete={onFlyingComplete}
          />
        )}

        {/* =================================================
            MESSAGES
        ================================================= */}

        {messages.map((message) => {
          const id =
            message.id ??
            message._id ??
            "";

          const pos = positionMap.get(id);

          if (!pos) return null;

          return (
            <ScrollMessage
              key={
                id ||
                `${pos.x}-${pos.y}`
              }
              id={id}
              sender={message.sender}
              text={message.text}
              image={friend?.image}
              attachments={
                message.attachments
              }
              timestamp={
                message.timestamp
              }
              x={pos.x}
              y={pos.y}
              rotate={pos.rotate}
              width={pos.width}
            />
          );
        })}

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
              top: Math.max(
                totalHeight - 40,
                0
              ),
              background:
                colors.card.glass,
              border: `1px solid ${colors.border.light}`,
              backdropFilter:
                "blur(12px)",
            }}
          >
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                animate={{
                  y: [0, -5, 0],
                  opacity: [
                    0.4,
                    1,
                    0.4,
                  ],
                }}
                transition={{
                  duration: 0.7,
                  repeat: Infinity,
                  delay: dot * 0.16,
                }}
                className="
                  w-2
                  h-2
                  rounded-full
                "
                style={{
                  background:
                    colors.brand.lavender,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* =================================================
            SCROLL END MARKER
        ================================================= */}

        <div
          ref={messagesEndRef}
          style={{
            position: "absolute",
            top: totalHeight,
            left: 0,
            height: 1,
            width: 1,
          }}
        />
      </div>
    </div>
  );
}