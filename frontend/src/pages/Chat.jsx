import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatLayout from "../components/layout/ChatLayout";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import ProfileModal from "../components/chat/ProfileModal";
import ConfirmDialog from "../components/chat/ConfirmDialog";
import ErrorBoundary from "../components/ErrorBoundary";

import {
  getFriend,
  getHistory,
  sendMessage as sendMessageToAI,
  clearChat as clearChatApi,
  deleteMessages as deleteMessagesApi,
  editMessage as editMessageApi,
} from "../services/chatService";

export default function Chat() {
  const navigate = useNavigate();

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const hasScrolledInitially = useRef(false);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [typing, setTyping] = useState(false);

  const [friend, setFriend] = useState({
    name: "",
    image: "",
  });

  const [nickname, setNickname] = useState("");

  const [messages, setMessages] = useState([]);
  const [quotaNotice, setQuotaNotice] = useState("");

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // ============================================================
  // Selection Mode
  // ============================================================

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // ============================================================
  // Confirm Dialog — a single generic state object reused for
  // every destructive action, rather than three separate booleans.
  // ============================================================

  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Delete",
    onConfirm: null,
  });

  const openConfirm = ({ title, message, confirmLabel = "Delete", onConfirm }) => {
    setConfirmState({ open: true, title, message, confirmLabel, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmState({ open: false, title: "", message: "", confirmLabel: "Delete", onConfirm: null });
  };

  useEffect(() => {
    loadChat();
  }, []);

  const loadChat = async () => {
    try {
      setLoading(true);

      const friendData = await getFriend();

      setNickname(friendData?.nickname || "");

      setFriend({
        name: friendData?.friend?.name || "Friend",
        image: friendData?.friend?.image || "",
      });

      const history = await getHistory();

      const formatted = (history || []).map((msg) => ({
        id: msg._id,
        sender: msg.sender,
        text: msg.message,
        attachments: msg.attachments || [],
        timestamp: msg.createdAt || new Date().toISOString(),
      }));

      setMessages(formatted);
    } catch (err) {
      console.error(err);

      setLoadError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load chat."
      );
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    const endEl = messagesEndRef.current;
    if (!endEl) return;

    if (!hasScrolledInitially.current) {
      if (messages.length === 0 && !typing) return;

      const container = scrollContainerRef.current;
      const previousBehavior = container ? container.style.scrollBehavior : "";

      if (container) {
        container.style.scrollBehavior = "auto";
      }

      endEl.scrollIntoView({ behavior: "auto", block: "end" });

      if (container) {
        requestAnimationFrame(() => {
          container.style.scrollBehavior = previousBehavior;
        });
      }

      hasScrolledInitially.current = true;
      return;
    }

    endEl.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const wait = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const thinkingDelay = (text = "") =>
    Math.min(700 + text.length * 18, 2000);

  const quickBeatDelay = () =>
    400 + Math.floor(Math.random() * 200);

  const handleSend = async (text, stagedAttachments = []) => {
    if (!text.trim() && stagedAttachments.length === 0) return;

    const optimisticAttachments = stagedAttachments.map((a) => ({
      url: a.previewUrl || (a.file ? URL.createObjectURL(a.file) : ""),
      name: a.name,
      mimetype: a.type,
      size: a.size,
    }));

    const tempUserId = `temp-user-${Date.now()}`;

    const userMessage = {
      id: tempUserId,
      sender: "user",
      text,
      attachments: optimisticAttachments,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTyping(true);

    try {
      const files = stagedAttachments.map((a) => a.file);

      const response = await sendMessageToAI(text, files);

      // Reconcile the optimistic temp ID with the real database
      // ID the backend just created — required so edit/delete
      // work on this message without needing a page reload.
      if (response.userMessageId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempUserId ? { ...m, id: response.userMessageId } : m
          )
        );
      }

      if (response.quotaExceeded) {
        setQuotaNotice(
          "Aura's AI replies hit today's free API limit. Try again later, or set GEMINI_MODEL in backend/.env to a different model."
        );
      }

      const replies = Array.isArray(response.reply)
        ? response.reply
        : [response.reply];

      const aiMessageIds = response.aiMessageIds || [];

      for (let i = 0; i < replies.length; i++) {
        const reply = replies[i];

        const delay = i === 0 ? thinkingDelay(reply) : quickBeatDelay();

        await wait(delay);

        setTyping(false);

        const newId = aiMessageIds[i] || `ai-temp-${Date.now()}-${i}`;

        setMessages((prev) => [
          ...prev,
          {
            id: newId,
            sender: "ai",
            text: reply,
            timestamp: new Date().toISOString(),
          },
        ]);

        if (i < replies.length - 1) {
          setTyping(true);
        }
      }
    } catch (err) {
      console.error(err);

      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          sender: "ai",
          text: "Sorry 😭 Something went wrong. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    setTyping(false);
  };

  const handleFriendImageUpdated = (newImage) => {
    setFriend((prev) => ({
      ...prev,
      image: newImage,
    }));
  };

  // ============================================================
  // Clear Chat
  // ============================================================

  const handleClearChatClick = () => {
    openConfirm({
      title: "Clear this chat?",
      message:
        "This will permanently delete every message in this conversation. This cannot be undone.",
      confirmLabel: "Clear Chat",
      onConfirm: async () => {
        try {
          await clearChatApi();
          setMessages([]);
          hasScrolledInitially.current = false;
        } catch (err) {
          console.error(err);
        } finally {
          closeConfirm();
        }
      },
    });
  };

  // ============================================================
  // New Chat
  // ============================================================
  // Placeholder route — the New Chat page/flow hasn't been built
  // yet. Navigating here now so the icon is functional; swap the
  // path below once that page exists.

  const handleNewChat = () => {
    navigate("/magic-chat");
  };

  // ============================================================
  // Selection Mode
  // ============================================================

  const toggleSelectionMode = () => {
    setSelectionMode((prev) => !prev);
    setSelectedIds(new Set());
  };

  const toggleMessageSelection = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDeleteSelectedClick = () => {
    if (selectedIds.size === 0) return;

    const count = selectedIds.size;

    openConfirm({
      title: "Delete selected messages?",
      message: `This will permanently delete ${count} selected message${
        count > 1 ? "s" : ""
      }.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        try {
          await deleteMessagesApi(Array.from(selectedIds));

          setMessages((prev) => prev.filter((m) => !selectedIds.has(m.id)));

          setSelectedIds(new Set());
          setSelectionMode(false);
        } catch (err) {
          console.error(err);
        } finally {
          closeConfirm();
        }
      },
    });
  };

  // ============================================================
  // Per-Message Edit / Delete (hover actions)
  // ============================================================

  const handleEditMessage = async (id, newText) => {
    const trimmed = newText.trim();
    if (!trimmed) return;

    try {
      await editMessageApi(id, trimmed);

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, text: trimmed } : m))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSingleMessage = (id) => {
    openConfirm({
      title: "Delete this message?",
      message: "This message will be permanently deleted.",
      confirmLabel: "Delete",
      onConfirm: async () => {
        try {
          await deleteMessagesApi([id]);
          setMessages((prev) => prev.filter((m) => m.id !== id));
        } catch (err) {
          console.error(err);
        } finally {
          closeConfirm();
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#090414]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-white/80 text-lg">
            Loading your conversation...
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-screen bg-[#090414] flex items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center">
          <h1 className="text-2xl text-white font-semibold mb-3">
            Couldn't load chat
          </h1>

          <p className="text-white/60">
            {loadError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ChatLayout
        scrollContainerRef={scrollContainerRef}
        header={
          <ChatHeader
            friend={friend}
            nickname={nickname}
            isTyping={typing}
            onAvatarClick={() => setIsProfileOpen(true)}
            onClearChat={handleClearChatClick}
            onNewChat={handleNewChat}
            isSelectionMode={selectionMode}
            onToggleSelectionMode={toggleSelectionMode}
            selectedCount={selectedIds.size}
            onDeleteSelected={handleDeleteSelectedClick}
            onCancelSelection={toggleSelectionMode}
          />
        }
        input={
          <MessageInput
            onSend={handleSend}
          />
        }
      >
        {quotaNotice ? (
          <div className="mx-4 mb-2 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
            {quotaNotice}
          </div>
        ) : null}
        <MessageList
          messages={messages}
          friend={friend}
          typing={typing}
          messagesEndRef={messagesEndRef}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          onToggleSelect={toggleMessageSelection}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteSingleMessage}
        />
      </ChatLayout>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        friend={friend}
        nickname={nickname}
        isTyping={typing}
        onFriendImageUpdated={handleFriendImageUpdated}
      />

      <ConfirmDialog
        isOpen={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        onConfirm={confirmState.onConfirm}
        onCancel={closeConfirm}
      />
    </ErrorBoundary>
  );
}
