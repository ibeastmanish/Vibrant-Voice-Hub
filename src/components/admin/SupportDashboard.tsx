import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Plus, Trash2, Clock, CheckCircle2, AlertCircle } from "lucide-react";
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

interface Reminder {
  id: string;
  text: string;
  time: number; // timestamp
  completed: boolean;
  priority: "high" | "normal";
}

export const SupportDashboard = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderText, setReminderText] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [isHighPriority, setIsHighPriority] = useState(false);

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

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderText.trim()) {
      addToast({ type: "error", title: "Error", description: "Please enter a reminder note." });
      return;
    }
    if (!reminderTime) {
      addToast({ type: "error", title: "Error", description: "Please select a valid time." });
      return;
    }

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
      priority: isHighPriority ? "high" : "normal",
    };

    setReminders(prev => [...prev, newReminder].sort((a, b) => a.time - b.time));
    setReminderText("");
    setReminderTime("");
    setIsHighPriority(false);
    
    addToast({
      type: "success",
      title: "Reminder Set",
      description: `Alert scheduled for ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    });
  };

  const removeReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const toggleCompletion = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const activeReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  return (
    <div className="space-y-8 max-w-5xl mx-auto w-full pb-12 mt-4 text-left">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Smart Reminders</h1>
        <p className="text-white/40 text-sm">Create and manage your alerts with active audio beeps.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Input Section */}
        <div className="relative z-10 mb-10 pb-10 border-b border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-violet-500/20 rounded-xl">
              <Bell className="text-violet-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Create New Reminder</h2>
              <p className="text-sm text-white/40">Set a specific time to be notified</p>
            </div>
          </div>

          <form onSubmit={handleAddReminder} noValidate className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-semibold text-white/40 uppercase tracking-widest pl-1">Reminder Note</label>
              <input
                type="text"
                value={reminderText}
                onChange={(e) => setReminderText(e.target.value)}
                placeholder="e.g., Check delivery status, Take medication..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
            <div className="w-full md:w-auto space-y-2">
              <label className="text-xs font-semibold text-white/40 uppercase tracking-widest pl-1">Time</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full md:w-40 bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-violet-500/50 transition-colors [color-scheme:dark]"
              />
            </div>
            <div className="w-full md:w-auto flex items-center h-[54px] bg-white/5 rounded-xl border border-white/10 px-4 gap-3">
               <label className="flex items-center gap-2 cursor-pointer text-sm text-white/70">
                 <input 
                   type="checkbox" 
                   checked={isHighPriority}
                   onChange={(e) => setIsHighPriority(e.target.checked)}
                   className="accent-violet-500 w-4 h-4 rounded"
                 />
                 High Priority
               </label>
            </div>
            <button
              type="submit"
              className="w-full md:w-auto h-[54px] px-8 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              <Plus size={18} />
              Add
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Active Reminders */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Clock size={14} className="text-violet-400" />
              Active ({activeReminders.length})
            </h3>
            
            {activeReminders.length === 0 ? (
              <div className="p-8 border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-center opacity-40">
                <Bell size={32} className="mb-3" />
                <p className="text-sm">No active reminders</p>
              </div>
            ) : (
              <AnimatePresence>
                {activeReminders.map((r) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-4 rounded-2xl border ${r.priority === 'high' ? 'bg-red-500/5 border-red-500/20' : 'bg-black/40 border-white/10'} hover:border-violet-500/30 transition-colors flex items-start gap-4 group`}
                  >
                    <button 
                      onClick={() => toggleCompletion(r.id)}
                      className="mt-1 w-5 h-5 rounded-full border border-white/30 hover:border-violet-400 flex items-center justify-center shrink-0 transition-colors"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 font-medium break-words leading-tight">
                        {r.text}
                        {r.priority === 'high' && <AlertCircle size={14} className="inline ml-2 text-red-400" />}
                      </p>
                      <p className="text-xs text-violet-400 font-semibold mt-1.5 flex items-center gap-1.5">
                        <Clock size={12} />
                        {new Date(r.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button
                      onClick={() => removeReminder(r.id)}
                      className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Completed Reminders */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest flex items-center gap-2 mb-4">
              <CheckCircle2 size={14} className="text-green-400" />
              Completed ({completedReminders.length})
            </h3>
            
            {completedReminders.length === 0 ? (
              <div className="p-8 border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-center opacity-40">
                <CheckCircle2 size={32} className="mb-3" />
                <p className="text-sm">No completed tasks yet</p>
              </div>
            ) : (
              <div className="space-y-3 opacity-60">
                <AnimatePresence>
                  {completedReminders.map((r) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-4 rounded-2xl bg-white/5 border border-transparent flex items-start gap-4 group"
                    >
                      <button 
                        onClick={() => toggleCompletion(r.id)}
                        className="mt-1 w-5 h-5 rounded-full border border-green-500/50 bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 transition-colors"
                      >
                        <CheckCircle2 size={12} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/50 font-medium break-words leading-tight line-through">
                          {r.text}
                        </p>
                        <p className="text-xs text-white/30 font-semibold mt-1.5 flex items-center gap-1.5">
                          <Clock size={12} />
                          {new Date(r.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <button
                        onClick={() => removeReminder(r.id)}
                        className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
};
