import {
  useEffect,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  Send,
  Smile,
  Paperclip,
  Target,
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

  const [loaded, setLoaded] =
    useState(false);

  const [dragging, setDragging] =
    useState(false);

  const [launching, setLaunching] =
    useState(false);

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

  /*
   * ---------------------------------------------------------
   * MESSAGE LOADED INTO SLINGSHOT
   * ---------------------------------------------------------
   */

  useEffect(() => {
    setLoaded(
      message.trim().length > 0
    );
  }, [message]);

  /*
   * ---------------------------------------------------------
   * START DRAG
   * ---------------------------------------------------------
   */

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

  /*
   * ---------------------------------------------------------
   * DRAG
   * ---------------------------------------------------------
   */

  const handleMouseMove = (event) => {
    if (!dragging) return;

    updateDrag({
      x: event.clientX,
      y: event.clientY,
    });
  };

  /*
   * ---------------------------------------------------------
   * RELEASE
   * ---------------------------------------------------------
   */

  const handleMouseUp = async () => {
    if (!dragging) return;

    setDragging(false);

    const velocity = releaseDrag();

    /*
     * -------------------------------------------------------
     * SAFETY CHECKS
     * -------------------------------------------------------
     */

    if (!targetLocked) {
      reset();
      return;
    }

    const trimmedMessage =
      message.trim();

    if (!trimmedMessage) {
      reset();
      return;
    }

    /*
     * -------------------------------------------------------
     * SAVE THE MESSAGE BEFORE CLEARING INPUT
     * -------------------------------------------------------
     *
     * This is important.
     *
     * We save "hi" into trimmedMessage first.
     * Then we clear the input immediately.
     *
     * The flying scroll receives "hi" through onLaunch().
     * -------------------------------------------------------
     */

    setLaunching(true);

    /*
     * 🚨 THIS FIXES YOUR BUG
     *
     * Clear the input immediately when the user releases.
     */
    setMessage("");

    setLoaded(false);

    try {
      await onLaunch?.({
        text: trimmedMessage,
        velocity,
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

  /*
   * ---------------------------------------------------------
   * GLOBAL MOUSE EVENTS
   * ---------------------------------------------------------
   */

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

  /*
   * ---------------------------------------------------------
   * KEYBOARD
   *
   * Enter does NOT send.
   * Slingshot release is the send action.
   * ---------------------------------------------------------
   */

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

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
      {/* =================================================
          TARGET INSTRUCTION
      ================================================= */}

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

            <span className="
              text-xs
              text-violet-200/80
            ">
              Choose a target first
            </span>
          </motion.div>
        )}

      {/* =================================================
          TRAJECTORY
      ================================================= */}

      <Trajectory
        visible={isDragging}
        points={trajectory}
      />

      {/* =================================================
          SLINGSHOT
      ================================================= */}

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
        {/* Back */}
        <img
          src={slingshotBack}
          alt=""
          className="
            absolute
            inset-0
            w-full
            h-full
            object-contain
            pointer-events-none
          "
        />

        {/* =================================================
            LOADED SCROLL
        ================================================= */}

        {loaded && (
          <motion.img
            src={scrollRolled}
            alt=""
            onMouseDown={
              handleMouseDown
            }
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
            "
            style={{
              filter: targetLocked
                ? "drop-shadow(0 0 10px rgba(192,132,252,.65))"
                : "grayscale(.35) opacity(.65)",
            }}
          />
        )}

        {/* Front */}
        <img
          src={slingshotFront}
          alt=""
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

      {/* =================================================
          INPUT BAR
      ================================================= */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
        "
      >
        <div
          className="
            relative
            flex
            items-center
            gap-3
            rounded-full
            px-5
            py-3
            bg-white/10
            backdrop-blur-xl
            border
            border-white/15
          "
        >
          {/* Emoji */}
          <button
            type="button"
            disabled={
              disabled ||
              launching
            }
            className="
              text-violet-200
              hover:text-white
              transition
              disabled:opacity-40
            "
          >
            <Smile size={20} />
          </button>

          {/* Attachment */}
          <button
            type="button"
            disabled={
              disabled ||
              launching
            }
            className="
              text-violet-200
              hover:text-white
              transition
              disabled:opacity-40
            "
          >
            <Paperclip size={20} />
          </button>

          {/* Text input */}
          <input
            ref={inputRef}
            disabled={
              disabled ||
              launching
            }
            value={message}
            maxLength={
              MAX_MESSAGE_LENGTH
            }
            onChange={(event) =>
              setMessage(
                event.target.value
              )
            }
            onKeyDown={handleKeyDown}
            placeholder={
              targetLocked
                ? "Write your message..."
                : "Choose a target..."
            }
            className="
              flex-1
              min-w-0
              bg-transparent
              outline-none
              text-white
              placeholder:text-violet-200/60
            "
          />

          {/* Character count */}
          {message.length > 400 && (
            <span className="
              text-[10px]
              text-violet-200/50
            ">
              {message.length}/
              {MAX_MESSAGE_LENGTH}
            </span>
          )}

          {/* Visual send indicator */}
          <motion.button
            type="button"
            disabled={
              !message.trim() ||
              !targetLocked ||
              disabled ||
              launching
            }
            animate={
              targetLocked &&
              message.trim()
                ? {
                    scale: [
                      1,
                      1.05,
                      1,
                    ],
                  }
                : {}
            }
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            className="
              w-11
              h-11
              rounded-full
              bg-violet-500
              flex
              items-center
              justify-center
              hover:bg-violet-400
              disabled:opacity-40
              disabled:cursor-not-allowed
              transition
            "
            onClick={() => {
              /*
               * Intentionally empty.
               *
               * The message is sent by pulling
               * and releasing the scroll.
               */
            }}
          >
            <Send size={18} />
          </motion.button>
        </div>

        {/* =================================================
            INSTRUCTION
        ================================================= */}

        <div className="
          flex
          justify-center
          mt-2
          pointer-events-none
        ">
          <span className="
            text-[10px]
            tracking-wide
            text-violet-200/40
          ">
            {targetLocked
              ? "Pull the scroll back and release"
              : "Click the target where your message should land"}
          </span>
        </div>
      </div>
    </div>
  );
}