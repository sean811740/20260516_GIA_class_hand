/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera as CameraIcon, Cloud, Sprout, Tractor, X } from 'lucide-react';
import { useGestureEngine } from './hooks/useGestureEngine';
import { AuraHUD } from './components/AuraHUD';
import { AuraCursor } from './components/AuraCursor';
import { PixelPet } from './components/PixelPet';
import { PixelBomb } from './components/PixelBomb';
import { GestureState } from './types';

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const { gesture, cursorPos, score, setScore, isReady } = useGestureEngine(videoRef, canvasRef);

  const handleCapture = () => {
    setScore(s => s + 100);
  };

  const handlePenalty = () => {
    setScore(s => Math.max(0, s - 500));
  };

  return (
    <div className="relative w-full h-screen bg-[#87CEEB] text-[#5D2906] font-sans flex flex-col overflow-hidden">
      {/* Farm Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grass Floor */}
        <div className="absolute bottom-0 w-full h-[35%] bg-[#7CFC00] border-t-8 border-[#228B22] shadow-[inset_0_8px_0_rgba(0,0,0,0.1)]" />
        
        {/* Clouds */}
        <motion.div animate={{ x: [0, 100, 0] }} transition={{ repeat: Infinity, duration: 20 }} className="absolute top-20 left-[10%] opacity-40"><Cloud size={100} color="white" /></motion.div>
        <motion.div animate={{ x: [0, -100, 0] }} transition={{ repeat: Infinity, duration: 25 }} className="absolute top-40 right-[15%] opacity-30"><Cloud size={80} color="white" /></motion.div>

        {/* Barn Sketch */}
        <div className="absolute bottom-[35%] right-20 w-48 h-36 bg-[#CD5C5C] border-4 border-[#8B0000] pixel-border">
          <div className="absolute -top-10 -left-1 -right-1 h-0 border-l-[100px] border-l-transparent border-r-[100px] border-r-transparent border-b-[40px] border-b-[#8B0000]" />
        </div>
      </div>

      <header className="h-20 flex items-center justify-between px-8 bg-[#8B4513]/90 border-b-8 border-[#5D2906] z-20 shadow-[0_8px_0_0_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-[#7CFC00] pixel-border border-[#228B22]">
            <Tractor size={24} className="text-[#228B22]" />
          </div>
          <h1 className="text-xl font-sans tracking-tight pixel-text-shadow text-white uppercase">
            PIXEL <span className="text-lime-300">FARMER</span>
          </h1>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Sprout size={20} className={isReady ? 'text-lime-400 animate-bounce' : 'text-slate-400'} />
            <span className="text-xs font-mono uppercase tracking-widest text-white/70">
              {isReady ? 'SENSOR_ACTIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 z-10 overflow-hidden relative flex flex-col items-center pt-8">
        <AuraHUD score={score} />

        {/* Game Objects */}
        {isReady && [...Array(6)].map((_, i) => (
          <PixelPet key={`pet-${i}`} id={i} gesture={gesture} cursorPos={cursorPos} onCapture={handleCapture} />
        ))}
        {isReady && [...Array(3)].map((_, i) => (
          <PixelBomb key={`bomb-${i}`} gesture={gesture} cursorPos={cursorPos} onDetonate={handlePenalty} />
        ))}

        {/* Video Preview in corner */}
        <div className="fixed bottom-8 left-8 w-60 h-44 bg-black/20 pixel-border border-white/50 overflow-hidden shadow-2xl">
          <video ref={videoRef} className="w-full h-full object-cover opacity-80 scale-x-[-1]" playsInline muted />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" width={640} height={480} />
          <div className="absolute top-2 left-2 text-[8px] bg-black/50 text-white p-1 pixel-border">MONITOR</div>
        </div>

        <AuraCursor x={cursorPos.x} y={cursorPos.y} state={gesture} />
      </main>

      <AnimatePresence>
        {showTutorial && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#5D2906]/80 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-[#8B4513] border-8 border-[#5D2906] p-10 relative shadow-[16px_16px_0_0_rgba(0,0,0,0.5)] pixel-border">
              <button 
                onClick={() => setShowTutorial(false)}
                className="absolute top-4 right-4 text-white hover:text-red-400"
              >
                <X size={32} />
              </button>
              <div className="text-center mb-8">
                <div className="bg-yellow-400 w-20 h-20 mx-auto rounded-full pixel-border border-white flex items-center justify-center shadow-lg mb-4">
                  <Sprout size={40} className="text-green-700" />
                </div>
                <h2 className="text-2xl font-sans tracking-tight text-white pixel-text-shadow uppercase">CATCH THE <span className="text-lime-300">ANIMALS</span></h2>
              </div>
              <div className="space-y-6 mb-8 text-white text-[12px] font-mono uppercase bg-[#5D2906]/50 p-4 pixel-border">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">🤏</span>
                  <p>PINCH Index & Thumb to CATCH pets!</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-3xl">💣</span>
                  <p className="text-red-300">AVOID THE BOMBS or lose points!</p>
                </div>
              </div>
              <button onClick={() => setShowTutorial(false)} className="w-full py-4 bg-[#7CFC00] text-[#228B22] font-sans text-xl pixel-border border-[#228B22] hover:bg-white transition-all shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] active:translate-y-2 active:shadow-none uppercase">
                Ready to Farm
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
