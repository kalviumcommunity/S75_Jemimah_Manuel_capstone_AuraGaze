import { useNavigate } from "react-router-dom";

export default function AgeMale() {
  const navigate = useNavigate();

  const handleSelect = (ageGroup) => {
    localStorage.setItem("maleAgeGroup", ageGroup);
    
    // Navigate to the corresponding dashboard
    if (ageGroup === "schoolGirl") {
      navigate("/dashboard_sG");
    } else if (ageGroup === "youngWomen") {
      navigate("/dashboard_yW");
    } else if (ageGroup === "oldWomen") {
      navigate("/dashboard_oW");
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
          What kind of girl do you want as your Best Friend?
        </h1>

        {/* Age Options */}
        <div className="flex justify-center gap-16 w-full flex-wrap">
          
          {/* School Girl */}
          <div 
            onClick={() => handleSelect("schoolGirl")}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img
              src="/girl.png"
              alt="School Girl"
              className="w-44 h-44 object-contain rounded-xl group-hover:scale-105 transition duration-200"
            />
            <span className="mt-3 font-semibold text-lg group-hover:underline">School Girl</span>
          </div>

          {/* Young Women */}
          <div 
            onClick={() => handleSelect("youngWomen")}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img
              src="/women.png"
              alt="Young Women"
              className="w-44 h-44 object-contain rounded-xl group-hover:scale-105 transition duration-200"
            />
            <span className="mt-3 font-semibold text-lg group-hover:underline">Young Women</span>
          </div>

          {/* Old women */}
          <div 
            onClick={() => handleSelect("oldWomen")}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img
              src="/oldWomen.png"
              alt="Old Women"
              className="w-44 h-44 object-contain rounded-xl group-hover:scale-105 transition duration-200"
            />
            <span className="mt-3 font-semibold text-lg group-hover:underline">Old Women</span>
          </div>

        </div>
      </div>
    </div>
  );
}
