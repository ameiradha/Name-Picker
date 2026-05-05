import React, { useState, useEffect } from 'react';
import { ClassData, PickerType } from '../types';
import { 
  RotateCw, 
  RotateCcw, 
  Settings, 
  Play, 
  Trophy, 
  Users, 
  LayoutGrid,
  History,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

// Picker Components
import WheelPicker from './pickers/WheelPicker';
import HatPicker from './pickers/HatPicker';
import DuckPicker from './pickers/DuckPicker';
import SlotMachinePicker from './pickers/SlotMachinePicker';
import ClawPicker from './pickers/ClawPicker';
import CardPicker from './pickers/CardPicker';
import RocketPicker from './pickers/RocketPicker';

interface PickerInterfaceProps {
  classData: ClassData;
}

export default function PickerInterface({ classData }: PickerInterfaceProps) {
  const [sessionPool, setSessionPool] = useState<string[]>([...classData.studentNames]);
  const [pickedNames, setPickedNames] = useState<string[]>([]);
  const [currentPicker, setCurrentPicker] = useState<PickerType>('wheel');
  const [isPicking, setIsPicking] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    setSessionPool([...classData.studentNames]);
    setPickedNames([]);
    setWinner(null);
  }, [classData]);

  const resetSession = () => {
    setSessionPool([...classData.studentNames]);
    setPickedNames([]);
    setWinner(null);
  };

  const handlePick = async () => {
    if (sessionPool.length === 0 || isPicking) return;
    
    setIsPicking(true);
    setWinner(null);

    // Individual pickers will handle the actual animation timing
    // but we can provide the logic here
    const randomIndex = Math.floor(Math.random() * sessionPool.length);
    const chosen = sessionPool[randomIndex];

    // Wait for animation (simulated or actual based on picker type)
    // We'll pass the logic down
  };

  const finalizePick = (name: string) => {
    setWinner(name);
    setPickedNames([name, ...pickedNames]);
    
    // Only remove ONE instance of the name from the pool
    setSessionPool(prev => {
      const index = prev.indexOf(name);
      if (index > -1) {
        const newPool = [...prev];
        newPool.splice(index, 1);
        return newPool;
      }
      return prev;
    });
    
    setIsPicking(false);
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#ec4899']
    });
  };

  const pickerTypes: { id: PickerType; label: string; icon: string }[] = [
    { id: 'wheel', label: 'Wheel of Names', icon: '🎡' },
    { id: 'hat', label: 'Magic Hat', icon: '🎩' },
    { id: 'duck', label: 'Hook A Duck', icon: '🦆' },
    { id: 'slots', label: 'Slot Machine', icon: '🎰' },
    { id: 'claw', label: 'Crane Claw', icon: '🏗️' },
    { id: 'card', label: 'Lucky Card', icon: '🃏' },
    { id: 'rocket', label: 'Space Rocket', icon: '🚀' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Top Controls */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-1">
          {pickerTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setCurrentPicker(type.id)}
              disabled={isPicking}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap group ${
                currentPicker === type.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{type.icon}</span>
              <span className="text-sm font-bold">{type.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
            <Users className="w-3.5 h-3.5" />
            {sessionPool.length} Remaining
          </div>
          <button 
            onClick={resetSession}
            disabled={isPicking}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="Reset Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Picking Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          <AnimatePresence mode="wait">
            {winner && !isPicking && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
              >
                <div className="bg-white p-12 rounded-[40px] shadow-2xl border-4 border-indigo-500 flex flex-col items-center text-center max-w-sm">
                  <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full mb-4">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h3 className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mb-2">We have a winner!</h3>
                  <div className="text-5xl font-black text-slate-900 mb-8 break-words w-full px-4">{winner}</div>
                  <button 
                    onClick={() => setWinner(null)}
                    className="pointer-events-auto bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full h-full max-w-4xl max-h-[600px] flex items-center justify-center">
            {/* dynamic picker rendering */}
            {currentPicker === 'wheel' && (
              <WheelPicker 
                names={sessionPool} 
                onResult={finalizePick} 
                isPicking={isPicking}
                onStart={handlePick}
              />
            )}
            {currentPicker === 'hat' && (
              <HatPicker 
                names={sessionPool} 
                onResult={finalizePick} 
                isPicking={isPicking}
                onStart={handlePick}
              />
            )}
            {currentPicker === 'duck' && (
              <DuckPicker 
                names={sessionPool} 
                onResult={finalizePick} 
                isPicking={isPicking}
                onStart={handlePick}
              />
            )}
            {currentPicker === 'slots' && (
              <SlotMachinePicker 
                names={sessionPool} 
                onResult={finalizePick} 
                isPicking={isPicking}
                onStart={handlePick}
              />
            )}
            {currentPicker === 'claw' && (
              <ClawPicker 
                names={sessionPool} 
                onResult={finalizePick} 
                isPicking={isPicking}
                onStart={handlePick}
              />
            )}
            {currentPicker === 'card' && (
              <CardPicker 
                names={sessionPool} 
                onResult={finalizePick} 
                isPicking={isPicking}
                onStart={handlePick}
              />
            )}
            {currentPicker === 'rocket' && (
              <RocketPicker 
                names={sessionPool} 
                onResult={finalizePick} 
                isPicking={isPicking}
                onStart={handlePick}
              />
            )}
          </div>
          
          {sessionPool.length === 0 && pickedNames.length > 0 && !isPicking && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-indigo-600 text-white p-4 rounded-3xl mb-6">
                <Users className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-2">That's everyone!</h2>
              <p className="text-slate-500 mb-8 max-w-xs">You've picked all students in this session. Ready for another round?</p>
              <button 
                onClick={resetSession}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-200"
              >
                Reset Session Pool
              </button>
            </div>
          )}
        </div>

        {/* History Sidebar */}
        <div className="w-full md:w-64 bg-white border-l border-slate-200 flex flex-col p-6 overflow-hidden hidden lg:flex">
          <div className="flex items-center gap-2 mb-6 text-slate-800">
            <History className="w-5 h-5" />
            <h3 className="font-bold">Recent Picks</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pr-1">
            {pickedNames.map((name, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
              >
                <div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-100">
                  #{pickedNames.length - i}
                </div>
                <span className="font-medium text-sm text-slate-700 truncate">{name}</span>
              </motion.div>
            ))}
            {pickedNames.length === 0 && (
              <div className="h-40 flex flex-col items-center justify-center text-slate-300 text-center">
                <Info className="w-8 h-8 mb-2 opacity-10" />
                <p className="text-xs">No picks yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
