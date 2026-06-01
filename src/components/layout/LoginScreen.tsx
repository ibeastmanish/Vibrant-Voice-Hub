import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, UserCircle2, Sparkles } from "lucide-react";
import { LiquidButton } from "../ui/liquid-glass-button";

interface LoginScreenProps {
  onLogin: (isGuest: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [view, setView] = useState<'options' | 'login' | 'signup'>('options');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(false);
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
          {view === 'options' && (
            <motion.div
              key="options"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Primary Option: Guest */}
              <button
                onClick={() => onLogin(true)}
                className="w-full flex items-center justify-between p-4 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-xl text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="text-primary" size={24} />
                  <div className="text-left">
                    <div className="font-semibold text-lg">Continue as Guest</div>
                    <div className="text-xs text-white/60">Instant access. No account required.</div>
                  </div>
                </div>
                <ArrowRight className="text-primary group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-xs text-white/30 uppercase tracking-widest">OR</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Secondary Options */}
              <button
                onClick={() => setView('login')}
                className="w-full flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all"
              >
                <UserCircle2 size={18} className="text-white/70" />
                <span>Sign In to Sync History</span>
              </button>
              
              <button
                onClick={() => setView('signup')}
                className="w-full text-center text-sm text-white/50 hover:text-white transition-colors"
              >
                Don't have an account? Create one
              </button>
            </motion.div>
          )}

          {(view === 'login' || view === 'signup') && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/30" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/30" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="pt-4">
                  <LiquidButton type="submit" className="w-full flex items-center justify-center gap-2">
                    {view === 'login' ? "Sign In" : "Create Account"} <ArrowRight size={18} />
                  </LiquidButton>
                </div>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setView('options')}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  ← Back to options
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
