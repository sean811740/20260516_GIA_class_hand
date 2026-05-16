/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum GestureState {
  NONE = 'NONE',
  HOVER = 'HOVER',
  PINCH = 'PINCH',
  OPEN_PALM = 'OPEN_PALM',
  FIST = 'FIST',
  DRAG = 'DRAG'
}

export interface HandPoint {
  x: number;
  y: number;
  z: number;
}

export const GESTURE_CONFIG = {
  PINCH_THRESHOLD: 0.1,
  HIT_RADIUS: 10, // viewport percentage for hit detection
  CURSOR_SMOOTHING: 0.5,
  SPAWN_INTERVAL: 3000,
  MAX_BOMBS: 5,
};
