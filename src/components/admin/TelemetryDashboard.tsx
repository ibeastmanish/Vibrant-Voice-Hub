import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Zap, Cpu } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAppContext } from "../../context/AppContext";
import { useVoiceContext } from "../../context/VoiceContext";

export const TelemetryDashboard = () => {
  const { activeBrand } = useAppContext();
  const { auditLogs } = useVoiceContext();
  const [latency, setLatency] = useState(320);
  const [accuracy, setAccuracy] = useState(98.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency((prev) =>
        Math.max(280, Math.min(400, prev + (Math.random() * 40 - 20))),
      );
      setAccuracy((prev) =>
        Math.max(93.5, Math.min(99.9, prev + (Math.random() * 1 - 0.5))),
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const brandColors = {
    Vyntra: "text-primary border-primary/30",
    Lovable: "text-accent-pink border-accent-pink/30",
    Stitch: "text-accent-green border-accent-green/30",
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white/90">
          Admin Insights Node
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-mono font-bold tracking-wider">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          LIVE TELEMETRY
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Telemetry Block 1 */}
        <div className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <span className="text-sm font-mono text-white/50">
              Processing Latency
            </span>
            <Zap
              size={18}
              className={cn("", brandColors[activeBrand].split(" ")[0])}
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono tracking-tighter">
              {Math.round(latency)}
            </span>
            <span className="text-sm text-white/40">ms</span>
          </div>
          <div className="w-full h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
            <motion.div
              className={cn(
                "h-full",
                latency > 350 ? "bg-red-500" : "bg-accent-green",
              )}
              animate={{ width: `${(latency / 500) * 100}%` }}
              transition={{ type: "spring" }}
            />
          </div>
        </div>

        {/* Telemetry Block 2 */}
        <div className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <span className="text-sm font-mono text-white/50">
              Intent Accuracy
            </span>
            <Activity
              size={18}
              className={cn("", brandColors[activeBrand].split(" ")[0])}
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono tracking-tighter">
              {accuracy.toFixed(1)}
            </span>
            <span className="text-sm text-white/40">%</span>
          </div>
          <div className="w-full h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: `${accuracy}%` }}
              transition={{ type: "spring" }}
            />
          </div>
        </div>

        {/* Telemetry Block 3 */}
        <div className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <span className="text-sm font-mono text-white/50">
              Active System Nodes
            </span>
            <Cpu size={18} className="text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono tracking-tighter">
              1,024
            </span>
            <span className="text-sm text-white/40">online</span>
          </div>
          <div className="mt-4 flex gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 h-1 bg-blue-500 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1 + Math.random(), repeat: Infinity }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Live Audit Terminal Section */}
      <div className="glass-panel p-6 h-96 relative flex flex-col mt-6">
        <h3 className="text-sm font-mono text-white/50 mb-4 flex items-center justify-between">
          <span>Agentic Audit Terminal (Firestore Log Simulator)</span>
          <span className="flex items-center gap-2 px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md text-[10px] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Connected
          </span>
        </h3>
        <div className="flex-1 overflow-y-auto font-mono text-xs text-green-400 custom-scrollbar bg-black/50 p-4 rounded-lg border border-white/5">
          {auditLogs.length === 0 ? (
            <div className="text-white/30 italic mt-2">&gt; Waiting for agent trajectory logs...</div>
          ) : (
            auditLogs.map((log, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="mb-6 pb-6 border-b border-white/5 last:border-0"
              >
                <div className="text-white/50 mb-2">&gt; Received Trajectory Payload [{new Date().toLocaleTimeString()}]</div>
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify(log, null, 2)}
                </pre>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
