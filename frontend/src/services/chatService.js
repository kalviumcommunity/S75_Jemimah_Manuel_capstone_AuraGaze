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

export const sendMessage = async (userMessage) => {

  const response = await axios.post(

    `${backendURL}/api/chat/send`,

    {
      userMessage,
    },

    getHeaders()

  );

  return response.data;

};