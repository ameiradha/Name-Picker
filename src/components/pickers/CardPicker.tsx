import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../../lib/sounds';

interface PickerProps {
  names: string[];
  onResult: (name: string) => void;
  isPicking: boolean;
  onStart: () => void;
}

export default function CardPicker({ names, onResult, isPicking, onStart }: PickerProps) {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    if (isPicking || names.length === 0) return;
    onStart();
    setFlippedIndex(index);
    sounds.playPop();

    setTimeout(() => {
      const winner = names[Math.floor(Math.random() * names.length)];
      sounds.playWin();
      onResult(winner);
      setFlippedIndex(null);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="perspective-1000 w-32 h-44 cursor-pointer" onClick={() => handleCardClick(i)}>
            <motion.div
              animate={flippedIndex === i ? { rotateY: 180 } : { rotateY: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="w-full h-full relative transition-all duration-500 transform-style-3d"
            >
              {/* Front (Back of card) */}
              <div className="absolute inset-0 backface-hidden bg-indigo-600 rounded-xl border-4 border-white shadow-lg flex items-center justify-center p-2">
                <div className="w-full h-full border-2 border-indigo-400 border-dashed rounded-lg flex items-center justify-center">
                  <span className="text-4xl">?</span>
                </div>
              </div>
              
              {/* Back (Front of card) */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-xl border-4 border-indigo-500 shadow-lg flex flex-col items-center justify-center p-4 transform rotate-y-180">
                <div className="text-indigo-600 text-4xl mb-2">⭐</div>
                <div className="font-black text-slate-900">WINNER!</div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
      <p className="mt-12 text-slate-400 font-medium">Pick a card to reveal the winner!</p>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
