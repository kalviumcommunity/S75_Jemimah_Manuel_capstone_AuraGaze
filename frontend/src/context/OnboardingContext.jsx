import { createContext, useContext, useState } from "react";

const OnboardingContext = createContext(null);

const initialOnboardingData = {
  nickname: "",
  friendName: "",
  dob: "",
  gender: "",
  age: "",
  image: "",
};

export const OnboardingProvider = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState({
    ...initialOnboardingData,
  });

  const updateField = (field, value) => {
    setOnboardingData((previousData) => ({
      ...previousData,
      [field]: value,
    }));
  };

  const resetOnboarding = () => {
    setOnboardingData({ ...initialOnboardingData });
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

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error(
      "useOnboarding must be used inside an OnboardingProvider."
    );
  }

  return context;
};