import { useContext } from 'react';
import type { UseControllerReturn } from '../types';
import { extractAxesData, extractMetadata } from '../utils';
import { ControllerContext } from '../components/ControllerProvider';

export const useController = (): UseControllerReturn => {
  const context = useContext(ControllerContext);

  if (!context) {
    throw new Error('useController must be used within ControllerProvider');
  }

  const { controller } = context;

  const axes = extractAxesData(controller);
  const metadata = extractMetadata(controller);

  return {
    controller,
    axes,
    metadata,
  };
}; 