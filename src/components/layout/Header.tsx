import { Mic, MicOff, Cpu } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { useVoiceContext } from "../../context/VoiceContext";

export const Header = () => {
  const { activeBrand, activeView, isMobileMenuOpen, setIsMobileMenuOpen, customerName } = useAppContext();
  const { voiceState, userSentiment, agentThoughts, currentToolLabel } = useVoiceContext();

  const sentimentEmoji = {
    Positive: "😊",
    Neutral: "😐",
    Frustrated: "😤",
    Unknown: "🎙️",
  }[userSentiment];

  const sentimentColor = {
    Positive: "text-green-400",
    Neutral: "text-blue-400",
    Frustrated: "text-red-400",
    Unknown: "text-white/40",
  }[userSentiment];

  const voiceIcon = voiceState === "listening"
    ? <Mic size={14} className="text-red-400 animate-pulse" />
    : voiceState === "processing"
    ? <Cpu size={14} className="text-primary animate-spin" />
    : <MicOff size={14} className="text-white/30" />;

  const completedTools = agentThoughts.filter(t => t.status === "done").length;

  return (
    <header className="h-16 w-full bg-transparent border-b border-white/5 flex items-center justify-between px-6 z-10 shrink-0">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2 text-white/50 text-sm">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mr-2 md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
          aria-label="Toggle menu"
        >
          <span className="text-white text-lg">☰</span>
        </button>
        <span className="font-medium hover:text-white transition-colors cursor-pointer">{activeBrand}</span>
        <span>/</span>
        <span className="font-medium text-white">{activeView}</span>
      </div>

      {/* Right: live status indicators */}
      <div className="flex items-center gap-4">
        {/* Agent status — shows during processing */}
        {voiceState === "processing" && currentToolLabel && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary">
            <Cpu size={12} className="animate-spin" />
            <span className="max-w-[140px] truncate">{currentToolLabel}</span>
          </div>
        )}

        {/* Tools completed badge */}
        {completedTools > 0 && voiceState === "idle" && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs text-green-400">
            <span>✓</span>
            <span>{completedTools} tool{completedTools > 1 ? "s" : ""} ran</span>
          </div>
        )}

        {/* Sentiment */}
        <div className={`flex items-center gap-1.5 text-xs font-medium ${sentimentColor}`}>
          <span>{sentimentEmoji}</span>
          <span className="hidden sm:inline">{userSentiment}</span>
        </div>

        {/* Voice state indicator */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 text-xs">
          {voiceIcon}
          <span className="text-white/40 hidden sm:inline capitalize">{voiceState}</span>
        </div>

        {/* Customer name */}
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
          {customerName?.charAt(0)?.toUpperCase() || "?"}
        </div>
      </div>
    </header>
  );
};
