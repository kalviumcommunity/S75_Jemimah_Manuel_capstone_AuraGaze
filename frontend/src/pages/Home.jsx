import { useNavigate } from "react-router-dom";
import "../styles/index.css";

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/loginsignup");
  };

  return (
    <div className="background-container" onClick={handleClick}>
      <video autoPlay loop muted playsInline className="video-background">
        <source src="/183279-870457579_medium.mp4" type="video/mp4" />
      </video>

      <div className="logo-container">
        <img src="/logo.png" alt="Aura Gaze Logo" className="logo" />
        <p className="aura-text">𝘼𝙪𝙧𝙖 𝙂𝙖𝙯𝙚</p>
        <p className="tagline">You Don’t Just Chat — You Feel</p>
      </div>
    </div>
  );
};

export default Home;