import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Smile, Paperclip } from "lucide-react";

import useSlingshotPhysics from "../../hooks/useSlingshotPhysics";
import Trajectory from "./Trajectory";

import slingshotBack from "../../assets/slingshot/slingshot-back.png";
import slingshotFront from "../../assets/slingshot/slingshot-front.png";
import scrollRolled from "../../assets/paper/scroll-rolled.png";

const MAX_MESSAGE_LENGTH = 500;

export default function SlingshotInput({
  disabled = false,
  onLaunch,
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

  useEffect(() => {
    if (message.trim()) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [message]);

  const handleMouseDown = (e) => {
    if (!loaded || launching) return;

    setDragging(true);

    beginDrag({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    updateDrag({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseUp = async () => {
    if (!dragging) return;

    setDragging(false);

    const velocity = releaseDrag();

    if (!message.trim()) return;

    setLaunching(true);

    if (onLaunch) {
      await onLaunch({
        text: message,
        velocity,
      });
    }

    setMessage("");
    setLoaded(false);
    reset();
    setLaunching(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-[240px] select-none"
    >
      {/* trajectory */}
      <Trajectory
        visible={isDragging}
        points={trajectory}
      />

      {/* slingshot */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 h-48">

        <img
          src={slingshotBack}
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {loaded && (
          <motion.img
            src={scrollRolled}
            alt=""
            onMouseDown={handleMouseDown}
            animate={{
              x: dragPosition.x,
              y: dragPosition.y,
              scale: dragging ? 0.95 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 18,
            }}
            className="absolute
                       left-1/2
                       top-[38%]
                       w-14
                       -translate-x-1/2
                       cursor-grab
                       active:cursor-grabbing
                       z-20"
          />
        )}

        <img
          src={slingshotFront}
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-30"
        />
      </div>

      {/* input */}
      <div className="absolute bottom-0 left-0 right-0">

        <div
          className="
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
          <button
            className="text-violet-200 hover:text-white transition"
          >
            <Smile size={20} />
          </button>

          <button
            className="text-violet-200 hover:text-white transition"
          >
            <Paperclip size={20} />
          </button>

          <input
            ref={inputRef}
            disabled={disabled || launching}
            value={message}
            maxLength={MAX_MESSAGE_LENGTH}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="
              flex-1
              bg-transparent
              outline-none
              text-white
              placeholder:text-violet-200/60
            "
          />

          <button
            disabled={!message.trim()}
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
            "
          >
            <Send size={18} />
          </button>

        </div>

      </div>
    </div>
  );
}