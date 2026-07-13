import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

// Home
import Home from "./pages/Home";
import LoginSignup from "./pages/loginsignup";
import Login from "./pages/login";
import Signup from "./pages/signup";

// Onboarding
import Nickname from "./pages/onboarding/Nickname";
import FriendName from "./pages/onboarding/FriendName";
import DOB from "./pages/onboarding/DOB";
import Gender from "./pages/onboarding/Gender";
import Age from "./pages/onboarding/Age";
import FriendSelection from "./pages/onboarding/FriendSelection";
import CreatingFriend from "./pages/onboarding/CreatingFriend";

// Chat
import Chat from "./pages/Chat";

function App() {
  return (
    <Router>
      <Routes>

        {/* Authentication */}

        <Route path="/" element={<Home />} />

        <Route path="/loginsignup" element={<LoginSignup />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />



        {/* Onboarding */}

        <Route path="/nickname" element={<Nickname />} />

        <Route path="/friend-name" element={<FriendName />} />

        <Route path="/dob" element={<DOB />} />

        <Route path="/gender" element={<Gender />} />

        <Route path="/age" element={<Age />} />

        <Route path="/friend-selection" element={<FriendSelection />} />

        <Route path="/creating-friend" element={<CreatingFriend />} />

        <Route path="/chat" element={<Chat />} />

      </Routes>
    </Router>
  );
}

export default App;