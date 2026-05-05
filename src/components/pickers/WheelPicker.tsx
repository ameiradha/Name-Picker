import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'motion/react';
import { sounds } from '../../lib/sounds';

interface PickerProps {
  names: string[];
  onResult: (name: string) => void;
  isPicking: boolean;
  onStart: () => void;
}

export default function WheelPicker({ names, onResult, isPicking, onStart }: PickerProps) {
  const controls = useAnimation();
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<SVGSVGElement>(null);
  const lastTickRef = useRef(-1);

  // Use names.length to track if the class has been reset or changed significantly
  const initialNamesCount = useRef(names.length);
  
  useEffect(() => {
    // Only reset rotation if names length increases (reset session)
    if (names.length > initialNamesCount.current) {
      controls.set({ rotate: 0 });
      setRotation(0);
    }
    initialNamesCount.current = names.length;
  }, [names.length, controls]);

  const colors = [
    '#6366f1', '#818cf8', '#a78bfa', '#c084fc', '#e879f9',
    '#f43f5e', '#fb7185', '#fb923c', '#fbbf24', '#facc15',
    '#a3e635', '#4ade80', '#34d399', '#2dd4bf', '#22d3ee'
  ];

  const handleSpin = async () => {
    if (isPicking || names.length === 0) return;
    onStart();
    sounds.playSlide(200, 800, 0.5);

    const spinDuration = 5; 
    const spins = 10 + Math.random() * 5;
    const newRotation = rotation + spins * 360;
    
    await controls.start({
      rotate: newRotation,
      transition: { duration: spinDuration, ease: [0.15, 0, 0.15, 1] }
    });

    setRotation(newRotation);

    const degPerName = 360 / names.length;
    const finalRotation = newRotation % 360;
    const normalizedRotation = (360 - (finalRotation % 360)) % 360;
    const winningIndex = Math.floor(normalizedRotation / degPerName) % names.length;
    
    sounds.playWin();
    onResult(names[winningIndex]);
  };

  const onUpdate = useCallback((latest: any) => {
    if (!names.length) return;
    const rot = (latest.rotate as number) || 0;
    const degPerName = 360 / names.length;
    const currentTickIndex = Math.floor(rot / degPerName);
    if (currentTickIndex !== lastTickRef.current) {
      sounds.playTick();
      lastTickRef.current = currentTickIndex;
    }
  }, [names.length]);

  // Helper for text formatting - more aggressive scaling to prevent overlap
  const getFontSize = (count: number) => {
    if (count <= 5) return '6';
    if (count <= 10) return '5';
    if (count <= 20) return '4';
    if (count <= 40) return '2.5';
    if (count <= 60) return '1.8';
    if (count <= 100) return '1.2';
    if (count <= 150) return '0.8';
    return '0.6';
  };

  const getColor = (i: number, total: number) => {
    const base = i % colors.length;
    // Special case for last slice to prevent it having same color as the first slice
    if (i === total - 1 && base === 0 && total > 1) {
      return colors[1 % colors.length];
    }
    return colors[base];
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[300px] h-[300px] xs:w-80 xs:h-80 md:w-[500px] md:h-[500px]">
        {/* Pointer shadow effect */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
           <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M20 38L38 4L2 4L20 38Z" fill="#1e293b" />
             <path d="M20 34L34 6L6 6L20 34Z" fill="#ef4444" />
           </svg>
        </div>

        <motion.svg
          ref={wheelRef}
          animate={controls}
          onUpdate={onUpdate}
          viewBox="0 0 100 100"
          className="w-full h-full rounded-full shadow-[0_0_50px_rgba(99,102,241,0.2)]"
        >
          {names.length === 1 ? (
            <>
              <circle cx="50" cy="50" r="50" fill={colors[0]} stroke="white" strokeWidth="1" />
              <text
                x="50"
                y="50"
                fill="white"
                fontSize="12"
                fontWeight="900"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {names[0]}
              </text>
            </>
          ) : (
            names.map((name, i) => {
              const degPerName = 360 / names.length;
              const startAngle = i * degPerName;
              const endAngle = (i + 1) * degPerName;
              
              const midAngle = startAngle + degPerName / 2;
              const normalizedMidAngle = midAngle % 360;
              const shouldFlip = normalizedMidAngle > 90 && normalizedMidAngle < 270;

              // Calculate SVG path for sector
              const x1 = 50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = 50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = 50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = 50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180);
              
              const largeArc = degPerName > 180 ? 1 : 0;
              const d = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;

              return (
                <g key={`slice-${i}`}>
                  <path 
                    d={d} 
                    fill={getColor(i, names.length)} 
                    stroke="white" 
                    strokeWidth={names.length > 50 ? "0.05" : "0.4"} 
                  />
                  
                  {names.length <= 200 && (
                    <g transform={`rotate(${midAngle}, 50, 50)`}>
                      <text
                        x={shouldFlip ? 20 : 80}
                        y="50"
                        transform={shouldFlip ? "rotate(180, 20, 50)" : ""}
                        fill="white"
                        fontSize={getFontSize(names.length)}
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="select-none pointer-events-none"
                        style={{ filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.5))' }}
                      >
                        {name.length > 25 ? name.substring(0, 22) + '...' : name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })
          )}
        </motion.svg>
        
        {/* Outer Ring Decoration */}
        <div className="absolute inset-0 rounded-full border-[12px] border-slate-900/5 pointer-events-none" />
        
        {/* Center hub */}
        <div className="absolute inset-0 m-auto w-14 h-14 bg-white rounded-full shadow-2xl z-10 flex items-center justify-center border-4 border-slate-800">
          <div className="w-4 h-4 bg-slate-800 rounded-full animate-pulse" />
        </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={isPicking || names.length === 0}
        className="mt-8 md:mt-12 group relative inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-5 font-bold text-white transition-all duration-200 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 disabled:opacity-50 active:scale-95"
      >
        <div className="absolute inset-x-0 h-full -bottom-1.5 bg-indigo-800 rounded-2xl group-hover:bottom-0 transition-all z-0" />
        <span className="relative z-10 flex items-center gap-3">
          SPIN THE WHEEL
          <motion.span animate={isPicking ? { rotate: 360 } : {}} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            🎡
          </motion.span>
        </span>
      </button>
    </div>
  );
}
