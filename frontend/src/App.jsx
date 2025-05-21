import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
import LoginSignup from "./pages/loginsignup";
import Login from "./pages/login";
import Signup from "./pages/signup";
import NamePage from "./pages/name";
import Gender from "./pages/gender";
import AgeMale from "./pages/ageMale"
import AgeFemale from "./pages/ageFemale";
import Dashboard_oW from "./pages/dashboards/dashboard_oW";
import Dashboard_oM from "./pages/dashboards/dashboard_oM";
import Dashboard_yW from "./pages/dashboards/dashboard_yW";
import Dashboard_yM from "./pages/dashboards/dashboard_yM";
import Dashboard_sG from "./pages/dashboards/dashboard_sG";
import Dashboard_sB from "./pages/dashboards/dashboard_sB";
import Chat from "./pages/chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/loginsignup" element={<LoginSignup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/name" element={<NamePage/>}/>
        <Route path="/gender" element={<Gender/>}/>
        <Route path="/ageMale" element={<AgeMale/>}/>
        <Route path="/ageFemale" element={<AgeFemale/>}/>
        <Route path="/dashboard_oW" element={<Dashboard_oW />}/>
        <Route path="/dashboard_oM" element={<Dashboard_oM />}/>
        <Route path="/dashboard_yW" element={<Dashboard_yW />}/>
        <Route path="/dashboard_yM" element={<Dashboard_yM />}/>
        <Route path="/dashboard_sG" element={<Dashboard_sG />}/>
        <Route path="/dashboard_sB" element={<Dashboard_sB />}/>
        <Route path="/chat" element={<Chat/>}/>
      </Routes>
    </Router>
  );
}

export default App;
