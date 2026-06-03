import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Truck, CheckCircle2, Clock, MapPin, Search, Bell, Plus, Trash2, Link } from "lucide-react";
import { addToast } from "../ui/Toast";

// Generate a simple beep using Web Audio API
const playBeep = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.error("Audio beep failed", e);
  }
};

interface TrackedOrder {
  id: string;
  item: string;
  status: "processing" | "in_transit" | "delivered";
  currentLocation: string;
  estimatedDelivery: string;
  total: string;
  date: string;
  store: string;
}

interface Reminder {
  id: string;
  text: string;
  time: number; // timestamp
  completed: boolean;
}

export const SupportDashboard = () => {
  // Order Tracking State
  const [trackingLink, setTrackingLink] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  // Reminders State
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderText, setReminderText] = useState("");
  const [reminderTime, setReminderTime] = useState(""); // HH:MM string for today
  
  // Interval for checking reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setReminders(prev => {
        let changed = false;
        const updated = prev.map(r => {
          if (!r.completed && now >= r.time) {
            changed = true;
            playBeep();
            addToast({
              type: "info",
              title: "Reminder",
              description: r.text
            });
            return { ...r, completed: true };
          }
          return r;
        });
        return changed ? updated : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const extractProductFromUrl = (url: string) => {
    try {
      // Handle standard URL format
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      // Look for a slug (long string with hyphens)
      for (const part of pathParts) {
        if (part.length > 8 && part.includes('-') && !part.includes('ref=') && part !== 'dp' && part !== 'p') {
          return part.split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ')
            .replace(/%20/g, ' ')
            .replace(/[0-9a-fA-F]{10,}/g, ''); // Remove trailing hashes if any
        }
      }
      
      // Check query params for things like 'keywords=' or 'q='
      const q = urlObj.searchParams.get('keywords') || urlObj.searchParams.get('q');
      if (q) return q.charAt(0).toUpperCase() + q.slice(1);

    } catch (e) {
      // If not a valid URL, maybe they just typed the product name
      if (!url.includes('http')) {
        return url.charAt(0).toUpperCase() + url.slice(1);
      }
    }
    return null;
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingLink.trim()) return;

    setIsAnalyzing(true);
    setOrder(null);

    // Simulate AI parsing the URL and extracting order details
    setTimeout(() => {
      const lowerLink = trackingLink.toLowerCase();
      const isAmazon = lowerLink.includes("amazon");
      const isFlipkart = lowerLink.includes("flipkart");
      const isApple = lowerLink.includes("apple");
      
      let storeName = "Online Store";
      let finalItem = "Premium Package";
      let parsedOrderId = `ORD-${Math.floor(Math.random() * 10000)}-${storeName.substring(0, 2).toUpperCase()}`;

      // 1. Check if input looks like an Order ID (alphanumeric with hyphens/hash, no spaces, not a URL)
      const isOrderId = /^[#A-Za-z0-9-]+$/.test(trackingLink.trim()) && !trackingLink.includes('http') && !trackingLink.includes('.com');

      if (isOrderId) {
        // If it's an Order ID, we simulate pulling the associated product
        parsedOrderId = trackingLink.toUpperCase().replace(/^#/, ''); // Remove leading hash if any
        storeName = parsedOrderId.startsWith("114-") ? "Amazon" : "Partner Network";
        const randomItems = ["Apple Watch Series 9", "Sony PlayStation 5", "Dyson Airwrap", "Samsung Galaxy S24 Ultra", "Nike Air Jordan 1"];
        finalItem = randomItems[Math.floor(Math.random() * randomItems.length)];
      } else {
        // 2. Otherwise, treat it as a URL or search query
        if (isAmazon) storeName = "Amazon";
        else if (isFlipkart) storeName = "Flipkart";
        else if (isApple) storeName = "Apple";
        else if (lowerLink.includes(".")) {
          const domain = new URL(trackingLink.startsWith("http") ? trackingLink : `https://${trackingLink}`).hostname;
          storeName = domain.replace("www.", "").split(".")[0];
          storeName = storeName.charAt(0).toUpperCase() + storeName.slice(1);
        }
        
        const extractedProduct = extractProductFromUrl(trackingLink);
        finalItem = extractedProduct || (isAmazon ? "Sony WH-1000XM5 Headphones" : "Premium Wireless Earbuds");
      }
      
      setOrder({
        id: parsedOrderId,
        item: finalItem,
        status: "in_transit",
        currentLocation: isAmazon ? "Dispatch Center, Bangalore" : "Sorting Hub, Mumbai",
        estimatedDelivery: "Tomorrow, by 9:00 PM",
        total: isAmazon ? "$348.00" : "$120.00",
        date: new Date().toLocaleDateString(),
        store: storeName,
      });
      setIsAnalyzing(false);
      setTrackingLink("");
      addToast({
        type: "success",
        title: "Order Tracked",
        description: "Details extracted successfully."
      });
    }, 2500);
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderText.trim() || !reminderTime) return;

    // Create timestamp for today at the specified time
    const [hours, minutes] = reminderTime.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    // If the time has already passed today, set it for tomorrow
    if (date.getTime() <= Date.now()) {
      date.setDate(date.getDate() + 1);
    }

    const newReminder: Reminder = {
      id: Math.random().toString(36).substr(2, 9),
      text: reminderText.trim(),
      time: date.getTime(),
      completed: false,
    };

    setReminders(prev => [...prev, newReminder].sort((a, b) => a.time - b.time));
    setReminderText("");
    setReminderTime("");
    addToast({
      type: "success",
      title: "Reminder Set",
      description: `Alert scheduled for ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    });
  };

  const removeReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const trackingSteps = [
    { id: 1, label: "Order Placed", date: order?.date, completed: true },
    { id: 2, label: "Processing", date: "Verified", completed: true },
    { id: 3, label: "In Transit", date: "Active", completed: order?.status === "in_transit" || order?.status === "delivered", current: order?.status === "in_transit" },
    { id: 4, label: "Delivered", date: "Pending", completed: order?.status === "delivered", current: order?.status === "delivered" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto w-full pb-12 mt-4 text-left">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Smart Hub</h1>
        <p className="text-white/40 text-sm">Track your orders via links and set personal reminders.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Smart Order Tracking */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden h-full flex flex-col"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2.5 bg-cyan-500/20 rounded-xl">
                <Package className="text-cyan-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">AI Order Tracker</h2>
                <p className="text-sm text-white/40">Paste a link to extract and track</p>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleTrackOrder} className="relative z-10 mb-8">
              <div className="relative flex items-center">
                <div className="absolute left-4 text-white/30">
                  <Link size={18} />
                </div>
                <input
                  type="text"
                  value={trackingLink}
                  onChange={(e) => setTrackingLink(e.target.value)}
                  placeholder="e.g., Tracking Link or Order ID (#ORD-123)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-24 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={isAnalyzing || !trackingLink.trim()}
                  className="absolute right-2 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-white/10 disabled:text-white/30 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  {isAnalyzing ? "Analyzing..." : "Track"}
                </button>
              </div>
            </form>

            {/* Loading State */}
            {isAnalyzing && (
              <div className="flex-1 flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
                <p className="text-white/60 font-medium">Extracting order details from link...</p>
                <p className="text-white/30 text-sm mt-1">Analyzing product, status, and delivery date</p>
              </div>
            )}

            {/* Result State */}
            {order && !isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col"
              >
                <div className="p-4 bg-black/20 rounded-2xl border border-white/5 flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden">
                    <span className="text-2xl">{order.store === "Amazon" ? "📦" : "🛍️"}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white/90 font-medium line-clamp-1">{order.item}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-white/40">{order.store} • {order.id}</p>
                      <p className="text-xs text-cyan-400 font-medium">{order.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>

                {/* Stepper */}
                <div className="relative mb-8 mt-4">
                  <div className="absolute top-5 left-6 right-6 h-0.5 bg-white/10" />
                  <motion.div 
                    className="absolute top-5 left-6 h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    initial={{ width: "0%" }}
                    animate={{ width: "50%" }} // Hardcoded for 'In Transit'
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />

                  <div className="relative flex justify-between">
                    {trackingSteps.map((step) => (
                      <div key={step.id} className="flex flex-col items-center gap-3 z-10 w-20 text-center">
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
                          <p className={`text-xs font-medium ${step.current || step.completed ? "text-white/90" : "text-white/30"}`}>
                            {step.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-white/50 bg-white/5 w-full px-4 py-3 rounded-xl mt-auto">
                  <MapPin size={16} className="text-cyan-400 shrink-0" />
                  <span className="truncate">Current location: <span className="text-white/80">{order.currentLocation}</span></span>
                </div>
              </motion.div>
            )}

            {!order && !isAnalyzing && (
              <div className="flex-1 flex flex-col items-center justify-center opacity-30 py-12">
                <Search size={48} className="mb-4" />
                <p>Waiting for a tracking link...</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Reminders */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden h-full flex flex-col"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2.5 bg-violet-500/20 rounded-xl">
                <Bell className="text-violet-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Smart Reminders</h2>
                <p className="text-sm text-white/40">Set custom alerts with audio beeps</p>
              </div>
            </div>

            {/* Add Reminder Form */}
            <form onSubmit={handleAddReminder} className="relative z-10 mb-8 flex gap-3">
              <input
                type="text"
                value={reminderText}
                onChange={(e) => setReminderText(e.target.value)}
                placeholder="Remind me to..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
                required
              />
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-32 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 transition-colors [color-scheme:dark]"
                required
              />
              <button
                type="submit"
                className="px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors flex items-center justify-center shrink-0"
              >
                <Plus size={20} />
              </button>
            </form>

            {/* Reminders List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 relative z-10">
              {reminders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-30 py-8">
                  <Bell size={40} className="mb-4" />
                  <p>No active reminders</p>
                </div>
              ) : (
                <AnimatePresence>
                  {reminders.map((reminder) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-colors ${
                        reminder.completed 
                          ? "bg-white/5 border-white/5 opacity-50" 
                          : "bg-black/40 border-white/10 hover:border-violet-500/30"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${reminder.completed ? "text-white/50 line-through" : "text-white/90"}`}>
                          {reminder.text}
                        </p>
                        <p className="text-xs text-white/40 mt-1 flex items-center gap-1.5">
                          <Clock size={12} />
                          {new Date(reminder.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {reminder.completed && <span className="text-green-400 ml-2">• Completed</span>}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => removeReminder(reminder.id)}
                        className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
};
