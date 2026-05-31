
import { CheckCircle2, CircleDashed } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppContext } from '../../context/AppContext';

export const TicketTimeline = () => {
  const { activeBrand } = useAppContext();

  const timeline = [
    { status: 'completed', title: 'Ticket Purchased', time: 'Oct 15, 14:32' },
    { status: 'completed', title: 'Identity Verified', time: 'Oct 15, 14:35' },
    { status: 'active', title: 'Gate Gate Assingment', time: 'Pending' },
    { status: 'upcoming', title: 'Access Granted', time: 'Oct 31, 18:00' },
  ];



  const brandBg = {
    AntiGravity: 'bg-primary',
    Lovable: 'bg-accent-pink',
    Stitch: 'bg-accent-green',
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 glass-panel p-8">
      <h2 className="text-2xl font-bold mb-8 text-white/90">Live Ticket Track</h2>
      
      <div className="relative border-l-2 border-white/10 ml-4 space-y-8">
        {timeline.map((item, i) => (
          <div key={i} className="relative pl-8">
            {/* Timeline Node */}
            <div className="absolute -left-[11px] top-0 bg-background rounded-full p-1">
              {item.status === 'completed' ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-accent-green rounded-full blur-[8px] opacity-60" />
                  <CheckCircle2 size={16} className="text-accent-green relative z-10" />
                </div>
              ) : item.status === 'active' ? (
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-yellow-500 rounded-full blur-[10px] opacity-80 animate-pulse-fast" />
                  <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-black relative z-10" />
                </div>
              ) : (
                <CircleDashed size={16} className="text-white/30" />
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <h3 className={cn(
                "font-semibold text-lg",
                item.status === 'active' ? "text-white" : item.status === 'completed' ? "text-white/80" : "text-white/40"
              )}>
                {item.title}
              </h3>
              <span className="text-sm text-white/40 font-mono mt-1">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-4 bg-white/5 rounded-xl border border-white/10 flex items-start gap-4">
        <div className={cn("w-1 flex-shrink-0 self-stretch rounded-full", brandBg[activeBrand])} />
        <p className="text-sm text-white/60">
          Your digital access pass will automatically activate when you are within 500 meters of the venue. Ensure Bluetooth is enabled.
        </p>
      </div>
    </div>
  );
};
