import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket } from 'lucide-react';
import { sounds } from '../../lib/sounds';

interface PickerProps {
  names: string[];
  onResult: (name: string) => void;
  isPicking: boolean;
  onStart: () => void;
}

export default function RocketPicker({ names, onResult, isPicking, onStart }: PickerProps) {
  const [launched, setLaunched] = useState(false);

  const handleLaunch = () => {
    if (isPicking || names.length === 0) return;
    onStart();
    setLaunched(true);
    sounds.playSlide(100, 1500, 2.5); // Ignition to orbit sound

    setTimeout(() => {
      const winner = names[Math.floor(Math.random() * names.length)];
      sounds.playWin();
      onResult(winner);
      setLaunched(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center justify-end h-[500px] w-full relative">
      {/* Space Background */}
      <div className="absolute inset-x-0 top-0 bottom-24 bg-slate-900 rounded-[40px] overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1 + Math.random() * 2, repeat: Infinity }}
            className="absolute bg-white rounded-full"
            style={{ 
              width: Math.random() * 2, 
              height: Math.random() * 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}

        {/* The Rocket */}
        <motion.div
          animate={launched ? { 
            y: [-250, -800],
            x: [0, -5, 5, -5, 5, 0],
            scale: [1, 1.2, 0.5]
          } : {
            y: -250,
            x: [0, -2, 2, 0]
          }}
          transition={launched ? { duration: 2.5, ease: "easeIn" } : {
            duration: 2, repeat: Infinity
          }}
          className="absolute left-1/2 bottom-0 -translate-x-1/2 flex flex-col items-center"
        >
          <div className="relative text-7xl">
            🚀
            {launched && (
              <motion.div 
                animate={{ scaleY: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 0.1, repeat: Infinity }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-12 h-16 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent blur-sm rounded-full -z-10"
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Launch Pad */}
      <div className="w-64 h-8 bg-slate-400 rounded-t-xl z-10 border-b-4 border-slate-500 shadow-xl" />
      <div className="w-80 h-16 bg-slate-500 rounded-t-3xl z-0" />

      <button
        onClick={handleLaunch}
        disabled={isPicking || names.length === 0}
        className="mt-8 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
      >
        LAUNCH MISSION
      </button>
    </div>
  );
}
