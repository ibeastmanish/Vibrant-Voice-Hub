import { motion } from "framer-motion";
import { Package, Truck, CheckCircle2, Clock, MapPin, AlertCircle, HeadphonesIcon, RotateCcw, MessageSquare, ChevronRight } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { useVoiceContext } from "../../context/VoiceContext";

export const SupportDashboard = () => {
  const { activeOrder, setActiveView } = useAppContext();
  const { processIntent } = useVoiceContext();

  // Mock order details if context has none
  const order = activeOrder || {
    id: "ORD-9981-MX",
    status: "in_transit",
    date: "Oct 24, 2023",
    total: "$1,299.00",
    item: "MacBook Pro M3 (14-inch, Space Black)",
    estimatedDelivery: "Tomorrow, by 8:00 PM",
    currentLocation: "Sorting Facility, Mumbai",
  };

  const trackingSteps = [
    { id: 1, label: "Order Placed", date: "Oct 24", completed: true },
    { id: 2, label: "Processing", date: "Oct 25", completed: true },
    { id: 3, label: "In Transit", date: "Oct 26", completed: order.status === "in_transit" || order.status === "delivered", current: order.status === "in_transit" },
    { id: 4, label: "Delivered", date: "Est. Tomorrow", completed: order.status === "delivered", current: order.status === "delivered" },
  ];

  const quickLinks = [
    { icon: <RotateCcw size={18} />, label: "Initiate Return or Refund", query: "I want to return an item or get a refund." },
    { icon: <Truck size={18} />, label: "Modify Delivery Address", query: "Can I change the delivery address for my current order?" },
    { icon: <AlertCircle size={18} />, label: "Report a Missing Item", query: "I received my order but an item is missing." },
    { icon: <HeadphonesIcon size={18} />, label: "Connect to Human Agent", query: "Connect me to a human support agent immediately." },
  ];

  const handleSupportAction = (query: string) => {
    setActiveView("Chat");
    setTimeout(() => {
      processIntent(query);
    }, 500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto w-full pb-12 mt-4 text-left">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Orders & Support</h1>
        <p className="text-white/40 text-sm">Track your deliveries and get instant help from Aura.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Order Tracking */}
        <div className="lg:col-span-2 space-y-6">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden"
          >
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-cyan-500/20 rounded-xl">
                    <Package className="text-cyan-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Active Order</h2>
                    <p className="text-sm text-cyan-400/80 font-mono tracking-wider">{order.id}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-left md:text-right">
                <p className="text-white/50 text-sm mb-1">Expected Delivery</p>
                <p className="text-white font-semibold text-lg">{order.estimatedDelivery}</p>
              </div>
            </div>

            <div className="p-4 bg-black/20 rounded-2xl border border-white/5 flex items-center gap-4 mb-10">
              <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden">
                <span className="text-3xl">💻</span>
              </div>
              <div>
                <p className="text-white/90 font-medium">{order.item}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-white/40">
                  <span>{order.date}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>{order.total}</span>
                </div>
              </div>
            </div>

            {/* Stepper */}
            <div className="relative mb-6">
              <div className="absolute top-5 left-6 right-6 h-0.5 bg-white/10" />
              <motion.div 
                className="absolute top-5 left-6 h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                initial={{ width: "0%" }}
                animate={{ width: "50%" }} // Hardcoded for 'In Transit'
                transition={{ duration: 1.5, ease: "easeOut" }}
              />

              <div className="relative flex justify-between">
                {trackingSteps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center gap-3 z-10 w-24 text-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500
                      ${step.completed && !step.current ? "bg-cyan-500 border-cyan-500 text-white" : ""}
                      ${step.current ? "bg-[#0c051c] border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]" : ""}
                      ${!step.completed && !step.current ? "bg-[#0c051c] border-white/20 text-white/20" : ""}
                    `}>
                      {step.completed && !step.current ? <CheckCircle2 size={20} /> : 
                       step.current ? <Truck size={20} className="animate-pulse" /> : 
                       <Clock size={20} />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${step.current || step.completed ? "text-white/90" : "text-white/30"}`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-white/40 mt-0.5">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/50 bg-white/5 w-fit px-4 py-2 rounded-full mt-4">
              <MapPin size={14} className="text-cyan-400" />
              <span>Current location: {order.currentLocation}</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Support & Real-time actions */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-violet-600/20 to-purple-900/20 border border-purple-500/20 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <MessageSquare size={100} />
            </div>
            
            <div className="relative z-10 mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Need help? Ask Aura</h3>
              <p className="text-sm text-white/60">Aura is context-aware and knows everything about your active orders.</p>
            </div>

            <button
              onClick={() => setActiveView("Chat")}
              className="relative z-10 w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-medium flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              <MessageSquare size={18} />
              Open Live Chat
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
          >
            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Quick Support Actions</h3>
            <div className="space-y-2">
              {quickLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSupportAction(link.query)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-left transition-all group"
                >
                  <div className="p-2 rounded-lg bg-white/5 text-white/50 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                    {link.icon}
                  </div>
                  <span className="text-sm font-medium text-white/70 group-hover:text-white flex-1 transition-colors">
                    {link.label}
                  </span>
                  <ChevronRight size={16} className="text-white/20 group-hover:text-white/50 transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Real-time metrics widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between p-5 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md"
          >
            <div>
              <p className="text-xs text-white/40 mb-1">Live Wait Time</p>
              <p className="text-lg font-semibold text-green-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                No Wait
              </p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="text-xs text-white/40 mb-1">Resolution Rate</p>
              <p className="text-lg font-semibold text-white">99.4%</p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};
