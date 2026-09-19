import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import MessageCanvas from "../components/chat/MagicChat/MessageCanvas";
import SlingshotInput from "../components/chat/MagicChat/SlingshotInput";
import ChatHeader from "../components/chat/ChatHeader";

import {
  getFriend,
  getHistory,
  sendMessage as sendMessageToAI,
} from "../services/chatService";

export default function MagicChat() {
  const navigate = useNavigate();

  // =========================================================
  // REFS
  // =========================================================

  const canvasRef = useRef(null);

  // =========================================================
  // BASIC STATE
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [friend, setFriend] = useState({
    name: "",
    image: "",
  });

  const [messages, setMessages] = useState([]);

  const [typing, setTyping] = useState(false);

  // =========================================================
  // TARGET
  // =========================================================

  const [target, setTarget] = useState({
    x: 360,
    y: 350,
  });

  const [targetLocked, setTargetLocked] = useState(false);

  // =========================================================
  // FLYING SCROLL
  // =========================================================

  const [flyingScroll, setFlyingScroll] = useState(null);

  // =========================================================
  // LOAD FRIEND + CHAT HISTORY
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const friendData = await getFriend();

        if (!mounted) {
          return;
        }

        setFriend({
          name:
            friendData?.friend?.name ||
            "Friend",

          image:
            friendData?.friend?.image ||
            "",
        });

        const history = await getHistory();

        if (!mounted) {
          return;
        }

        const formatted = (history || []).map(
          (msg) => ({
            id:
              msg._id ||
              msg.id,

            sender:
              msg.sender,

            text:
              msg.message ||
              msg.text ||
              "",

            attachments:
              msg.attachments ||
              [],

            timestamp:
              msg.createdAt ||
              msg.timestamp ||
              new Date().toISOString(),

            /*
             * User messages sent through Magic Chat
             * contain their target.
             *
             * Old messages without a target
             * will receive a random position.
             */
            target:
              msg.target ||
              null,
          })
        );

        setMessages(formatted);
      } catch (err) {
        console.error(
          "Magic Chat load error:",
          err
        );

        if (!mounted) {
          return;
        }

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load Magic Chat."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================================================
  // TARGET MOVEMENT
  // =========================================================

  const handleTargetChange = useCallback(
    (position) => {
      if (
        targetLocked ||
        flyingScroll?.visible
      ) {
        return;
      }

      setTarget({
        x: position.x,
        y: position.y,
      });
    },
    [
      targetLocked,
      flyingScroll,
    ]
  );

  // =========================================================
  // TARGET LOCK
  // =========================================================

  const handleTargetLock = useCallback(() => {
    if (flyingScroll?.visible) {
      return;
    }

    setTargetLocked(
      (previous) => !previous
    );
  }, [flyingScroll]);

  // =========================================================
  // CALCULATE SLINGSHOT POSITION
  // =========================================================

  const getSlingshotPosition =
    useCallback(
      (slingshotElement) => {
        const outerCanvas =
          canvasRef.current;

        if (!outerCanvas) {
          return {
            x: 360,
            y: 650,
          };
        }

        const innerCanvas =
          outerCanvas.querySelector(
            "[data-magic-canvas]"
          );

        if (!innerCanvas) {
          return {
            x:
              outerCanvas.clientWidth /
              2,

            y:
              outerCanvas.scrollTop +
              outerCanvas.clientHeight -
              100,
          };
        }

        const canvasRect =
          innerCanvas.getBoundingClientRect();

        if (slingshotElement) {
          const slingRect =
            slingshotElement.getBoundingClientRect();

          return {
            x:
              slingRect.left +
              slingRect.width / 2 -
              canvasRect.left,

            y:
              slingRect.top +
              slingRect.height * 0.42 -
              canvasRect.top,
          };
        }

        return {
          x:
            innerCanvas.clientWidth / 2,

          y:
            outerCanvas.scrollTop +
            outerCanvas.clientHeight -
            120,
        };
      },
      []
    );

  // =========================================================
  // LAUNCH
  // =========================================================

  const handleLaunch = useCallback(
    async ({
      text,
      velocity,
      slingshotElement,
    }) => {
      if (
        !text?.trim() ||
        !targetLocked ||
        flyingScroll?.visible
      ) {
        return;
      }

      /*
       * Freeze the exact target at release time.
       */
      const lockedTarget = {
        x: target.x,
        y: target.y,
      };

      /*
       * Calculate the launch point in the
       * SAME coordinate system as the target.
       */
      const start =
        getSlingshotPosition(
          slingshotElement
        );

      console.log(
        "MAGIC LAUNCH",
        {
          start,
          target: lockedTarget,
        }
      );

      setFlyingScroll({
        visible: true,

        start,

        target:
          lockedTarget,

        text:
          text.trim(),

        velocity,

        duration: 1.15,

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

  // =========================================================
  // FLYING PAPER COMPLETED
  // =========================================================

  const handleFlyingComplete =
    useCallback(
      async () => {
        if (!flyingScroll) {
          return;
        }

        const text =
          flyingScroll.text;

        const landingTarget =
          flyingScroll.target;

        /*
         * ====================================================
         * TEMP USER MESSAGE
         * ====================================================
         *
         * x/y = exact CENTER of the target.
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

          target: {
            x:
              landingTarget.x,

            y:
              landingTarget.y,
          },
        };

        /*
         * Add user message immediately.
         */
        setMessages(
          (previous) => [
            ...previous,
            userMessage,
          ]
        );

        /*
         * Remove flying paper.
         */
        setFlyingScroll(null);

        /*
         * Allow another target.
         */
        setTargetLocked(false);

        /*
         * AI starts thinking.
         */
        setTyping(true);

        try {
          // ===================================================
          // SEND TO BACKEND
          // ===================================================

          const response =
            await sendMessageToAI(
              text,
              []
            );

          console.log(
            "MAGIC CHAT AI RESPONSE:",
            response
          );

          // ===================================================
          // UPDATE TEMP USER ID
          // ===================================================

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
                           * NEVER lose the target.
                           */
                          target: {
                            x:
                              landingTarget.x,

                            y:
                              landingTarget.y,
                          },
                        }
                      : message
                )
            );
          }

          // ===================================================
          // NORMALIZE AI REPLIES
          // ===================================================

          const replies =
            Array.isArray(
              response?.reply
            )
              ? response.reply
              : response?.reply
              ? [response.reply]
              : [];

          const aiIds =
            Array.isArray(
              response?.aiMessageIds
            )
              ? response.aiMessageIds
              : [];

          /*
           * If backend somehow returns no reply,
           * don't leave the user thinking the app is frozen.
           */
          if (replies.length === 0) {
            console.warn(
              "Magic Chat received no AI reply.",
              response
            );

            setTyping(false);

            return;
          }

          // ===================================================
          // SHOW AI REPLIES
          // ===================================================

          for (
            let i = 0;
            i < replies.length;
            i++
          ) {
            const reply =
              String(
                replies[i] ?? ""
              ).trim();

            if (!reply) {
              continue;
            }

            /*
             * Small natural delay.
             */
            await new Promise(
              (resolve) =>
                setTimeout(
                  resolve,
                  Math.min(
                    700 +
                      reply.length *
                        18,
                    2000
                  )
                )
            );

            setTyping(false);

            /*
             * IMPORTANT:
             *
             * AI does NOT receive a target.
             *
             * useScrollCollision.js will therefore
             * give the AI message its own stable random
             * location.
             */
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

                  target: null,
                },
              ]
            );

            /*
             * If backend split the answer into multiple
             * messages, show typing again before the
             * next one.
             */
            if (
              i <
              replies.length - 1
            ) {
              setTyping(true);
            }
          }
        } catch (err) {
          console.error(
            "Magic Chat send error:",
            err
          );

          setTyping(false);

          /*
           * Error messages are also random-position
           * messages because they have no target.
           */
          setMessages(
            (previous) => [
              ...previous,

              {
                id:
                  `magic-error-${Date.now()}`,

                sender: "ai",

                text:
                  "Sorry 😭 Something went wrong. Please try again.",

                attachments: [],

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

  // =========================================================
  // LOADING
  // =========================================================

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
        <div
          className="
            flex
            flex-col
            items-center
            gap-4
          "
        >
          <div
            className="
              h-12
              w-12
              rounded-full
              border-4
              border-violet-500
              border-t-transparent
              animate-spin
            "
          />

          <p
            className="
              text-white/80
              text-lg
            "
          >
            Preparing Magic Chat...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

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
        <div
          className="
            max-w-md
            text-center
            rounded-3xl
            border
            border-white/10
            bg-white/5
            backdrop-blur-xl
            p-8
          "
        >
          <h1
            className="
              text-2xl
              text-white
              font-semibold
              mb-3
            "
          >
            Magic Chat couldn't load
          </h1>

          <p
            className="
              text-white/60
            "
          >
            {error}
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      className="
        relative
        w-full
        h-screen
        overflow-hidden
        bg-[#090414]
        flex
        flex-col
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          relative
          z-[600]
          shrink-0
        "
      >
        <ChatHeader
          friend={friend}
          status="Online"
          mood="Magic mode"
          friendshipLevel="Best Friend"
          onBack={() =>
            navigate("/chat")
          }
          onNewChat={() =>
            navigate("/chat")
          }
        />
      </div>

      {/* =====================================================
          MAGIC CANVAS
      ===================================================== */}

      <div
        className="
          relative
          flex-1
          min-h-0
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
          magicMode={true}
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

      {/* =====================================================
          SLINGSHOT INPUT
      ===================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          z-[700]
        "
      >
        <SlingshotInput
          targetLocked={
            targetLocked
          }
          disabled={
            flyingScroll?.visible ||
            false
          }
          onLaunch={
            handleLaunch
          }
        />
      </div>
    </div>
  );
}