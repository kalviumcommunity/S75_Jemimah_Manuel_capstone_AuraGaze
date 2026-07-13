import { FiArrowLeft, FiPhone, FiVideo } from "react-icons/fi";

export default function ChatHeader({ friend }) {
  return (
    <div className="w-full h-20 backdrop-blur-xl bg-white/5 border-b border-white/10 flex items-center justify-between px-8">

      {/* Left */}

      <div className="flex items-center gap-5">

        <button className="text-white hover:text-[#C58CFF] transition">
          <FiArrowLeft size={24} />
        </button>

        <img
          src={friend.image}
          alt={friend.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-[#C58CFF]"
        />

        <div>

          <h2
            className="text-white text-xl font-semibold"
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {friend.name}
          </h2>

          <p className="text-green-400 text-sm">

            ● Online

          </p>

        </div>

      </div>

      {/* Right */}

      <div className="flex gap-5">

        <button className="text-white hover:text-[#C58CFF] transition">
          <FiPhone size={22} />
        </button>

        <button className="text-white hover:text-[#C58CFF] transition">
          <FiVideo size={22} />
        </button>

      </div>

    </div>
  );
}