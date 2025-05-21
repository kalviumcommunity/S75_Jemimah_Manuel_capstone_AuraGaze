import { useNavigate } from "react-router-dom";

export default function LoginSignup() {
  const navigate = useNavigate();

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

      {/* Buttons */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-20 z-10">
        <button
          onClick={() => navigate("/login")}
          className="px-20 py-8 text-2xl font-[Playfair_Display] text-white 
                     bg-[rgba(255,255,255,0.2)] border border-white backdrop-blur-md 
                     rounded-xl transition duration-300 hover:text-black 
                     hover:bg-[rgba(255,255,255,0.4)] shadow-lg"
        >
          LOGIN
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="px-20 py-8 text-2xl font-[Playfair_Display] text-white 
                     bg-[rgba(255,255,255,0.2)] border border-white backdrop-blur-md 
                     rounded-xl transition duration-300 hover:text-black 
                     hover:bg-[rgba(255,255,255,0.4)] shadow-lg"
        >
          SIGNUP
        </button>
      </div>
    </div>
  );
}
