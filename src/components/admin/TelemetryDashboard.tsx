import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Cpu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppContext } from '../../context/AppContext';

export const TelemetryDashboard = () => {
  const { activeBrand } = useAppContext();
  const [latency, setLatency] = useState(320);
  const [accuracy, setAccuracy] = useState(98.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(280, Math.min(400, prev + (Math.random() * 40 - 20))));
      setAccuracy(prev => Math.max(93.5, Math.min(99.9, prev + (Math.random() * 1 - 0.5))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const brandColors = {
    AntiGravity: 'text-primary border-primary/30',
    Lovable: 'text-accent-pink border-accent-pink/30',
    Stitch: 'text-accent-green border-accent-green/30',
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white/90">Admin Insights Node</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-mono font-bold tracking-wider">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          LIVE TELEMETRY
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Telemetry Block 1 */}
        <div className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <span className="text-sm font-mono text-white/50">Processing Latency</span>
            <Zap size={18} className={cn("", brandColors[activeBrand].split(' ')[0])} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono tracking-tighter">{Math.round(latency)}</span>
            <span className="text-sm text-white/40">ms</span>
          </div>
          <div className="w-full h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
            <motion.div 
              className={cn("h-full", latency > 350 ? "bg-red-500" : "bg-accent-green")}
              animate={{ width: `${(latency / 500) * 100}%` }}
              transition={{ type: 'spring' }}
            />
          </div>
        </div>

        {/* Telemetry Block 2 */}
        <div className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <span className="text-sm font-mono text-white/50">Intent Accuracy</span>
            <Activity size={18} className={cn("", brandColors[activeBrand].split(' ')[0])} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono tracking-tighter">{accuracy.toFixed(1)}</span>
            <span className="text-sm text-white/40">%</span>
          </div>
          <div className="w-full h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              animate={{ width: `${accuracy}%` }}
              transition={{ type: 'spring' }}
            />
          </div>
        </div>

        {/* Telemetry Block 3 */}
        <div className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <span className="text-sm font-mono text-white/50">Active System Nodes</span>
            <Cpu size={18} className="text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono tracking-tighter">1,024</span>
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

      {/* Heatmap Section */}
      <div className="glass-panel p-6 h-64 relative overflow-hidden flex flex-col">
        <h3 className="text-sm font-mono text-white/50 mb-4">Traffic Heatmap (Agentic Premier League)</h3>
        <div className="flex-1 relative flex items-end justify-between px-2 pb-2">
          {Array.from({ length: 40 }).map((_, i) => {
            const height = Math.random() * 60 + 20;
            // Simulated spike for "Agentic Premier League"
            const isSpike = i > 25 && i < 35;
            const finalHeight = isSpike ? height + 40 : height;
            
            return (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${finalHeight}%` }}
                transition={{ duration: 0.5, delay: i * 0.02 }}
                className={cn(
                  "w-[2%] rounded-t-sm transition-colors duration-500",
                  isSpike ? "bg-gradient-to-t from-red-600 to-red-400 shadow-[0_0_15px_rgba(255,0,0,0.5)]" : "bg-white/20"
                )}
              />
            )
          })}
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-2">
           <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(255,0,0,0.8)] animate-pulse" />
           <span className="text-xs text-red-400 font-mono">HIGH VOLUME DETECTED</span>
        </div>
      </div>
    </div>
  );
};
