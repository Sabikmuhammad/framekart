import { useState, useEffect, useRef } from 'react';

export function useKeyboardVisible() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (window.visualViewport) {
        // Compare visual viewport height to the window inner height
        // A significant difference (e.g., > 150px) usually means the keyboard is open
        const isVisible = window.visualViewport.height < window.innerHeight - 150;
        
        if (isVisible) {
          // Hide immediately when keyboard opens
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setIsKeyboardVisible(true);
        } else {
          // Delay showing when keyboard closes to prevent flicker
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setIsKeyboardVisible(false);
          }, 150);
        }
      } else {
        // Fallback for older browsers
        const isVisible = window.innerHeight < window.screen.height - 150;
        if (isVisible) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setIsKeyboardVisible(true);
        } else {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setIsKeyboardVisible(false);
          }, 150);
        }
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
    }

    handleResize();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return isKeyboardVisible;
}
