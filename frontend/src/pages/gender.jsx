import { useNavigate } from "react-router-dom";

export default function GenderSelection() {
  const navigate = useNavigate();

  const handleSelect = (gender) => {
    localStorage.setItem("bestFriendGender", gender);
    // Navigate to the appropriate page based on gender
    if (gender === "male") {
      navigate("/ageMale");
    } else if (gender === "female") {
      navigate("/ageFemale");
    }
  };

  return (
    <div className="w-screen h-screen relative">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/183279-870457579_medium.mp4" type="video/mp4" />
      </video>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl h-auto px-10 py-10 bg-[rgba(255,255,255,0.2)] border border-white 
                      backdrop-blur-md rounded-2xl shadow-xl flex flex-col items-center gap-y-8 text-white">

        {/* Heading */}
        <h1 className="text-3xl font-bold font-[Playfair_Display] text-center">
          Who do you want as your Best Friend?
        </h1>

        {/* Gender Options */}
        <div className="flex justify-center gap-16 w-full">
          
          {/* Male */}
          <div 
            onClick={() => handleSelect("male")}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img
              src="/men.png"
              alt="Male"
              className="w-52 h-52 object-contain rounded-xl group-hover:scale-105 transition duration-200"
            />
            <span className="mt-3 text-white-200 font-semibold text-lg group-hover:underline">Male</span>
          </div>

          {/* Female */}
          <div 
            onClick={() => handleSelect("female")}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img
              src="/women.png"
              alt="Female"
              className="w-52 h-52 object-contain rounded-xl group-hover:scale-105 transition duration-200"
            />
            <span className="mt-3 text-white-200 font-semibold text-lg group-hover:underline">Female</span>
          </div>

        </div>
      </div>
    </div>
  );
}
