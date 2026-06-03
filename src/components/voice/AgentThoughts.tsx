import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, X } from "lucide-react";
import { useVoiceContext } from "../../context/VoiceContext";
import { useAppContext } from "../../context/AppContext";

export const AgentThoughts = () => {
  const { agentThoughts } = useVoiceContext();
  const { discountCode, setDiscountCode, customerName } = useAppContext();
  const hasGreeted = useRef(false);

  // Fix 3: Proactive greeting when dashboard first loads
  useEffect(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;
    // Small delay to let TTS voices load
    const timer = setTimeout(() => {
      if (window.speechSynthesis) {
        const greeting = `Hi ${customerName}! I'm Aura, your personal customer experience assistant. I can track orders, search the web, check the weather, process refunds, and much more — all by voice. Just click the orb or press Space to get started.`;
        const utterance = new SpeechSynthesisUtterance(greeting);
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.name.includes("Samantha") || v.name.includes("Google US English"));
        if (preferred) utterance.voice = preferred;
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [customerName]);

  if (agentThoughts.length === 0 && !discountCode) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-4 space-y-2">
      {/* Agent thought chain */}
      <AnimatePresence>
        {agentThoughts.map((thought) => (
          <motion.div
            key={thought.id}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3"
          >
            <span className="text-xl">{thought.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-sm font-medium">{thought.label}</p>
              {thought.result && (
                <p className="text-white/40 text-xs mt-0.5 truncate">{thought.result}</p>
              )}
            </div>
            <div className="shrink-0">
              {thought.status === "running" ? (
                <Loader2 size={16} className="text-primary animate-spin" />
              ) : (
                <CheckCircle size={16} className="text-green-400" />
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Discount code banner — now dismissible */}
      <AnimatePresence>
        {discountCode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-xl px-5 py-4 relative"
          >
            {/* Dismiss button */}
            <button
              onClick={() => setDiscountCode(null)}
              className="absolute top-3 right-3 text-yellow-400/50 hover:text-yellow-400 transition-colors"
              aria-label="Dismiss discount code"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 pr-6">
              <span className="text-3xl">🎟️</span>
              <div>
                <p className="text-yellow-300 font-bold text-lg tracking-widest">
                  {discountCode.code}
                </p>
                <p className="text-yellow-200/70 text-xs mt-0.5">
                  {discountCode.percentage}% off · {discountCode.reason}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
