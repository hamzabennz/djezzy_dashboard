import React, { createContext, useContext, useState, useEffect } from 'react';

interface UIContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <UIContext.Provider value={{
      isMobile,
      isTablet,
      isDarkMode,
      toggleDarkMode
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};