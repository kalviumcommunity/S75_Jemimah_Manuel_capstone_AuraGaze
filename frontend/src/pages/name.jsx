import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL; 

export default function NamePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setError("Username not found! Please login again.");
    }
  }, []);

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Type a name for your Best Friend!");
      return;
    }

    if (!username) {
      setError("Username is missing. Please login again.");
      return;
    }

    try {
      console.log("Submitting name:", name, "for user:", username);

      await axios.post(`${backendURL}/auth/bestFriendName`, {
        name,
        username,
      });

      navigate("/gender");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/183279-870457579_medium.mp4" type="video/mp4" />
      </video>

      <form
        onSubmit={handleSubmit}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   w-80 flex flex-col items-center gap-y-4 px-7 py-7 text-white 
                   bg-[rgba(255,255,255,0.2)] border border-white backdrop-blur-md 
                   rounded-xl shadow-lg z-10"
      >
        <h1 className="text-2xl font-bold font-[Playfair_Display] text-center">
          Give a name for your best friend
        </h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-transparent border-b border-white text-white outline-none text-center"
        />

        <button
          type="submit"
          className="w-full mt-2 py-2 bg-white text-black font-semibold rounded-md hover:bg-gray-300 transition"
        >
          Create your best friend
        </button>
      </form>
    </div>
  );
}
