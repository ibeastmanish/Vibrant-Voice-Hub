import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { EventCard } from "./EventCard";

export const EventDiscovery = () => {
  const [eventList, setEventList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated async fetch to a backend / database
    const fetchEvents = async () => {
      setIsLoading(true);

      // Simulate network latency (1.5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const realEvents = [
        {
          id: 1,
          title: "Neon Beats Festival 2026",
          date: "Oct 31, 2026",
          location: "Main Arena, Neo City",
          type: "Music",
          description: "The ultimate audiovisual electronic experience.",
          image:
            "https://images.unsplash.com/photo-1540039155732-d674d6e3f050?auto=format&fit=crop&q=80&w=800",
        },
        {
          id: 2,
          title: "Agentic Premier League",
          date: "Nov 12, 2026",
          location: "Cyber Stadium",
          type: "Sports",
          description: "Next-generation elite athletic tournament fixtures.",
          image:
            "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800",
        },
        {
          id: 3,
          title: "Synthwave Hackathon",
          date: "Dec 05, 2026",
          location: "The Grid Hub",
          type: "Tech",
          description: "Major regional tech hackathon for developers.",
          image:
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
        },
        {
          id: 4,
          title: "DeepSpace Blockchain Summit",
          date: "Nov 20, 2026",
          location: "Orbit Convention Center",
          type: "Tech",
          description: "Global summit on decentralized web3 architecture.",
          image:
            "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?auto=format&fit=crop&q=80&w=800",
        },
        {
          id: 5,
          title: "Tokyo Midnight Drift",
          date: "Nov 28, 2026",
          location: "Tokyo Outer Loop",
          type: "Sports",
          description: "High-speed underground street racing finals.",
          image:
            "https://images.unsplash.com/photo-1567156948529-688f8d22df6e?auto=format&fit=crop&q=80&w=800",
        },
        {
          id: 6,
          title: "Holographic Symphony",
          date: "Dec 15, 2026",
          location: "Grand Neo-Opera House",
          type: "Music",
          description:
            "A blend of classical strings and holographic projections.",
          image:
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800",
        },
        {
          id: 7,
          title: "Global AI Expo",
          date: "Dec 02, 2026",
          location: "Silicon Valley Mega-plex",
          type: "Tech",
          description: "The premier exposition for autonomous intelligence.",
          image:
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
        },
        {
          id: 8,
          title: "Underground Bass Drop",
          date: "Nov 05, 2026",
          location: "Sector 7 Club",
          type: "Music",
          description: "Heavy bass lines and immersive LED installations.",
          image:
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
        },
      ];

      setEventList(realEvents);
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 relative min-h-[400px]">
      <h2 className="text-2xl font-bold mb-8 text-white/90">
        Curated Experiences
      </h2>

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
