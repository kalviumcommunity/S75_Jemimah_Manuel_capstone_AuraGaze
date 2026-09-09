import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

// ============================================================
// Home / Auth
// ============================================================

import Home from "./pages/Home";
import LoginSignup from "./pages/LoginSignup";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// ============================================================
// Onboarding
// ============================================================

import Nickname from "./pages/Onboarding/Nickname";
import FriendName from "./pages/Onboarding/FriendName";
import DOB from "./pages/Onboarding/DOB";
import Gender from "./pages/Onboarding/Gender";
import Age from "./pages/Onboarding/Age";
import FriendSelection from "./pages/Onboarding/FriendSelection";
import CreatingFriend from "./pages/Onboarding/CreatingFriend";

// ============================================================
// Chat
// ============================================================

import Chat from "./pages/Chat";

// IMPORTANT:
// MagicChat.jsx is directly inside pages/
import MagicChat from "./pages/MagicChat";

function App() {
  return (
    <Router>
      <Routes>
        {/* ==================================================
            Home / Authentication
        ================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/loginsignup"
          element={<LoginSignup />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* ==================================================
            Onboarding
        ================================================== */}

        <Route
          path="/nickname"
          element={<Nickname />}
        />

        <Route
          path="/friend-name"
          element={<FriendName />}
        />

        <Route
          path="/dob"
          element={<DOB />}
        />

        <Route
          path="/gender"
          element={<Gender />}
        />

        <Route
          path="/age"
          element={<Age />}
        />

        <Route
          path="/friend-selection"
          element={<FriendSelection />}
        />

        <Route
          path="/creating-friend"
          element={<CreatingFriend />}
        />

        {/* ==================================================
            NORMAL CHAT
        ================================================== */}

        <Route
          path="/chat"
          element={<Chat />}
        />

        {/* ==================================================
            MAGIC CHAT
        ================================================== */}

        <Route
          path="/magic-chat"
          element={<MagicChat />}
        />
      </Routes>
    </Router>
  );
}

export default App;