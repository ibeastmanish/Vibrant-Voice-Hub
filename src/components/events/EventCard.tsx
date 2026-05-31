import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Calendar, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import confetti from 'canvas-confetti';

export const EventDiscovery = () => {
  const [eventList, setEventList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated async fetch to a backend / database
    const fetchEvents = async () => {
      setIsLoading(true);
      
      // Simulate network latency (1.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const realEvents = [
        { 
          id: 1, 
          title: 'Neon Beats Festival 2026', 
          date: 'Oct 31, 2026', 
          location: 'Main Arena, Neo City', 
          type: 'Music',
          description: 'The ultimate audiovisual electronic experience.',
          image: 'https://images.unsplash.com/photo-1540039155732-d674d6e3f050?auto=format&fit=crop&q=80&w=800'
        },
        { 
          id: 2, 
          title: 'Agentic Premier League', 
          date: 'Nov 12, 2026', 
          location: 'Cyber Stadium', 
          type: 'Sports',
          description: 'Next-generation elite athletic tournament fixtures.',
          image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800'
        },
        { 
          id: 3, 
          title: 'Synthwave Hackathon', 
          date: 'Dec 05, 2026', 
          location: 'The Grid Hub', 
          type: 'Tech',
          description: 'Major regional tech hackathon for developers.',
          image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800'
        },
        { 
          id: 4, 
          title: 'DeepSpace Blockchain Summit', 
          date: 'Nov 20, 2026', 
          location: 'Orbit Convention Center', 
          type: 'Tech',
          description: 'Global summit on decentralized web3 architecture.',
          image: 'https://images.unsplash.com/photo-1639762681485-074b7f4ec651?auto=format&fit=crop&q=80&w=800'
        },
        { 
          id: 5, 
          title: 'Tokyo Midnight Drift', 
          date: 'Nov 28, 2026', 
          location: 'Tokyo Outer Loop', 
          type: 'Sports',
          description: 'High-speed underground street racing finals.',
          image: 'https://images.unsplash.com/photo-1567156948529-688f8d22df6e?auto=format&fit=crop&q=80&w=800'
        },
        { 
          id: 6, 
          title: 'Holographic Symphony', 
          date: 'Dec 15, 2026', 
          location: 'Grand Neo-Opera House', 
          type: 'Music',
          description: 'A blend of classical strings and holographic projections.',
          image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
        },
        { 
          id: 7, 
          title: 'Global AI Expo', 
          date: 'Dec 02, 2026', 
          location: 'Silicon Valley Mega-plex', 
          type: 'Tech',
          description: 'The premier exposition for autonomous intelligence.',
          image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'
        },
        { 
          id: 8, 
          title: 'Underground Bass Drop', 
          date: 'Nov 05, 2026', 
          location: 'Sector 7 Club', 
          type: 'Music',
          description: 'Heavy bass lines and immersive LED installations.',
          image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'
        },
      ];
      
      setEventList(realEvents);
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 relative min-h-[400px]">
      <h2 className="text-2xl font-bold mb-8 text-white/90">Curated Experiences</h2>
      
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-3xl z-50">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Loader2 size={48} className="text-primary opacity-80" />
          </motion.div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {eventList.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

const EventCard = ({ event }: { event: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { activeBrand } = useAppContext();

  const handleBooking = (e: React.MouseEvent) => {
    e.stopPropagation();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0055', '#00ffaa', '#00f0ff']
    });
  };

  const brandGlow = {
    AntiGravity: 'hover:border-primary/50 shadow-primary/20 hover:shadow-primary/40',
    Lovable: 'hover:border-accent-pink/50 shadow-accent-pink/20 hover:shadow-accent-pink/40',
    Stitch: 'hover:border-accent-green/50 shadow-accent-green/20 hover:shadow-accent-green/40',
  };

  const brandText = {
    AntiGravity: 'text-primary',
    Lovable: 'text-accent-pink',
    Stitch: 'text-accent-green',
  };

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "cursor-pointer glass-panel p-0 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative overflow-hidden group min-h-[260px]",
        brandGlow[activeBrand]
      )}
      whileHover={{ y: -5 }}
    >
      <div className="absolute inset-0 z-0 bg-black/60">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
        <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
      </div>

      <motion.div layout="position" className="relative z-10 p-6 flex flex-col h-full justify-end min-h-[260px]">
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
          <span className={cn("text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-black/50 backdrop-blur-md", brandText[activeBrand])}>
            {event.type}
          </span>
          <ExternalLink size={16} className="text-white/50 group-hover:text-white transition-colors" />
        </div>
        
        <div className="mt-auto">
          <h3 className="text-xl font-bold mb-2 leading-tight">{event.title}</h3>
          <p className="text-sm text-white/70 mb-4 line-clamp-2">{event.description}</p>
          
          <div className="space-y-1 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <Calendar size={12} />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={12} />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 pb-6 relative z-10"
          >
            <div className="pt-4 mt-4 border-t border-white/10">
              <div className="flex flex-col items-center p-4 bg-black/60 backdrop-blur-lg rounded-xl border border-white/5">
                <QrCode size={48} className={cn("mb-2", brandText[activeBrand])} />
                <p className="text-[10px] font-mono text-white/50 tracking-widest">TAP FOR ENTRY TOKEN</p>
              </div>
              <button 
                onClick={handleBooking}
                className={cn(
                  "w-full mt-3 py-3 rounded-lg font-bold text-sm bg-white/10 hover:bg-white/20 transition-colors shadow-lg backdrop-blur-md",
                  brandText[activeBrand]
                )}
              >
                Book Experience
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        "absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-30 pointer-events-none transition-colors duration-500 z-0",
        activeBrand === 'AntiGravity' ? 'bg-primary' : activeBrand === 'Lovable' ? 'bg-accent-pink' : 'bg-accent-green'
      )} />
    </motion.div>
  );
};
