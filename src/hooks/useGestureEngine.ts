/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Hands, Results, HAND_CONNECTIONS } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { GestureState, GESTURE_CONFIG } from '../types';

export function useGestureEngine(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const [gesture, setGesture] = useState<GestureState>(GestureState.NONE);
  const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5 });
  const [score, setScore] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  const handsRef = useRef<Hands | null>(null);
  const smoothPosRef = useRef({ x: 0.5, y: 0.5 });

  const calculateDistance = (p1: any, p2: any) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  const onResults = useCallback((results: Results) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#ffffff55', lineWidth: 2 });
      drawLandmarks(canvasCtx, landmarks, { color: '#ffffff', lineWidth: 1, radius: 2 });

      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];

      const pinchDist = calculateDistance(thumbTip, indexTip);
      const isPinching = pinchDist < GESTURE_CONFIG.PINCH_THRESHOLD;

      const currentState = isPinching ? GestureState.PINCH : GestureState.HOVER;

      setGesture(currentState);

      const targetX = indexTip.x;
      const targetY = indexTip.y;
      
      smoothPosRef.current = {
        x: smoothPosRef.current.x * GESTURE_CONFIG.CURSOR_SMOOTHING + targetX * (1 - GESTURE_CONFIG.CURSOR_SMOOTHING),
        y: smoothPosRef.current.y * GESTURE_CONFIG.CURSOR_SMOOTHING + targetY * (1 - GESTURE_CONFIG.CURSOR_SMOOTHING),
      };
      
      setCursorPos({ ...smoothPosRef.current });
    } else {
      setGesture(GestureState.NONE);
    }
    
    canvasCtx.restore();
  }, []);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);
    handsRef.current = hands;

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await hands.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });
      camera.start().then(() => setIsReady(true));
    }

    return () => {
      hands.close();
    };
  }, [videoRef, onResults]);

  return { gesture, cursorPos, score, setScore, isReady };
}
