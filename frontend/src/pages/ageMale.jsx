import { useNavigate } from "react-router-dom";

export default function AgeMale() {
  const navigate = useNavigate();

  const handleSelect = (ageGroup) => {
    localStorage.setItem("maleAgeGroup", ageGroup);
    
    // Navigate to the corresponding dashboard
    if (ageGroup === "schoolBoy") {
      navigate("/dashboard_sB");
    } else if (ageGroup === "youngMan") {
      navigate("/dashboard_yM");
    } else if (ageGroup === "oldMan") {
      navigate("/dashboard_oM");
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

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-5xl h-auto px-10 py-10 bg-[rgba(255,255,255,0.2)] border border-white 
                      backdrop-blur-md rounded-2xl shadow-xl flex flex-col items-center gap-y-8 text-white">

        {/* Heading */}
        <h1 className="text-3xl font-bold font-[Playfair_Display] text-center">
          What kind of boy do you want as your Best Friend?
        </h1>

        {/* Age Options */}
        <div className="flex justify-center gap-16 w-full flex-wrap">
          
          {/* School Boy */}
          <div 
            onClick={() => handleSelect("schoolBoy")}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img
              src="/boy.png"
              alt="School Boy"
              className="w-44 h-44 object-contain rounded-xl group-hover:scale-105 transition duration-200"
            />
            <span className="mt-3 font-semibold text-lg group-hover:underline">School Boy</span>
          </div>

          {/* Young Man */}
          <div 
            onClick={() => handleSelect("youngMan")}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img
              src="/men.png"
              alt="Young Man"
              className="w-44 h-44 object-contain rounded-xl group-hover:scale-105 transition duration-200"
            />
            <span className="mt-3 font-semibold text-lg group-hover:underline">Young Man</span>
          </div>

          {/* Old Man */}
          <div 
            onClick={() => handleSelect("oldMan")}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img
              src="/oldMen.png"
              alt="Old Man"
              className="w-44 h-44 object-contain rounded-xl group-hover:scale-105 transition duration-200"
            />
            <span className="mt-3 font-semibold text-lg group-hover:underline">Old Man</span>
          </div>

        </div>
      </div>
    </div>
  );
}
