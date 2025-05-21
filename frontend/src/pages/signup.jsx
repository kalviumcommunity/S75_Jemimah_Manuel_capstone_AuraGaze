import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("https://ss-aura-gaze-1528.onrender.com/auth/signup", formData);
      localStorage.setItem("username", response.data.username);
      navigate("/name");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/183279-870457579_medium.mp4" type="video/mp4" />
      </video>

      {/* Signup Box */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 
                      w-80 h-auto flex flex-col items-center justify-center gap-y-4 px-6 py-4 text-white 
                      bg-[rgba(255,255,255,0.2)] border border-white backdrop-blur-md 
                      rounded-xl shadow-lg">
        
        <h1 className="text-3xl font-bold font-[Playfair_Display]">SIGN UP</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-transparent border-b border-white text-white outline-none"
        />
        <input
          type="text"
          name="username"
          placeholder="Create Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-transparent border-b border-white text-white outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-transparent border-b border-white text-white outline-none"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Retype Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-transparent border-b border-white text-white outline-none"
        />

        <button
          onClick={handleSubmit}
          className="w-full mt-2 py-2 bg-white text-black font-semibold rounded-md hover:bg-gray-300 transition"
        >
          Sign Up
        </button>

        <p
          className="text-sm text-white mt-2 cursor-pointer hover:underline"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}
