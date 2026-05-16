/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GestureState, GESTURE_CONFIG } from '../types';

interface PixelBombProps {
  gesture: GestureState;
  cursorPos: { x: number; y: number };
  onDetonate: () => void;
}

export const PixelBomb: React.FC<PixelBombProps> = ({ gesture, cursorPos, onDetonate }) => {
  const [pos, setPos] = useState({ x: Math.random() * 80 + 10, y: Math.random() * 70 + 15 });
  const [isExploded, setIsExploded] = useState(false);

  useEffect(() => {
    if (isExploded) return;

    const gameLoop = setInterval(() => {
      const curX = cursorPos.x * 100;
      const curY = cursorPos.y * 100;

      const dist = Math.sqrt(Math.pow(pos.x - curX, 2) + Math.pow(pos.y - curY, 2));
      
      // Detonate on touch
      if (dist < GESTURE_CONFIG.HIT_RADIUS) {
        setIsExploded(true);
        onDetonate();
        setTimeout(() => {
          setIsExploded(false);
          setPos({ x: Math.random() * 80 + 10, y: Math.random() * 70 + 15 });
        }, 3000);
      }
    }, 100);

    return () => clearInterval(gameLoop);
  }, [gesture, cursorPos, pos, isExploded, onDetonate]);

  return (
    <motion.div
      className="absolute pointer-events-none select-none z-30"
      animate={{ 
        x: `${pos.x}vw`, 
        y: `${pos.y}vh`,
        scale: isExploded ? [1, 2, 0] : 1,
        rotate: isExploded ? [0, 45, -45, 0] : [0, 5, -5, 0]
      }}
      transition={{ 
        rotate: { repeat: Infinity, duration: 0.5 }
      }}
    >
      <div className="flex flex-col items-center">
        <AnimatePresence>
          {isExploded && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              className="absolute w-12 h-12 bg-red-500 rounded-full blur-lg"
            />
          )}
        </AnimatePresence>
        <div className="text-4xl filter drop-shadow-[2px_4px_0px_rgba(0,0,0,0.2)]">
          💣
        </div>
      </div>
    </motion.div>
  );
};
