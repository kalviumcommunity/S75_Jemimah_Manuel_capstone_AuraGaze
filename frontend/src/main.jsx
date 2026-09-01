import React from "react";
import ReactDOM from "react-dom/client";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { OnboardingProvider } from "./context/OnboardingContext";

import App from "./App";
import "./styles/index.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <OnboardingProvider>
        <App />
      </OnboardingProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);