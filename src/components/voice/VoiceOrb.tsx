
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2 } from 'lucide-react';
import { useVoiceContext } from '../../context/VoiceContext';
import { useAppContext } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import { AgentThoughts } from './AgentThoughts';



export const VoiceOrb = ({ className }: { className?: string }) => {
  const { voiceState, waveformLevels, startListening, stopListening, liveTranscript, userSentiment } = useVoiceContext();
  const { activeBrand } = useAppContext();

  const handleOrbClick = () => {
    if (voiceState === 'idle' || voiceState === 'error') {
      startListening();
    } else {
      stopListening();
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center w-full max-w-2xl mx-auto", className)}>
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
              : userSentiment === 'Frustrated'
              ? "ring-2 ring-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]"
              : userSentiment === 'Positive'
              ? "ring-2 ring-green-500 shadow-[0_0_40px_rgba(34,197,94,0.3)]"
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
      <div className="h-14 mt-4 flex items-center justify-center gap-[3px] w-full overflow-hidden px-12">
        {waveformLevels.map((level, i) => (
          <motion.div
            key={i}
            animate={{ height: `${level * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "w-1.5 rounded-full min-h-[3px] transition-colors duration-500",
              userSentiment === 'Frustrated' ? "bg-red-500" :
              userSentiment === 'Positive' ? "bg-green-500" :
              activeBrand === 'Vyntra' ? "bg-primary" :
              activeBrand === 'Lovable' ? "bg-accent-pink" : 
              "bg-accent-green",
              voiceState === 'idle' ? 'opacity-20' : 'opacity-100'
            )}
          />
        ))}
      </div>

      {/* Live Transcription Display */}
      <div className="mt-3 w-full max-w-md relative z-20 min-h-[36px] flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {(voiceState === 'listening' || voiceState === 'processing' || liveTranscript) ? (
            <motion.div
              key="transcription"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <p className="text-base font-medium text-white/80">
                {liveTranscript || (voiceState === 'listening' ? "Listening…" : "Processing…")}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-white/30 text-sm">Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/50 font-mono text-xs">Space</kbd> or click to speak</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Real-time Agent Tool Execution Panel */}
      <AgentThoughts />
    </div>
  );
};
