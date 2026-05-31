import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2 } from 'lucide-react';
import { useVoiceContext } from '../../context/VoiceContext';
import { useAppContext } from '../../context/AppContext';
import { cn } from '../../lib/utils';

export const VoiceOrb = () => {
  const { voiceState, waveformLevels, startListening, stopListening, triggerSimulatedIntent, transcription } = useVoiceContext();
  const { activeBrand } = useAppContext();
  const [inputValue, setInputValue] = useState('');

  const handleOrbClick = () => {
    if (voiceState === 'idle') {
      startListening();
    } else {
      stopListening();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      triggerSimulatedIntent(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto mt-24">
      {/* Floating Orb */}
      <motion.button
        onClick={handleOrbClick}
        animate={{
          scale: voiceState === 'listening' ? 1.1 : 1,
          y: voiceState === 'idle' ? [0, -10, 0] : 0,
        }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          scale: { type: "spring", stiffness: 300, damping: 20 }
        }}
        className={cn(
          "relative w-32 h-32 rounded-full flex items-center justify-center z-20 transition-colors duration-500",
          "bg-black/60 backdrop-blur-xl border-2 shadow-[0_0_40px_rgba(0,0,0,0)] hover:shadow-[0_0_60px_rgba(0,0,0,0.5)]",
          voiceState === 'listening' ? 'border-red-500 shadow-[0_0_80px_rgba(239,68,68,0.4)]' : 'border-[#9b87f5] shadow-[0_0_40px_rgba(155,135,245,0.4)]'
        )}
      >
        {/* Pulsing Border Layers */}
        {voiceState === 'listening' && (
          <>
            <motion.div
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-red-500"
            />
            <motion.div
              animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
              transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-red-500"
            />
          </>
        )}
        
        {voiceState === 'processing' ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <Loader2 size={40} className="text-white/80" />
          </motion.div>
        ) : (
          <Mic size={40} className={cn("transition-colors duration-300", voiceState === 'listening' ? "text-white" : "text-white/50")} />
        )}
      </motion.button>

      {/* Real-time Waveform Visualization */}
      <div className="h-24 mt-12 flex items-center justify-center gap-1 w-full overflow-hidden px-8">
        {waveformLevels.map((level, i) => (
          <motion.div
            key={i}
            animate={{ height: `${level * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "w-2 rounded-full min-h-[4px] transition-colors duration-500",
              activeBrand === 'AntiGravity' ? 'bg-primary' : 
              activeBrand === 'Lovable' ? 'bg-accent-pink' : 'bg-accent-green',
              voiceState === 'idle' ? 'opacity-30' : 'opacity-100'
            )}
          />
        ))}
      </div>

      {/* Transcription & Simulated Input */}
      <div className="mt-8 w-full max-w-md relative z-20">
        <AnimatePresence mode="wait">
          {voiceState === 'listening' ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative"
            >
              <input
                type="text"
                autoFocus
                placeholder="Try: 'Switch to Lovable' or 'Show Events'"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-center text-lg focus:outline-none focus:border-white/30 backdrop-blur-md placeholder:text-white/30 text-white"
              />
              <p className="text-center text-xs text-white/40 mt-3 font-medium tracking-wide uppercase">Press Enter to simulate voice intent</p>
            </motion.div>
          ) : transcription ? (
            <motion.div
              key="transcription"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <p className="text-xl font-medium text-white/90">"{transcription}"</p>
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="text-white/40 font-medium">Click the orb to start listening</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
