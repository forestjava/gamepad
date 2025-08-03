export interface ControllerData {
  id: string;
  index: number;
  mapping: string;
  timestamp: number;
  connected: boolean;
  axes: number[];
}

export interface AxesData {
  throttle: number; // Axis 3
  yaw: number;      // Axis 4
  pitch: number;    // Axis 1
  roll: number;     // Axis 0
}

export interface ControllerMetadata {
  id: string;
  mapping: string;
  index: number;
}

export interface UseControllerReturn {
  controller: ControllerData | null;
  axes: AxesData;
  metadata: ControllerMetadata | null;
}

export interface ControllerContextType {
  controller: ControllerData | null;
} 