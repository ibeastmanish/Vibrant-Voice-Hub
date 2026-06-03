import { motion } from "framer-motion";
import { User, Mic, MessageSquare, Star, Newspaper, ShieldCheck, Clock } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { useVoiceContext } from "../../context/VoiceContext";

export const ProfileScreen = () => {
  const { customerName, selectedInterests, activeOrder } = useAppContext();
  const { conversationHistory, userSentiment } = useVoiceContext();

  const voiceCount = conversationHistory.filter(m => m.role === "user").length;
  const sentimentColor = userSentiment === "Positive" ? "text-green-400" : userSentiment === "Frustrated" ? "text-red-400" : "text-blue-400";
  const sentimentBg = userSentiment === "Positive" ? "bg-green-500/10 border-green-500/20" : userSentiment === "Frustrated" ? "bg-red-500/10 border-red-500/20" : "bg-blue-500/10 border-blue-500/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold text-white mb-1">Your Profile</h2>
        <p className="text-white/50">Your personalised CX profile with Vyntra.</p>
      </div>

      {/* Identity Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(155,135,245,0.2)] shrink-0">
          <User size={36} className="text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{customerName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <ShieldCheck size={16} className="text-yellow-400" />
            <span className="text-yellow-400 font-semibold text-sm">VIP Tier</span>
          </div>
          <p className="text-white/40 text-sm mt-1">Lifetime Value: $4,250 · Loyalty Points: 12,500</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: <Mic size={20} />, label: "Voice Queries", value: voiceCount, color: "text-purple-400", bg: "bg-purple-500/10" },
          { icon: <MessageSquare size={20} />, label: "Chat Messages", value: conversationHistory.length, color: "text-blue-400", bg: "bg-blue-500/10" },
          { icon: <Star size={20} />, label: "Session Score", value: "98%", color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { icon: <Newspaper size={20} />, label: "Interests", value: selectedInterests.length || "—", color: "text-green-400", bg: "bg-green-500/10" },
          { icon: <Clock size={20} />, label: "Active Order", value: activeOrder ? "1 Active" : "None", color: "text-orange-400", bg: "bg-orange-500/10" },
          { icon: <ShieldCheck size={20} />, label: "Tier", value: "VIP", color: "text-pink-400", bg: "bg-pink-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex items-center gap-3">
            <div className={`p-2 rounded-xl ${stat.bg}`}>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <div>
              <p className="text-white/50 text-xs">{stat.label}</p>
              <p className="text-white font-bold text-lg">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sentiment + Interests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`border rounded-2xl p-5 backdrop-blur-xl ${sentimentBg}`}>
          <p className="text-white/50 text-sm mb-1">Current Sentiment</p>
          <p className={`text-2xl font-bold ${sentimentColor}`}>{userSentiment}</p>
          <p className="text-white/40 text-xs mt-1">Updated in real-time by Aura's voice AI</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
          <p className="text-white/50 text-sm mb-3">Your Interests</p>
          {selectedInterests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map(i => (
                <span key={i} className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/30">
                  {i}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-sm">No interests selected yet.</p>
          )}
        </div>
      </div>

      {/* Voice History */}
      {conversationHistory.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Voice History</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
            {conversationHistory.filter(m => m.role === "user").map((msg, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Mic size={12} className="text-primary" />
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{msg.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
