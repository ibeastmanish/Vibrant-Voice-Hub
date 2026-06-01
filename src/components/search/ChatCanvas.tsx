import { motion } from "framer-motion";
import { MessageSquare, User, Sparkles } from "lucide-react";
import { useVoiceContext } from "../../context/VoiceContext";
import { PromptInputBox } from "../ui/ai-prompt-box";

export const ChatCanvas = () => {
  const { conversationHistory, liveTranscript, processIntent } = useVoiceContext();

  return (
    <div className="flex h-full flex-col max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <MessageSquare size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Conversational Canvas</h2>
          <p className="text-white/50">Contextual Multi-Turn Memory Active</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-4 pb-12 custom-scrollbar">
        {conversationHistory.length === 0 && !liveTranscript && (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <Sparkles size={48} className="text-primary/50 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">How can I help you, Alex?</h3>
            <p className="text-white/50 mb-8 max-w-md">Try asking about your recent orders, policies, or even upload an image for me to analyze.</p>

            <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
              {[
                "Cancel my active MacBook order",
                "Process a refund for my headphones",
                "What is my current loyalty tier?",
                "Analyze this image (attach an image)",
                "Add a reminder to call support tomorrow"
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => processIntent(suggestion)}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 text-sm text-white/80 transition-all shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {conversationHistory.map((msg: { role: string, content: string }, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-primary/20 text-primary'}`}>
                {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
              </div>
              <div className={`rounded-2xl p-5 ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-primary/10 border border-primary/20 text-white'}`}>
                <p className="leading-relaxed">{msg.content}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {liveTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full justify-center"
          >
            <div className="rounded-full bg-white/5 px-6 py-3 border border-white/10 text-white/70 italic text-sm shadow-xl backdrop-blur-md">
              {liveTranscript}
            </div>
          </motion.div>
        )}

        {/* Processing Indicator */}
        {useVoiceContext().voiceState === 'processing' && !liveTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full justify-start"
          >
            <div className="flex gap-4 flex-row">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <div className="rounded-2xl p-5 bg-primary/5 border border-primary/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-4 shrink-0 pb-4">
        <PromptInputBox
          onSend={(message, files) => {
            if (message.startsWith("[Voice message")) return;
            if (files && files.length > 0) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const base64Image = e.target?.result as string;
                processIntent(message, base64Image);
              };
              reader.readAsDataURL(files[0]);
            } else {
              processIntent(message);
            }
          }}
          placeholder="Ask Anti-Gravity anything..."
        />
      </div>
    </div>
  );
};
