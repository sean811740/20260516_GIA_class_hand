/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GestureState } from '../types';

interface AuraCursorProps {
  x: number;
  y: number;
  state: GestureState;
}

export const AuraCursor: React.FC<AuraCursorProps> = ({ x, y, state }) => {
  const isPinching = state === GestureState.PINCH;

  return (
    <motion.div
      className="fixed top-0 left-0 z-50 pointer-events-none"
      animate={{ x: `${x * 100}vw`, y: `${y * 100}vh` }}
      transition={{ type: 'spring', damping: 20, stiffness: 500, mass: 0.3 }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        {/* Farm Net Cursor */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <motion.div 
            className="w-full h-full border-4 border-dashed border-[#8B4513] rounded-full"
            animate={{ rotate: 360, scale: isPinching ? 0.8 : 1 }}
            transition={{ rotate: { repeat: Infinity, duration: 10, ease: "linear" } }}
          />
          <motion.div 
            className="absolute inset-2 border-2 border-[#5D2906] rounded-full bg-yellow-400/20"
            animate={{ scale: isPinching ? 0.5 : 1 }}
          />
          <div className="absolute text-2xl">
            {isPinching ? '✋' : '🤏'}
          </div>
        </div>

        {/* State Label */}
        <motion.div 
          className="absolute top-14 whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-[10px] font-sans font-bold text-white uppercase bg-[#5D2906] px-2 py-1 pixel-border border-[#8B4513]">
            {state === GestureState.PINCH ? 'GRAB!' : 'SEARCHING'}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};
