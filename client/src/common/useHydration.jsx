import { useEffect, useState } from 'react';


export const useHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    // Wait for next tick to ensure Zustand has hydrated
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return isHydrated;
};