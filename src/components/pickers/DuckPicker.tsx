import React, { useState } from 'react';
import { motion } from 'motion/react';
import { sounds } from '../../lib/sounds';

interface PickerProps {
  names: string[];
  onResult: (name: string) => void;
  isPicking: boolean;
  onStart: () => void;
}

export default function DuckPicker({ names, onResult, isPicking, onStart }: PickerProps) {
  const [selectedDuck, setSelectedDuck] = useState<number | null>(null);

  const handleDuckClick = (index: number) => {
    if (isPicking || names.length === 0) return;
    onStart();
    setSelectedDuck(index);
    sounds.playPop();

    setTimeout(() => {
      const winner = names[Math.floor(Math.random() * names.length)];
      sounds.playWin();
      onResult(winner);
      setSelectedDuck(null);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl px-4">
      <div className="bg-blue-100/50 w-full rounded-[40px] p-8 min-h-[300px] border-4 border-blue-200 relative overflow-hidden flex flex-wrap justify-center gap-8 items-center">
        {/* Water ripples */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              className="absolute border-2 border-blue-400 rounded-full"
              style={{ 
                width: 100 + i * 100, 
                height: 50 + i * 50, 
                left: '50%', 
                top: '50%', 
                transform: 'translate(-50%, -50%)' 
              }}
            />
          ))}
        </div>

        {[...Array(6)].map((_, i) => (
          <motion.button
            key={i}
            disabled={isPicking}
            animate={selectedDuck === i ? {
              y: -50,
              rotate: [0, 10, -10, 10, -10, 0],
              scale: 1.2
            } : {
              y: [0, -10, 0],
              x: [0, 5, 0]
            }}
            transition={selectedDuck === i ? { duration: 1.5 } : {
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            onClick={() => handleDuckClick(i)}
            className="relative z-10 text-6xl hover:scale-110 active:scale-95 transition-transform"
          >
            🦆
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-blue-900/10 rounded-full blur-sm" />
          </motion.button>
        ))}
      </div>
      
      <p className="mt-8 text-slate-400 font-medium">Click on a lucky duck to pick a name!</p>
    </div>
  );
}
