import type { ControllerData, AxesData } from '../types';

export const pollGamepads = (): ControllerData | null => {
  const gamepadList = navigator.getGamepads();
  const firstGamepad = gamepadList[0];

  if (firstGamepad && firstGamepad.connected) {
    return {
      id: firstGamepad.id,
      index: firstGamepad.index,
      mapping: firstGamepad.mapping,
      timestamp: firstGamepad.timestamp,
      connected: firstGamepad.connected,
      axes: Array.from(firstGamepad.axes),
    };
  }

  return null;
};

export const extractAxesData = (controller: ControllerData | null): AxesData => {
  if (!controller) {
    return {
      throttle: 0,
      yaw: 0,
      pitch: 0,
      roll: 0,
    };
  }

  return {
    throttle: controller.axes[3] ?? 0,
    yaw: controller.axes[4] ?? 0,
    pitch: controller.axes[1] ?? 0,
    roll: controller.axes[0] ?? 0,
  };
};

export const extractMetadata = (controller: ControllerData | null) => {
  if (!controller) {
    return null;
  }

  return {
    id: controller.id,
    mapping: controller.mapping,
    index: controller.index,
  };
}; 