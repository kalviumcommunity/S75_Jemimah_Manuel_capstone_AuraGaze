import { useNavigate } from "react-router-dom";
import "../styles/index.css";

import homeBg from "../assets/images/background/home_bg.mp4";
import logo from "../assets/images/background/logo.png";
import title from "../assets/images/background/title.png";

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/loginsignup");
  };

  return (
    <div className="background-container" onClick={handleClick}>
      <video autoPlay loop muted playsInline className="video-background">
        <source src={homeBg} type="video/mp4" />
      </video>

      <div className="logo-container">
        <img
          src={logo}
          alt="Aura Gaze Logo"
          className="logo"
        />

        <img
          src={title}
          alt="Aura Gaze"
          className="title-image"
        />

        <p
          className="tagline"
          style={{
            color: "#C58CFF",
            textShadow:
              "0 0 12px rgba(197,140,255,0.9), 0 0 28px rgba(157,92,255,0.7), 0 0 55px rgba(124,92,252,0.5)",
          }}
        >
          You Don’t Just Chat — You Feel
        </p>
      </div>
    </div>
  );
};

export default Home;