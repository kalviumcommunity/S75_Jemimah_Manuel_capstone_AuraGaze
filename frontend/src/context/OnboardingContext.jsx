import { createContext, useContext, useState } from "react";

// Create Context
const OnboardingContext = createContext();

// Provider Component
export const OnboardingProvider = ({ children }) => {

  const [onboardingData, setOnboardingData] = useState({
    nickname: "",
    friendName: "",
    dob: "",
    gender: "",
    age: "",
    image: "",
  });

  // Update any field
  const updateField = (field, value) => {
    setOnboardingData((prev) => ({
      ...prev,
      [field]: value,
      
    }));
  };

  // Reset after onboarding is complete
  const resetOnboarding = () => {
    setOnboardingData({
      nickname: "",
      friendName: "",
      dob: "",
      gender: "",
      age: "",
      image: "",
    });
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        updateField,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

// Custom Hook
export const useOnboarding = () => {
  return useContext(OnboardingContext);
};