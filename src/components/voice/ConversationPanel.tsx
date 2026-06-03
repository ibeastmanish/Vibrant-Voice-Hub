import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Copy, Check } from "lucide-react";
import { useVoiceContext } from "../../context/VoiceContext";

export const ConversationPanel = () => {
  const { conversationHistory } = useVoiceContext();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = conversationHistory
      .map((m) => `${m.role === "user" ? "You" : "Aura"}: ${m.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (conversationHistory.length === 0) return null;

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-primary/20 border border-primary/40 backdrop-blur-xl text-primary hover:bg-primary/30 transition-all shadow-[0_0_20px_rgba(139,92,246,0.2)]"
        aria-label="Open conversation history"
      >
        <MessageSquare size={18} />
        <span className="text-sm font-semibold">{conversationHistory.filter(m => m.role === "user").length}</span>
      </motion.button>

      {/* Slide-in panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm z-50 flex flex-col bg-[#0f0a1a]/95 border-l border-white/10 backdrop-blur-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
                <div>
                  <h2 className="text-white font-semibold">Conversation</h2>
                  <p className="text-white/30 text-xs mt-0.5">
                    {conversationHistory.filter(m => m.role === "user").length} exchanges this session
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    aria-label="Copy conversation"
                  >
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    aria-label="Close panel"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
                {conversationHistory.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        msg.role === "user"
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      }`}
                    >
                      {msg.role === "user" ? "Y" : "A"}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary/15 text-white/80 border border-primary/20 rounded-tr-sm"
                          : "bg-white/5 text-white/70 border border-white/10 rounded-tl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer hint */}
              <div className="px-5 py-3 border-t border-white/5 shrink-0">
                <p className="text-white/20 text-xs text-center">
                  Session history · not stored after reload
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
