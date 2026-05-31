import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, RefreshCw, ShoppingBag, Gift } from "lucide-react";
import { useVoiceContext } from "../../context/VoiceContext";

export const FloatingMascot = () => {
  const { voiceState } = useVoiceContext();
  const [isHovered, setIsHovered] = useState(false);

  const fallbacks = [
    { icon: <ShoppingBag size={16} />, label: "Track Active Order" },
    { icon: <Gift size={16} />, label: "Check Loyalty Credits" },
    { icon: <RefreshCw size={16} />, label: "Refresh Sync" },
  ];

  return (
    <div className="absolute bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {voiceState === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="flex flex-col items-end gap-3"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl max-w-xs text-right">
              <p className="text-sm font-medium text-white/90">
                Didn't quite catch that—let's try that one again!
              </p>
            </div>

            {/* Horizontal touch carousel */}
            <div className="flex gap-2 mr-2 overflow-x-auto max-w-[300px] pb-2 hide-scrollbar">
              {fallbacks.map((item, i) => (
                <button
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-white/10 rounded-full text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          y: voiceState === "error" ? [-10, 0, -5, 0] : 0, // Gentle bounce on error
        }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-shadow"
      >
        <HelpCircle size={28} />
      </motion.button>

      <AnimatePresence>
        {isHovered && voiceState !== "error" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: -10 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-16 top-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 pointer-events-none whitespace-nowrap"
          >
            <span className="text-sm font-medium">Need some magic?</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
