import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;

// ======================================
// Authorization Header
// ======================================

const getHeaders = () => {

  const token = localStorage.getItem("token");

  return {

    headers: {

      Authorization: `Bearer ${token}`,

    },

  };

};

// ======================================
// Get Friend Details
// ======================================

export const getFriend = async () => {

  const response = await axios.get(

    `${backendURL}/api/chat/friend`,

    getHeaders()

  );

  return response.data;

};

// ======================================
// Get Chat History
// ======================================

export const getHistory = async () => {

  const response = await axios.get(

    `${backendURL}/api/chat/messages`,

    getHeaders()

  );

  return response.data;

};

// ======================================
// Send User Message to AI
// ======================================

export const sendMessage = async (userMessage, files = []) => {

  const formData = new FormData();
  formData.append("userMessage", userMessage ?? "");

  files.forEach((file) => {
    if (file) formData.append("attachments", file);
  });

  const { headers } = getHeaders();

  const response = await axios.post(

    `${backendURL}/api/chat/send`,

    formData,

    { headers }

  );

  return response.data;

};

// ======================================
// Clear Entire Chat
// ======================================

export const clearChat = async () => {

  const response = await axios.delete(

    `${backendURL}/api/chat/clear`,

    getHeaders()

  );

  return response.data;

};

// ======================================
// Delete Selected Messages
// ======================================
// axios.delete sends a request body via the `data` key inside
// the config object (not as a positional argument like post/put) —
// merged here alongside the existing auth header.

export const deleteMessages = async (messageIds) => {

  const { headers } = getHeaders();

  const response = await axios.delete(

    `${backendURL}/api/chat/messages`,

    {
      headers,
      data: { messageIds },
    }

  );

  return response.data;

};

// ======================================
// Edit a Single Message
// ======================================

export const editMessage = async (id, message) => {

  const response = await axios.put(

    `${backendURL}/api/chat/messages/${id}`,

    { message },

    getHeaders()

  );

  return response.data;

};