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