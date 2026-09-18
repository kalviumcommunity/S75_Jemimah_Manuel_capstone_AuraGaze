import {
  useEffect,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  Target,
  Send,
  Smile,
  Paperclip,
} from "lucide-react";

import useSlingshotPhysics from "../../../hooks/useSlingshotPhysics";

import Trajectory from "./Trajectory";

import slingshotBack from "../../../assets/slingshot/slingshot-back.png";
import slingshotFront from "../../../assets/slingshot/slingshot-front.png";
import scrollRolled from "../../../assets/paper/scroll-rolled.png";

const MAX_MESSAGE_LENGTH = 500;

export default function SlingshotInput({
  disabled = false,
  onLaunch,
  targetLocked = false,
}) {
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [launching, setLaunching] = useState(false);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const {
    dragPosition,
    trajectory,
    isDragging,
    beginDrag,
    updateDrag,
    releaseDrag,
    reset,
  } = useSlingshotPhysics();

  // =========================================================
  // MESSAGE LOADED
  // =========================================================

  useEffect(() => {
    setLoaded(message.trim().length > 0);
  }, [message]);

  // =========================================================
  // START DRAG
  // =========================================================

  const handleMouseDown = (event) => {
    if (
      !loaded ||
      launching ||
      disabled ||
      !targetLocked
    ) {
      return;
    }

    event.preventDefault();

    setDragging(true);

    beginDrag({
      x: event.clientX,
      y: event.clientY,
    });
  };

  // =========================================================
  // DRAG
  // =========================================================

  const handleMouseMove = (event) => {
    if (!dragging) {
      return;
    }

    updateDrag({
      x: event.clientX,
      y: event.clientY,
    });
  };

  // =========================================================
  // RELEASE
  // =========================================================

  const handleMouseUp = async () => {
    if (!dragging) {
      return;
    }

    setDragging(false);

    const velocity = releaseDrag();

    if (!targetLocked) {
      reset();
      return;
    }

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      reset();
      return;
    }

    setLaunching(true);

    /*
     * Clear immediately after release.
     * The flying scroll already receives the text
     * through trimmedMessage.
     */

    setMessage("");
    setLoaded(false);

    try {
      await onLaunch?.({
        text: trimmedMessage,
        velocity,

        /*
         * IMPORTANT:
         * MagicChat uses this real DOM element
         * to calculate the exact launch position.
         */

        slingshotElement:
          wrapperRef.current,
      });
    } catch (error) {
      console.error(
        "Magic Chat launch failed:",
        error
      );
    } finally {
      reset();
      setDragging(false);
      setLaunching(false);
    }
  };

  // =========================================================
  // GLOBAL MOUSE EVENTS
  // =========================================================

  useEffect(() => {
    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mouseup",
      handleMouseUp
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp
      );
    };
  });

  // =========================================================
  // INPUT
  // =========================================================

  const handleChange = (event) => {
    const value =
      event.target.value.slice(
        0,
        MAX_MESSAGE_LENGTH
      );

    setMessage(value);
  };

  const handleKeyDown = (event) => {
    /*
     * Enter does NOT send.
     * Magic Chat sends through slingshot release.
     */

    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      ref={wrapperRef}
      className="
        relative
        w-full
        h-[240px]
        select-none
      "
    >
      {/* =====================================================
          TARGET INSTRUCTION
      ===================================================== */}

      {!targetLocked &&
        loaded && (
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
              bottom-[220px]
              left-1/2
              -translate-x-1/2
              z-50
              flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              whitespace-nowrap
              pointer-events-none
            "
            style={{
              background:
                "rgba(30,20,55,.75)",

              border:
                "1px solid rgba(192,132,252,.25)",

              backdropFilter:
                "blur(14px)",

              boxShadow:
                "0 0 25px rgba(168,85,247,.18)",
            }}
          >
            <Target
              size={14}
              className="text-violet-300"
            />

            <span
              className="
                text-xs
                text-violet-200/80
              "
            >
              Choose a target first
            </span>
          </motion.div>
        )}

      {/* =====================================================
          TRAJECTORY
      ===================================================== */}

      <Trajectory
        visible={isDragging}
        points={trajectory}
      />

      {/* =====================================================
          SLINGSHOT
      ===================================================== */}

      <div
        className="
          absolute
          bottom-4
          left-1/2
          -translate-x-1/2
          w-64
          h-48
        "
      >
        {/* ---------------------------------------------------
            SLINGSHOT BACK
        --------------------------------------------------- */}

        <img
          src={slingshotBack}
          alt=""
          draggable={false}
          className="
            absolute
            inset-0
            w-full
            h-full
            object-contain
            pointer-events-none
          "
        />

        {/* ---------------------------------------------------
            LOADED SCROLL
        --------------------------------------------------- */}

        {loaded && (
          <motion.img
            ref={inputRef}
            src={scrollRolled}
            alt=""
            draggable={false}
            onMouseDown={handleMouseDown}
            animate={{
              x: dragPosition.x,
              y: dragPosition.y,
              scale: dragging
                ? 0.95
                : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 18,
            }}
            className="
              absolute
              left-1/2
              top-[38%]
              w-14
              -translate-x-1/2
              cursor-grab
              active:cursor-grabbing
              z-20
              touch-none
              select-none
            "
            style={{
              filter: targetLocked
                ? "drop-shadow(0 0 10px rgba(192,132,252,.65))"
                : "grayscale(.35) opacity(.65)",
            }}
          />
        )}

        {/* ---------------------------------------------------
            SLINGSHOT FRONT
        --------------------------------------------------- */}

        <img
          src={slingshotFront}
          alt=""
          draggable={false}
          className="
            absolute
            inset-0
            w-full
            h-full
            object-contain
            pointer-events-none
            z-30
          "
        />
      </div>

      {/* =====================================================
          MESSAGE INPUT
      ===================================================== */}

      <div
        className="
          absolute
          left-1/2
          -translate-x-1/2
          bottom-0
          w-full
          max-w-xl
          px-4
          z-[100]
        "
      >
        <div
          className="
            relative
            flex
            items-center
            gap-2
            rounded-2xl
            px-3
            py-2
          "
          style={{
            background:
              "rgba(18,12,35,.82)",

            border:
              "1px solid rgba(255,255,255,.10)",

            backdropFilter:
              "blur(18px)",

            boxShadow:
              "0 12px 40px rgba(0,0,0,.35)",
          }}
        >
          <button
            type="button"
            className="
              shrink-0
              flex
              items-center
              justify-center
              w-9
              h-9
              rounded-full
              text-white/50
              hover:text-white
              hover:bg-white/10
              transition
            "
          >
            <Smile size={19} />
          </button>

          <input
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={
              disabled ||
              launching
            }
            maxLength={
              MAX_MESSAGE_LENGTH
            }
            placeholder={
              targetLocked
                ? "Load your message into the scroll..."
                : "Choose a target first..."
            }
            className="
              flex-1
              min-w-0
              bg-transparent
              outline-none
              text-sm
              text-white
              placeholder:text-white/35
            "
          />

          <button
            type="button"
            className="
              shrink-0
              flex
              items-center
              justify-center
              w-9
              h-9
              rounded-full
              text-white/50
              hover:text-white
              hover:bg-white/10
              transition
            "
          >
            <Paperclip size={18} />
          </button>

          <div
            className="
              shrink-0
              flex
              items-center
              justify-center
              w-9
              h-9
              rounded-full
            "
            style={{
              background:
                loaded &&
                targetLocked
                  ? "rgba(192,132,252,.18)"
                  : "rgba(255,255,255,.05)",
            }}
          >
            <Send
              size={17}
              className={
                loaded &&
                targetLocked
                  ? "text-violet-300"
                  : "text-white/25"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}