
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2 } from 'lucide-react';
import { useVoiceContext } from '../../context/VoiceContext';
import { useAppContext } from '../../context/AppContext';
import { cn } from '../../lib/utils';



export const VoiceOrb = () => {
  const { voiceState, waveformLevels, startListening, stopListening, liveTranscript } = useVoiceContext();
  const { activeBrand } = useAppContext();

  const handleOrbClick = () => {
    if (voiceState === 'idle' || voiceState === 'error') {
      startListening();
    } else {
      stopListening();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto mt-24">
      {/* Floating Orb */}
      <motion.div
        animate={{ 
          y: voiceState === 'idle' ? [0, -15, 0] : 0
        }}
        transition={{ 
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className="z-20"
      >
        <motion.button 
          onClick={handleOrbClick}
          animate={{ 
            scale: voiceState === 'listening' ? 1.1 : 1
          }}
          transition={{ 
            scale: { type: "spring", stiffness: 300, damping: 20 }
          }}
          className={cn(
            "relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer border-none outline-none",
            "shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)]",
            "dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]",
            voiceState === 'listening' 
              ? "ring-2 ring-red-500 shadow-[0_0_80px_rgba(239,68,68,0.4)]" 
              : "ring-1 ring-[#9b87f5]/40 hover:ring-[#9b87f5]"
          )}
          style={{ backdropFilter: 'url("#container-glass")' }}
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
            <Mic 
              size={40} 
              className={cn(
                "transition-colors duration-300",
                voiceState === 'listening' ? "text-white" : "text-white/50"
              )} 
            />
          )}
        </motion.button>
      </motion.div>

      {/* Real-time Waveform Visualization */}
      <div className="h-24 mt-12 flex items-center justify-center gap-1 w-full overflow-hidden px-8">
        {waveformLevels.map((level, i) => (
          <motion.div
            key={i}
            animate={{ height: `${level * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "w-2 rounded-full min-h-[4px] transition-colors duration-500",
              activeBrand === 'Vyntra' ? "bg-primary" :
              activeBrand === 'Lovable' ? "bg-accent-pink" : 
              "bg-accent-green",
              voiceState === 'idle' ? 'opacity-30' : 'opacity-100'
            )}
          />
        ))}
      </div>

      {/* Live Transcription Display */}
      <div className="mt-8 w-full max-w-md relative z-20 min-h-[60px] flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {(voiceState === 'listening' || voiceState === 'processing' || liveTranscript) ? (
            <motion.div
              key="transcription"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-xl font-medium text-white/90">
                {liveTranscript || (voiceState === 'listening' ? "Listening..." : "Processing...")}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-white/40 font-medium">Click the orb to start listening</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
