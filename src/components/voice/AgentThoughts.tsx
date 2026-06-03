import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { useVoiceContext } from "../../context/VoiceContext";
import { useAppContext } from "../../context/AppContext";

export const AgentThoughts = () => {
  const { agentThoughts } = useVoiceContext();
  const { discountCode } = useAppContext();

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

      {/* Discount code banner */}
      <AnimatePresence>
        {discountCode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-xl px-5 py-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-yellow-300 font-bold text-lg tracking-widest">
                  {discountCode.code}
                </p>
                <p className="text-yellow-200/70 text-xs mt-0.5">
                  {discountCode.percentage}% off · {discountCode.reason}
                </p>
              </div>
              <span className="text-3xl">🎟️</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
