import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export const SupportDashboard = () => {
  const { activeOrder, customerName } = useAppContext();

  // Generate fallback data if activeOrder is null
  const data = activeOrder || {
    id: "CUST-90210",
    status: "Active",
    joinDate: "2023-11-15",
    lifetimeValue: "$4,250",
    loyaltyTier: "VIP",
    lastEvent: "Global Tech Summit",
    supportTier: "VIP",
    recentQuery: "No recent query.",
    email: "guest@example.com",
    phone: "+1 (555) 019-8372",
    ltv: "$4,250",
    loyaltyPoints: 12500
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">

      <div className="flex justify-center mt-12">
        {/* Customer Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-3xl border border-white/10 bg-black/20 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center border border-primary/20 mb-4 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <User size={40} className="text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white">{customerName}</h3>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/20 text-primary mt-2 border border-primary/30">
              {data.supportTier} Tier
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
