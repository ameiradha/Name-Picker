import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../../lib/sounds';

interface PickerProps {
  names: string[];
  onResult: (name: string) => void;
  isPicking: boolean;
  onStart: () => void;
}

export default function ClawPicker({ names, onResult, isPicking, onStart }: PickerProps) {
  const [stage, setStage] = useState<'idle' | 'moving' | 'grabbing' | 'returning'>('idle');

  const handleStart = () => {
    if (isPicking || names.length === 0) return;
    onStart();
    setStage('moving');
    sounds.playSlide(400, 500, 1);

    // Animation sequence
    setTimeout(() => {
      setStage('grabbing');
      sounds.playPop();
    }, 1000);
    
    setTimeout(() => {
      setStage('returning');
      sounds.playSlide(500, 400, 1);
    }, 2000);

    setTimeout(() => {
      const winner = names[Math.floor(Math.random() * names.length)];
      sounds.playWin();
      onResult(winner);
      setStage('idle');
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg h-full max-h-[500px]">
      <div className="bg-indigo-900 w-full h-full rounded-[40px] border-8 border-slate-900 relative overflow-hidden p-8 flex flex-col">
        {/* Top Rail */}
        <div className="h-4 bg-slate-800 rounded-full relative w-full mb-auto overflow-hidden">
          <motion.div 
            animate={stage === 'moving' ? { x: [0, 200, 100] } : stage === 'returning' ? { x: 0 } : {}}
            className="w-12 h-6 bg-slate-400 absolute -top-1 left-0 rounded-lg shadow-md z-20 flex flex-col items-center"
          >
            {/* The Cable */}
            <motion.div 
              animate={stage === 'grabbing' ? { height: 260 } : stage === 'returning' ? { height: 260 } : { height: 40 }}
              className="w-1 bg-slate-300 origin-top mt-6"
            >
              {/* The Claw */}
              <div className="w-16 h-16 -ml-[30px] mt-[100%] relative">
                <motion.div 
                  animate={stage === 'grabbing' ? { rotateZ: -30 } : { rotateZ: 0 }}
                  className="absolute left-0 w-8 h-8 border-t-4 border-l-4 border-slate-300 rounded-tl-xl" 
                />
                <motion.div 
                  animate={stage === 'grabbing' ? { rotateZ: 30 } : { rotateZ: 0 }}
                  className="absolute right-0 w-8 h-8 border-t-4 border-r-4 border-slate-300 rounded-tr-xl" 
                />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-400 rounded-full" />
                
                {/* Grabbed Item */}
                <AnimatePresence>
                  {stage === 'returning' && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-8 left-1/2 -translate-x-1/2 text-4xl"
                    >
                      🎁
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* The Prizes (Toys) */}
        <div className="flex justify-around items-end gap-x-2 pb-4">
          {['🧸', '🦖', '⚽', '🚗', '🦄', '🎮'].map((toy, i) => (
            <motion.div 
              key={i}
              initial={{ y: 0 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
              className="text-4xl"
            >
              {toy}
            </motion.div>
          ))}
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={isPicking || names.length === 0}
        className="mt-8 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
      >
        PULL THE CLAW
      </button>
    </div>
  );
}
