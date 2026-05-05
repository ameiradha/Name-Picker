import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { sounds } from '../../lib/sounds';

interface PickerProps {
  names: string[];
  onResult: (name: string) => void;
  isPicking: boolean;
  onStart: () => void;
}

export default function HatPicker({ names, onResult, isPicking, onStart }: PickerProps) {
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDraw = async () => {
    if (isPicking || names.length === 0) return;
    onStart();
    setIsDrawing(true);
    sounds.playPop();

    // Wait for animation
    setTimeout(() => {
      const winner = names[Math.floor(Math.random() * names.length)];
      sounds.playWin();
      onResult(winner);
      setIsDrawing(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* The Hat */}
        <motion.div
          animate={isDrawing ? { 
            rotate: [0, -10, 10, -10, 10, 0],
            y: [0, -5, 5, -5, 5, 0]
          } : {}}
          transition={{ duration: 1.5, repeat: isDrawing ? Infinity : 0 }}
          className="relative z-10"
        >
          <div className="w-48 h-32 bg-slate-900 rounded-t-3xl relative">
            <div className="absolute bottom-4 left-0 w-full h-4 bg-indigo-600" />
          </div>
          <div className="w-64 h-8 bg-slate-900 rounded-full -mt-2 shadow-xl" />
        </motion.div>

        {/* Particles / Sparkles */}
        <AnimatePresence>
          {isDrawing && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 0, x: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    y: -100 - Math.random() * 50,
                    x: (Math.random() - 0.5) * 200,
                    scale: [0, 1.5, 0]
                  }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="absolute text-2xl z-0"
                >
                  ✨
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={handleDraw}
        disabled={isPicking || names.length === 0}
        className="mt-12 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold shadow-xl flex items-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
      >
        <Sparkles className="w-5 h-5 text-indigo-400" />
        DRAW FROM HAT
      </button>
    </div>
  );
}
