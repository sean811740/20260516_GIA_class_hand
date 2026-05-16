/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GestureState, GESTURE_CONFIG } from '../types';

interface PixelPetProps {
  id: number;
  gesture: GestureState;
  cursorPos: { x: number; y: number };
  onCapture: () => void;
}

const PET_TYPES = [
  { emoji: '🐱', name: 'Cat' },
  { emoji: '🐶', name: 'Dog' },
  { emoji: '🐰', name: 'Bunny' },
  { emoji: '🦊', name: 'Fox' },
  { emoji: '🐼', name: 'Panda' },
  { emoji: '🐸', name: 'Frog' },
  { emoji: '🐷', name: 'Pig' },
  { emoji: '🐥', name: 'Chick' },
];

export const PixelPet: React.FC<PixelPetProps> = ({ gesture, cursorPos, onCapture }) => {
  const [pos, setPos] = useState({ x: Math.random() * 80 + 10, y: Math.random() * 70 + 15 });
  const [petIdx] = useState(Math.floor(Math.random() * PET_TYPES.length));
  const [isCaught, setIsCaught] = useState(false);
  const lastMoveRef = useRef(Date.now());

  const pet = PET_TYPES[petIdx];

  useEffect(() => {
    if (isCaught) return;

    const gameLoop = setInterval(() => {
      const curX = cursorPos.x * 100;
      const curY = cursorPos.y * 100;

      // Hit detection
      const dist = Math.sqrt(Math.pow(pos.x - curX, 2) + Math.pow(pos.y - curY, 2));
      
      if (dist < GESTURE_CONFIG.HIT_RADIUS && gesture === GestureState.PINCH) {
        setIsCaught(true);
        onCapture();
        // Respawn after a delay
        setTimeout(() => {
          setIsCaught(false);
          setPos({ x: Math.random() * 80 + 10, y: Math.random() * 70 + 15 });
        }, 1200);
        return;
      }

      // Movement logic: Wander around
      if (Date.now() - lastMoveRef.current > 1500) {
        setPos(p => ({
          x: Math.max(5, Math.min(95, p.x + (Math.random() - 0.5) * 15)),
          y: Math.max(5, Math.min(95, p.y + (Math.random() - 0.5) * 15)),
        }));
        lastMoveRef.current = Date.now();
      }

      // Flee from cursor if close
      if (dist < 20 && !isCaught) {
        const angle = Math.atan2(pos.y - curY, pos.x - curX);
        setPos(p => ({
          x: Math.max(5, Math.min(95, p.x + Math.cos(angle) * 2)),
          y: Math.max(5, Math.min(95, p.y + Math.sin(angle) * 2)),
        }));
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gesture, cursorPos, pos, isCaught, onCapture]);

  return (
    <motion.div
      className="absolute pointer-events-none select-none z-30"
      animate={{ 
        x: `${pos.x}vw`, 
        y: `${pos.y}vh`,
        scale: isCaught ? 0 : 1,
        rotate: isCaught ? 360 : 0,
        opacity: isCaught ? 0 : 1
      }}
      transition={{ 
        type: 'spring', 
        damping: 12, 
        stiffness: 80,
      }}
    >
      <div className="flex flex-col items-center">
        <AnimatePresence>
          {isCaught && (
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -50 }}
              className="absolute text-yellow-600 font-bold text-xl pixel-text-shadow"
            >
              +100
            </motion.div>
          )}
        </AnimatePresence>
        <div className="text-4xl filter drop-shadow-[2px_4px_0px_rgba(0,0,0,0.2)]">
          {pet.emoji}
        </div>
      </div>
    </motion.div>
  );
};
