"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Default Profile for empty states
const defaultProfile = {
  isProfileComplete: false,
  age_group: "student", // "student", "working", "minor", etc.
  interests: ["learning", "exploration", "loans"], // e.g., "investment", "crypto"
  activity_log: [], // Array of daily interactions { type, timestamp, action }
  saved_cards: [], // Cards saved from Navigator
  last_actions: []
};

const UserProfileContext = createContext(null);

export function UserProfileProvider({ children }) {
  const [userProfile, setUserProfile] = useState(defaultProfile);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync with Local Storage
  useEffect(() => {
    const stored = localStorage.getItem("et_concierge_user");
    if (stored) {
       try {
         setUserProfile(JSON.parse(stored));
       } catch(e) { /* corrupted JSON */ }
    }
    setIsLoaded(true);
  }, []);

  const updateProfile = (updates) => {
     setUserProfile(prev => {
        const newProfile = { ...prev, ...updates };
        localStorage.setItem("et_concierge_user", JSON.stringify(newProfile));
        return newProfile;
     });
  };

  const addSavedCard = (card) => {
      updateProfile({ saved_cards: [...userProfile.saved_cards, card] });
  };
  
  const logActivity = (type, action) => {
      updateProfile({
        activity_log: [...userProfile.activity_log, { type, action, ts: Date.now() }],
        last_actions: [action, ...userProfile.last_actions].slice(0, 10)
      });
  };

  return (
    <UserProfileContext.Provider value={{
      userProfile, 
      isLoaded, 
      updateProfile, 
      addSavedCard, 
      logActivity
    }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export const useUserProfile = () => useContext(UserProfileContext);
