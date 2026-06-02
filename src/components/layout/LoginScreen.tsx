import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, UserCircle2 } from "lucide-react";
import { LiquidButton } from "../ui/liquid-glass-button";

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >

      <div className="relative z-10 w-full max-w-md p-8 rounded-[2rem] border border-white/10 bg-[#1A1A1A]/60 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-3">Vyntra</h2>
          <p className="text-white/60">Personalised Customer Experience.</p>
        </div>

        <AnimatePresence mode="wait">
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserCircle2 className="h-5 w-5 text-white/30" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="pt-4">
                  <LiquidButton type="submit" className="w-full flex items-center justify-center gap-2">
                    Start Experience <ArrowRight size={18} />
                  </LiquidButton>
                </div>
              </form>
            </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
