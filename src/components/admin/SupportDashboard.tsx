import { motion } from "framer-motion";
import { Package, User, Clock, ShieldCheck, MapPin, Mail, Phone, Activity, CreditCard, ChevronRight } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { LiquidButton } from "../ui/liquid-glass-button";

export const SupportDashboard = () => {
  const { activeOrder } = useAppContext();

  // Generate fallback data if activeOrder is null
  const data = activeOrder || {
    id: "ORD-99999",
    status: "Active",
    customerName: "Alex Mercer",
    lastEvent: "Global Tech Summit",
    supportTier: "VIP",
    recentQuery: "No recent query.",
    email: "alex.mercer@example.com",
    phone: "+1 (555) 019-2834",
    ltv: "$4,250",
    loyaltyPoints: 12500
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Agentic CRM Dashboard</h2>
            <p className="text-white/50">Data & CRM Specialist Active</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-green-400">System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Customer Profile Card - Takes up 4 columns on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-4 rounded-3xl border border-white/10 bg-[#1A1A1A]/80 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center border border-primary/20 mb-3 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <User size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white">{data.customerName}</h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/20 text-primary mt-1 border border-primary/30">
              {data.supportTier} Tier
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
              <Mail className="text-white/40" size={16} />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-white/40">Email</span>
                <span className="text-sm text-white/90">{data.email || 'alex.mercer@example.com'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
              <Phone className="text-white/40" size={16} />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-white/40">Phone</span>
                <span className="text-sm text-white/90">{data.phone || '+1 (555) 019-2834'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
              <MapPin className="text-white/40" size={16} />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-white/40">Location</span>
                <span className="text-sm text-white/90">Hyderabad, India</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-1">
              <Activity className="text-white/40" size={16} />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-white/40">Lifetime Value</span>
                <span className="text-sm font-semibold text-green-400">{data.ltv || '$4,250'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Middle Column: Active Order & Stats */}
        <div className="md:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Active Order Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6 backdrop-blur-md relative overflow-hidden shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <Package className="text-primary" size={20} />
                  <h3 className="text-lg font-semibold text-white">Active Order</h3>
                </div>
                <span className="font-mono text-xs text-white/50 bg-black/30 px-2 py-1 rounded-md">{data.id}</span>
              </div>
              <div className="space-y-4 relative z-10 mt-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wider text-white/50">Status</span>
                  <span className="text-primary font-medium text-lg flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    {data.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-xs uppercase tracking-wider text-white/50">Linked Event</span>
                  <span className="text-white text-base">{data.lastEvent}</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats / Rewards Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-3xl border border-white/10 bg-[#1A1A1A]/80 p-6 backdrop-blur-xl shadow-lg flex flex-col justify-between"
            >
              <div className="mb-4 flex items-center gap-3">
                <CreditCard className="text-white/70" size={20} />
                <h3 className="text-lg font-semibold text-white">Loyalty & Rewards</h3>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">{data.loyaltyPoints || '12,500'}</div>
                <div className="text-sm text-white/50 mb-4">Total Vyntra Points</div>
                
                <div className="w-full bg-white/5 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-primary/50 to-primary h-2 rounded-full w-[75%]"></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-white/40">Gold Tier</span>
                  <span className="text-[10px] text-white/40">2,500 to Platinum</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Context Engine Card - Full width of the right column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-white/10 bg-[#1A1A1A]/80 p-6 backdrop-blur-xl shadow-2xl flex-1 flex flex-col"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="text-primary" size={20} />
                <h3 className="text-lg font-semibold text-white">AI Context Engine</h3>
              </div>
              <span className="text-xs text-white/30">Auto-analysis complete</span>
            </div>
            
            <div className="flex-1 rounded-2xl bg-black/40 p-5 border border-white/5 flex flex-col justify-center">
              <p className="text-xs uppercase tracking-widest text-primary/70 mb-2 font-semibold">Extracted Intent</p>
              <p className="text-white/90 italic text-lg leading-relaxed">"{data.recentQuery}"</p>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <LiquidButton size="sm" variant="outline" className="rounded-full text-sm text-primary border-primary/50 hover:bg-primary/10">
                Initiate Refund
              </LiquidButton>
              <LiquidButton size="sm" variant="ghost" className="rounded-full text-sm bg-white/5 text-white hover:bg-white/10">
                Send Tracking Link
              </LiquidButton>
              <LiquidButton size="sm" variant="ghost" className="rounded-full text-sm bg-white/5 text-white hover:bg-white/10 flex items-center gap-1">
                View History <ChevronRight size={14} />
              </LiquidButton>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
