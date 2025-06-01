import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Wake up backend on mount
  useEffect(() => {
    axios.get("https://ss-aura-gaze-1528.onrender.com/")
      .then(() => console.log("Backend is awake"))
      .catch((err) => console.log("Backend wakeup failed", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://ss-aura-gaze-1528.onrender.com/auth/login",
        formData
      );

      localStorage.setItem("username", response.data.username);
      navigate("/name");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/183279-870457579_medium.mp4" type="video/mp4" />
      </video>

      {/* Login Box */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      w-80 h-auto flex flex-col items-center justify-center gap-y-4 px-6 py-4 text-white 
                      bg-[rgba(255,255,255,0.2)] border border-white backdrop-blur-md 
                      rounded-xl shadow-lg z-10"
      >
        <h1 className="text-2xl font-bold font-[Playfair_Display]">LOGIN</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-transparent border-b border-white text-white outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-transparent border-b border-white text-white outline-none"
        />

       <button
  onClick={handleSubmit}
  disabled={loading}          // disable button when loading is true
  className="w-full mt-2 py-2 bg-white text-black font-semibold rounded-md hover:bg-gray-300 transition disabled:opacity-50"
>
  Login
</button>


        <p className="text-sm text-white mt-2 cursor-pointer hover:underline">
          Forgot Password?
        </p>
      </div>
    </div>
  );
}
