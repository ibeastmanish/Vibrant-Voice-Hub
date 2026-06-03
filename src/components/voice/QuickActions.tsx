import { motion } from "framer-motion";
import { useVoiceContext } from "../../context/VoiceContext";

interface QuickAction {
  icon: string;
  label: string;
  query: string;
  color: string;
}

const ACTIONS: QuickAction[] = [
  {
    icon: "📦",
    label: "Track Order",
    query: "Where is my recent order? Please track it for me.",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 hover:border-blue-400/60",
  },
  {
    icon: "🌦️",
    label: "Weather",
    query: "What is the current weather in my city? Check Mumbai.",
    color: "from-sky-500/20 to-teal-500/20 border-sky-500/30 hover:border-sky-400/60",
  },
  {
    icon: "💱",
    label: "USD → INR",
    query: "What is the current USD to INR exchange rate?",
    color: "from-green-500/20 to-emerald-500/20 border-green-500/30 hover:border-green-400/60",
  },
  {
    icon: "🔍",
    label: "Search News",
    query: "Search for the latest AI and technology news today.",
    color: "from-purple-500/20 to-violet-500/20 border-purple-500/30 hover:border-purple-400/60",
  },
  {
    icon: "🎟️",
    label: "Get Discount",
    query: "I have been a loyal customer, can I get a discount code?",
    color: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30 hover:border-yellow-400/60",
  },
  {
    icon: "↩️",
    label: "Refund",
    query: "I want to initiate a refund for my last order.",
    color: "from-red-500/20 to-rose-500/20 border-red-500/30 hover:border-red-400/60",
  },
  {
    icon: "📅",
    label: "Set Reminder",
    query: "Set a reminder for me to follow up with customer support tomorrow morning.",
    color: "from-orange-500/20 to-amber-500/20 border-orange-500/30 hover:border-orange-400/60",
  },
  {
    icon: "🏆",
    label: "My Loyalty",
    query: "What is my current loyalty tier and how many points do I have?",
    color: "from-pink-500/20 to-fuchsia-500/20 border-pink-500/30 hover:border-pink-400/60",
  },
];

export const QuickActions = () => {
  const { processIntent, voiceState } = useVoiceContext();
  const isDisabled = voiceState === "listening" || voiceState === "processing";

  return (
    <div className="w-full mt-6">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-xs text-white/30 font-semibold uppercase tracking-widest">Quick Actions</span>
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-[10px] text-white/20">Tap to ask</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {ACTIONS.map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            disabled={isDisabled}
            onClick={() => processIntent(action.query)}
            className={`
              flex flex-col items-center gap-1.5 p-3 rounded-2xl
              border bg-gradient-to-br ${action.color}
              backdrop-blur-xl transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:scale-105 active:scale-95 cursor-pointer
            `}
            aria-label={`Quick action: ${action.label}`}
          >
            <span className="text-2xl leading-none">{action.icon}</span>
            <span className="text-white/70 text-[11px] font-medium text-center leading-tight">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
