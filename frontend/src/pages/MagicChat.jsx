import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import MessageCanvas from "../components/chat/MagicChat/MessageCanvas";
import SlingshotInput from "../components/chat/MagicChat/SlingshotInput";

import {
  getFriend,
  getHistory,
  sendMessage as sendMessageToAI,
} from "../services/chatService";

export default function MagicChat() {
  const canvasRef = useRef(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [friend, setFriend] =
    useState({
      name: "",
      image: "",
    });

  const [messages, setMessages] =
    useState([]);

  const [typing, setTyping] =
    useState(false);

  /*
   * ---------------------------------------------------------
   * MAGIC MODE
   * ---------------------------------------------------------
   */

  const magicMode = true;

  /*
   * ---------------------------------------------------------
   * TARGET
   * ---------------------------------------------------------
   */

  const [target, setTarget] =
    useState({
      x: 360,
      y: 300,
    });

  const [
    targetLocked,
    setTargetLocked,
  ] = useState(false);

  /*
   * ---------------------------------------------------------
   * FLYING SCROLL
   * ---------------------------------------------------------
   */

  const [
    flyingScroll,
    setFlyingScroll,
  ] = useState(null);

  /*
   * ---------------------------------------------------------
   * LOAD CHAT
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const friendData =
          await getFriend();

        setFriend({
          name:
            friendData?.friend
              ?.name || "Friend",

          image:
            friendData?.friend
              ?.image || "",
        });

        const history =
          await getHistory();

        const formatted =
          (history || []).map(
            (msg) => ({
              id: msg._id,

              sender:
                msg.sender,

              text:
                msg.message,

              attachments:
                msg.attachments || [],

              timestamp:
                msg.createdAt ||
                new Date().toISOString(),

              /*
               * Old messages don't have
               * Magic Chat targets.
               */
              target:
                msg.target || null,
            })
          );

        setMessages(
          formatted
        );
      } catch (err) {
        console.error(err);

        setError(
          err?.response?.data
            ?.message ||
            err?.message ||
            "Unable to load Magic Chat."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /*
   * ---------------------------------------------------------
   * TARGET MOVEMENT
   * ---------------------------------------------------------
   */

  const handleTargetChange =
    useCallback(
      (position) => {
        if (targetLocked) {
          return;
        }

        if (
          flyingScroll?.visible
        ) {
          return;
        }

        setTarget(position);
      },
      [
        targetLocked,
        flyingScroll,
      ]
    );

  /*
   * ---------------------------------------------------------
   * LOCK / UNLOCK TARGET
   * ---------------------------------------------------------
   */

  const handleTargetLock =
    useCallback(() => {
      if (
        flyingScroll?.visible
      ) {
        return;
      }

      setTargetLocked(
        (previous) =>
          !previous
      );
    }, [flyingScroll]);

  /*
   * ---------------------------------------------------------
   * SLINGSHOT START POSITION
   * ---------------------------------------------------------
   */

  const getSlingshotPosition =
    useCallback(() => {
      const canvas =
        canvasRef.current;

      if (!canvas) {
        return {
          x: 360,
          y: 500,
        };
      }

      /*
       * MessageCanvas is the coordinate system.
       *
       * The slingshot visually sits at the bottom.
       */
      return {
        x:
          canvas.clientWidth / 2,

        y:
          canvas.scrollTop +
          canvas.clientHeight -
          250,
      };
    }, []);

  /*
   * ---------------------------------------------------------
   * LAUNCH
   * ---------------------------------------------------------
   */

  const handleLaunch =
    useCallback(
      async ({
        text,
        velocity,
      }) => {
        if (
          !targetLocked ||
          !text?.trim() ||
          flyingScroll?.visible
        ) {
          return;
        }

        const start =
          getSlingshotPosition();

        /*
         * Freeze target at launch time.
         */
        const lockedTarget = {
          x: target.x,
          y: target.y,
        };

        setFlyingScroll({
          visible: true,

          start,

          target:
            lockedTarget,

          text:
            text.trim(),

          velocity,

          duration: 1.1,

          rotation:
            velocity?.x >= 0
              ? 720
              : -720,

          scale: 1,
        });
      },
      [
        target,
        targetLocked,
        flyingScroll,
        getSlingshotPosition,
      ]
    );

  /*
   * ---------------------------------------------------------
   * FLYING SCROLL FINISHED
   * ---------------------------------------------------------
   */

  const handleFlyingComplete =
    useCallback(
      async () => {
        if (
          !flyingScroll
        ) {
          return;
        }

        const {
          text,
          target: landingTarget,
        } = flyingScroll;

        /*
         * Create the user message immediately
         * at the exact landing target.
         *
         * This gives us the visual landing effect
         * without waiting for the backend.
         */
        const tempId =
          `magic-user-${Date.now()}`;

        const userMessage = {
          id: tempId,

          sender: "user",

          text,

          attachments: [],

          timestamp:
            new Date().toISOString(),

          /*
           * THIS IS WHAT MAKES THE MESSAGE
           * STAY AT THE TARGET.
           */
          target:
            landingTarget,
        };

        setMessages(
          (previous) => [
            ...previous,
            userMessage,
          ]
        );

        /*
         * Remove the flying scroll.
         */
        setFlyingScroll(null);

        /*
         * Unlock target.
         */
        setTargetLocked(false);

        /*
         * Start AI thinking.
         */
        setTyping(true);

        try {
          const response =
            await sendMessageToAI(
              text,
              []
            );

          /*
           * Replace temporary user ID
           * with backend ID.
           */
          if (
            response?.userMessageId
          ) {
            setMessages(
              (previous) =>
                previous.map(
                  (message) =>
                    message.id ===
                    tempId
                      ? {
                          ...message,

                          id:
                            response.userMessageId,

                          /*
                           * Preserve target.
                           */
                          target:
                            landingTarget,
                        }
                      : message
                )
            );
          }

          const replies =
            Array.isArray(
              response?.reply
            )
              ? response.reply
              : [
                  response?.reply,
                ].filter(Boolean);

          const aiIds =
            response?.aiMessageIds ||
            [];

          /*
           * AI replies.
           */
          for (
            let i = 0;
            i < replies.length;
            i++
          ) {
            const reply =
              replies[i];

            await new Promise(
              (resolve) =>
                setTimeout(
                  resolve,
                  i === 0
                    ? Math.min(
                        700 +
                          reply.length *
                            18,
                        2000
                      )
                    : 500
                )
            );

            setTyping(false);

            setMessages(
              (previous) => [
                ...previous,

                {
                  id:
                    aiIds[i] ||
                    `magic-ai-${Date.now()}-${i}`,

                  sender: "ai",

                  text: reply,

                  attachments: [],

                  timestamp:
                    new Date().toISOString(),

                  /*
                   * AI messages do not have
                   * a user-selected target.
                   *
                   * useScrollCollision will
                   * position them automatically.
                   */
                  target: null,
                },
              ]
            );

            if (
              i <
              replies.length - 1
            ) {
              setTyping(true);
            }
          }
        } catch (err) {
          console.error(err);

          setMessages(
            (previous) => [
              ...previous,

              {
                id:
                  `magic-error-${Date.now()}`,

                sender: "ai",

                text:
                  "Sorry 😭 Something went wrong. Please try again.",

                timestamp:
                  new Date().toISOString(),

                target: null,
              },
            ]
          );
        } finally {
          setTyping(false);
        }
      },
      [flyingScroll]
    );

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <div
        className="
          h-screen
          w-full
          flex
          items-center
          justify-center
          bg-[#090414]
        "
      >
        <div className="
          flex
          flex-col
          items-center
          gap-4
        ">
          <div className="
            h-12
            w-12
            rounded-full
            border-4
            border-violet-500
            border-t-transparent
            animate-spin
          " />

          <p className="
            text-white/80
            text-lg
          ">
            Preparing Magic Chat...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * ERROR
   * ---------------------------------------------------------
   */

  if (error) {
    return (
      <div
        className="
          h-screen
          w-full
          flex
          items-center
          justify-center
          bg-[#090414]
          px-6
        "
      >
        <div className="
          max-w-md
          text-center
          rounded-3xl
          border
          border-white/10
          bg-white/5
          backdrop-blur-xl
          p-8
        ">
          <h1 className="
            text-2xl
            text-white
            font-semibold
            mb-3
          ">
            Magic Chat couldn't load
          </h1>

          <p className="
            text-white/60
          ">
            {error}
          </p>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAGIC CHAT
   * ---------------------------------------------------------
   */

  return (
    <div
      className="
        relative
        w-full
        h-screen
        overflow-hidden
        bg-[#090414]
      "
    >
      {/* Background glow */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
        "
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(139,92,246,.12), transparent 45%)",
        }}
      />

      {/* ===================================================
          MESSAGE CANVAS
      =================================================== */}

      <div
        className="
          absolute
          inset-0
          z-10
        "
      >
        <MessageCanvas
          messages={messages}
          friend={friend}
          typing={typing}
          scrollContainerRef={
            canvasRef
          }
          magicMode={
            magicMode
          }
          target={target}
          targetLocked={
            targetLocked
          }
          onTargetChange={
            handleTargetChange
          }
          onTargetLock={
            handleTargetLock
          }
          flyingScroll={
            flyingScroll
          }
          onFlyingComplete={
            handleFlyingComplete
          }
        />
      </div>

      {/* ===================================================
          SLINGSHOT
      =================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          z-50
        "
      >
        <SlingshotInput
          onLaunch={
            handleLaunch
          }
          targetLocked={
            targetLocked
          }
          disabled={
            flyingScroll?.visible ??
            false
          }
        />
      </div>

      {/* ===================================================
          FRIEND NAME
      =================================================== */}

      <div
        className="
          absolute
          top-5
          left-1/2
          -translate-x-1/2
          z-50
          pointer-events-none
        "
      >
        <div className="
          px-4
          py-2
          rounded-full
          bg-white/5
          border
          border-white/10
          backdrop-blur-xl
        ">
          <span className="
            text-sm
            text-white/70
          ">
            Magic Chat ·{" "}
            {friend.name ||
              "Friend"}
          </span>
        </div>
      </div>
    </div>
  );
}