/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';

interface AuraHUDProps {
  score: number;
}

export const AuraHUD: React.FC<AuraHUDProps> = ({ score }) => {
  return (
    <div className="z-20 flex flex-col items-center gap-6 pointer-events-none">
      {/* Score Box - Wooden Theme */}
      <div className="bg-[#8B4513] border-4 border-[#5D2906] p-4 pixel-border shadow-[8px_8px_0_0_rgba(0,0,0,0.3)] min-w-[300px]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-sans text-[#FFD700] mb-1 pixel-text-shadow uppercase">
              Farm Master Score
            </span>
            <motion.span 
              key={score}
              initial={{ scale: 1.2, color: '#fff' }}
              animate={{ scale: 1, color: '#FFD700' }}
              className="text-4xl font-sans text-[#FFD700] pixel-text-shadow"
            >
              {score.toLocaleString()}
            </motion.span>
          </div>
          <div className="p-2 bg-yellow-400 pixel-border border-white">
            <Trophy size={32} className="text-yellow-700" />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="bg-white/80 border-2 border-green-600 px-3 py-1 pixel-border flex items-center gap-2">
          <TrendingUp size={14} className="text-green-600" />
          <span className="text-[10px] text-green-700 font-bold uppercase">Catch Pets!</span>
        </div>
        <div className="bg-white/80 border-2 border-red-600 px-3 py-1 pixel-border flex items-center gap-2">
          <TrendingDown size={14} className="text-red-600" />
          <span className="text-[10px] text-red-700 font-bold uppercase">Avoid Bombs!</span>
        </div>
      </div>
    </div>
  );
};
