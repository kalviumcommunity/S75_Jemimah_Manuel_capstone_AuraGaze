import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import MessageCanvas from "../components/chat/MagicChat/MessageCanvas";
import SlingshotInput from "../components/chat/MagicChat/SlingshotInput";
import ChatHeader from "../components/chat/ChatHeader";

import {
  getFriend,
  getHistory,
  sendMessage as sendMessageToAI,
} from "../services/chatService";

export default function MagicChat() {
  const navigate =
    useNavigate();

  // =========================================================
  // REFS
  // =========================================================

  const canvasRef =
    useRef(null);

  // =========================================================
  // BASIC STATE
  // =========================================================

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    friend,
    setFriend,
  ] = useState({
    name: "",
    image: "",
  });

  const [
    messages,
    setMessages,
  ] = useState([]);

  const [
    typing,
    setTyping,
  ] = useState(false);

  // =========================================================
  // TARGET
  //
  // IMPORTANT:
  // target.x/y are RELATIVE TO THE INNER MAGIC CANVAS.
  // =========================================================

  const [
    target,
    setTarget,
  ] = useState({
    x: 360,
    y: 350,
  });

  const [
    targetLocked,
    setTargetLocked,
  ] = useState(false);

  // =========================================================
  // FLYING SCROLL
  // =========================================================

  const [
    flyingScroll,
    setFlyingScroll,
  ] = useState(null);

  // =========================================================
  // LOAD FRIEND + HISTORY
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const load =
      async () => {
        try {
          setLoading(true);
          setError("");

          const friendData =
            await getFriend();

          if (!mounted) {
            return;
          }

          setFriend({
            name:
              friendData
                ?.friend
                ?.name ||
              "Friend",

            image:
              friendData
                ?.friend
                ?.image ||
              "",
          });

          const history =
            await getHistory();

          if (!mounted) {
            return;
          }

          /*
           * Convert backend messages into
           * Magic Chat messages.
           */

          const formatted =
            (
              history || []
            ).map(
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

                target:
                  msg.target ||
                  null,
              })
            );

          setMessages(
            formatted
          );
        } catch (err) {
          console.error(
            "Magic Chat load error:",
            err
          );

          if (!mounted) {
            return;
          }

          setError(
            err?.response
              ?.data
              ?.message ||
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

  const handleTargetChange =
    useCallback(
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
    }, [
      flyingScroll,
    ]);

  // =========================================================
  // CALCULATE SLINGSHOT START
  //
  // Converts the slingshot's viewport center
  // into INNER CANVAS coordinates.
  // =========================================================

  const getSlingshotPosition =
    useCallback(
      (
        slingshotElement
      ) => {
        const outerCanvas =
          canvasRef.current;

        if (
          !outerCanvas
        ) {
          return {
            x: 360,
            y: 650,
          };
        }

        const innerCanvas =
          outerCanvas.querySelector(
            "[data-magic-canvas]"
          );

        if (
          !innerCanvas
        ) {
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

        /*
         * Use the actual slingshot element.
         */

        if (
          slingshotElement
        ) {
          const slingRect =
            slingshotElement.getBoundingClientRect();

          return {
            x:
              slingRect.left +
              slingRect.width /
                2 -
              canvasRect.left,

            y:
              slingRect.top +
              slingRect.height *
                0.42 -
              canvasRect.top,
          };
        }

        return {
          x:
            innerCanvas.clientWidth /
            2,

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

  const handleLaunch =
    useCallback(
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
         * Freeze target at the exact moment
         * the user releases the paper.
         */

        const lockedTarget = {
          x: target.x,
          y: target.y,
        };

        /*
         * Get the exact launch origin
         * in the SAME coordinate system.
         */

        const start =
          getSlingshotPosition(
            slingshotElement
          );

        console.log(
          "MAGIC LAUNCH",
          {
            start,
            target:
              lockedTarget,
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

          duration:
            1.15,

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
        if (
          !flyingScroll
        ) {
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
         * IMPORTANT:
         *
         * target.x/y are ALREADY in the INNER CANVAS
         * coordinate system.
         *
         * DO NOT subtract canvas.left again.
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
           * EXACT CENTER TARGET
           */

          target: {
            x:
              landingTarget.x,

            y:
              landingTarget.y,
          },
        };

        /*
         * Add message immediately.
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

        setFlyingScroll(
          null
        );

        /*
         * Target is available
         * again.
         */

        setTargetLocked(
          false
        );

        /*
         * AI typing.
         */

        setTyping(true);

        try {
          const response =
            await sendMessageToAI(
              text,
              []
            );

          // ===================================================
          // BACKEND USER ID
          // ===================================================

          if (
            response?.userMessageId
          ) {
            setMessages(
              (previous) =>
                previous.map(
                  (
                    message
                  ) =>
                    message.id ===
                    tempId
                      ? {
                          ...message,

                          id:
                            response.userMessageId,

                          /*
                           * NEVER lose target.
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
          // AI REPLIES
          // ===================================================

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

                  Math.min(
                    700 +
                      reply.length *
                        18,

                    2000
                  )
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

                  sender:
                    "ai",

                  text:
                    reply,

                  attachments:
                    [],

                  timestamp:
                    new Date().toISOString(),

                  target:
                    null,
                },
              ]
            );

            if (
              i <
              replies.length -
                1
            ) {
              setTyping(
                true
              );
            }
          }
        } catch (err) {
          console.error(
            "Magic Chat send error:",
            err
          );

          setMessages(
            (previous) => [
              ...previous,

              {
                id:
                  `magic-error-${Date.now()}`,

                sender:
                  "ai",

                text:
                  "Sorry 😭 Something went wrong. Please try again.",

                attachments:
                  [],

                timestamp:
                  new Date().toISOString(),

                target:
                  null,
              },
            ]
          );
        } finally {
          setTyping(false);
        }
      },
      [
        flyingScroll,
      ]
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

      <div className="
        relative
        z-[600]
        shrink-0
      ">
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

      <div className="
        relative
        flex-1
        min-h-0
        z-10
      ">
        <MessageCanvas
          messages={
            messages
          }
          friend={
            friend
          }
          typing={
            typing
          }
          scrollContainerRef={
            canvasRef
          }
          magicMode={
            true
          }
          target={
            target
          }
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

      <div className="
        absolute
        bottom-0
        left-0
        right-0
        z-[700]
      ">
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
