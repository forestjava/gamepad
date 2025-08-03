import * as React from 'react';
import { createContext, useState, useEffect, useRef } from 'react';
import type { ControllerData, ControllerContextType } from '../types';
import { pollGamepads } from '../utils';

export const ControllerContext = createContext<ControllerContextType | null>(null);

interface ControllerProviderProps {
  children: React.ReactNode;
}

export const ControllerProvider: React.FC<ControllerProviderProps> = ({ children }) => {
  const [controller, setController] = useState<ControllerData | null>(null);
  const animationFrameRef = useRef<number>();

  const pollGamepadsLoop = () => {
    const gamepadData = pollGamepads();
    setController(gamepadData);
    animationFrameRef.current = requestAnimationFrame(pollGamepadsLoop);
  };

  useEffect(() => {
    // Start polling
    animationFrameRef.current = requestAnimationFrame(pollGamepadsLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const value: ControllerContextType = {
    controller,
  };

  return (
    <ControllerContext.Provider value={value}>
      {children}
    </ControllerContext.Provider>
  );
}; 