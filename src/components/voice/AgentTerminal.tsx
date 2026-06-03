import { useVoiceContext } from "../../context/VoiceContext";
import { BrainCircuit, Activity } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const AgentTerminal = () => {
    const { auditLogs, userSentiment } = useVoiceContext();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [auditLogs]);

    const getSentimentColor = () => {
        if (userSentiment === 'Frustrated') return 'text-red-400 border-red-500/30';
        if (userSentiment === 'Positive') return 'text-green-400 border-green-500/30';
        return 'text-blue-400 border-blue-500/30';
    };

    return (
        <div className={`w-96 h-[32rem] flex flex-col bg-black/80 backdrop-blur-md rounded-xl border shadow-2xl overflow-hidden font-mono text-xs transition-colors duration-500 z-50 ${getSentimentColor()}`}>
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-inherit">
                <BrainCircuit size={16} className="text-inherit" />
                <span className="text-white/80 font-bold tracking-widest uppercase">Aura.Core_Reasoning</span>
                <div className="ml-auto flex gap-2 items-center">
                    <span className="animate-pulse text-inherit">●</span>
                    <span className="text-white/50">{userSentiment.toUpperCase()}</span>
                </div>
            </div>

            {/* Terminal Body */}
            <div 
                ref={scrollRef}
                className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4 text-green-500/90"
            >
                {auditLogs.length === 0 && (
                    <div className="text-white/40 italic flex flex-col gap-2">
                        <span>[SYSTEM] Aura CRM Copilot Initialized.</span>
                        <span className="animate-pulse">Awaiting neural input stream...</span>
                    </div>
                )}
                
                <AnimatePresence>
                    {auditLogs.map((log, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col gap-1 border-l-2 border-inherit pl-3 pb-3 mb-2 border-b border-b-white/5"
                        >
                            <div className="text-white/60">
                                <span className="text-blue-400">{"> "}</span>
                                ANALYZING INTENT...
                            </div>
                            <div className="text-yellow-200/90 pl-4 font-bold">
                                ↳ {log.agent_trajectory?.detected_intent || 'UNKNOWN'}
                            </div>
                            
                            <div className="text-white/60 mt-1">
                                <span className="text-blue-400">{"> "}</span>
                                SENTIMENT DETECTED:
                            </div>
                            <div className={`pl-4 ${log.agent_trajectory?.user_sentiment === 'Frustrated' ? 'text-red-400 font-bold uppercase' : 'text-green-300'}`}>
                                ↳ {log.agent_trajectory?.user_sentiment || 'Neutral'}
                            </div>

                            {log.reasoning_loop?.thought && (
                                <>
                                    <div className="text-white/60 mt-1">
                                        <span className="text-purple-400">{"> "}</span>
                                        REASONING LOOP:
                                    </div>
                                    <div className="text-purple-300/90 pl-4 break-words whitespace-pre-wrap leading-relaxed">
                                        {log.reasoning_loop.thought}
                                    </div>
                                </>
                            )}

                            {log.reasoning_loop?.tool_execution?.called && (
                                <div className="mt-3 p-3 bg-white/5 rounded border border-inherit">
                                    <div className="text-inherit font-bold flex items-center gap-2">
                                        <Activity size={14} className="animate-pulse" />
                                        TOOL EXECUTED: {log.reasoning_loop.tool_execution.tool_name}
                                    </div>
                                    <div className="text-white/60 mt-2 break-all">
                                        ARGS: {JSON.stringify(log.reasoning_loop.tool_execution.arguments)}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
