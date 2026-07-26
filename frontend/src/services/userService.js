import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export const getUserProfile = async () => {

    const token = localStorage.getItem("token");

    const response = await axios.get(

        `${backendURL}/api/onboarding`,

        {

            headers: {

                Authorization: `Bearer ${token}`,

            },

        }

    );

    return response.data;

};

// ======================================
// Get Friend Profile (for Profile Modal)
// ======================================
// Powers the profile modal: friend info, friendship level
// label, friendship start date, and the four stat counters.

export const getFriendProfile = async () => {

    const token = localStorage.getItem("token");

    const response = await axios.get(

        `${backendURL}/api/chat/friend/profile`,

        {

            headers: {

                Authorization: `Bearer ${token}`,

            },

        }

    );

    return response.data;

};

// ======================================
// Update Friend Profile Picture
// ======================================
// Uploads a single image file as multipart/form-data.
// Axios sets the correct multipart Content-Type header
// automatically when passed a FormData instance — do not
// set Content-Type manually here, since that would omit
// the required multipart boundary string.

export const updateFriendImage = async (file) => {

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("image", file);

    const response = await axios.put(

        `${backendURL}/api/chat/friend/image`,

        formData,

        {

            headers: {

                Authorization: `Bearer ${token}`,

            },

        }

    );

    return response.data;

};