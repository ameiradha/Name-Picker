import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../../lib/sounds';

interface PickerProps {
  names: string[];
  onResult: (name: string) => void;
  isPicking: boolean;
  onStart: () => void;
}

export default function SlotMachinePicker({ names, onResult, isPicking, onStart }: PickerProps) {
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (spinning) {
      interval = setInterval(() => {
        sounds.playTick();
      }, 100);
    }
    return () => clearInterval(interval);
  }, [spinning]);

  const handlePull = () => {
    if (isPicking || names.length === 0) return;
    onStart();
    setSpinning(true);
    sounds.playPop();

    setTimeout(() => {
      const winner = names[Math.floor(Math.random() * names.length)];
      sounds.playWin();
      onResult(winner);
      setSpinning(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative bg-slate-100 p-8 rounded-[40px] border-8 border-slate-900 shadow-2xl flex items-center gap-4">
        {/* Lights */}
        <div className="absolute -left-3 top-10 flex flex-col gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${spinning ? 'animate-pulse bg-yellow-400 shadow-[0_0_10px_yellow]' : 'bg-slate-300'}`} />
          ))}
        </div>
        <div className="absolute -right-3 top-10 flex flex-col gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${spinning ? 'animate-pulse bg-yellow-400 shadow-[0_0_10px_yellow]' : 'bg-slate-300'}`} />
          ))}
        </div>

        {/* Reels */}
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-24 h-48 bg-white border-2 border-slate-200 rounded-2xl overflow-hidden relative shadow-inner">
            <motion.div
              animate={spinning ? {
                y: [-1000, 0]
              } : {}}
              transition={{
                duration: 0.5 + i * 0.2,
                repeat: spinning ? Infinity : 0,
                ease: "linear"
              }}
              className="flex flex-col items-center"
            >
              {[...Array(10)].map((_, idx) => (
                <div key={idx} className="h-48 w-full flex items-center justify-center text-4xl">
                  {['🍒', '🍋', '🔔', '💎', '7️⃣', '🍀', '🍎', '🍇', '🎰', '⭐'][idx]}
                </div>
              ))}
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-200/50 via-transparent to-slate-200/50 pointer-events-none" />
          </div>
        ))}

        {/* Lever */}
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 group cursor-pointer" onClick={handlePull}>
          <div className="w-4 h-32 bg-slate-800 rounded-full" />
          <motion.div 
            animate={spinning ? { y: 60 } : { y: 0 }}
            className="absolute -top-4 -left-4 w-12 h-12 bg-red-600 rounded-full shadow-lg border-4 border-red-700" 
          />
        </div>
      </div>

      <button
        onClick={handlePull}
        disabled={isPicking || names.length === 0}
        className="mt-12 bg-red-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50"
      >
        PULL THE LEVER
      </button>
    </div>
  );
}
