import { motion } from "framer-motion";
import { ShieldCheck, XCircle } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { LiquidButton } from "../ui/liquid-glass-button";

interface TermsScreenProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const TermsScreen = ({ onAccept, onDecline }: TermsScreenProps) => {
  const { customerName } = useAppContext();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-2xl bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <ShieldCheck className="text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Terms & Privacy</h2>
            <p className="text-white/40 text-sm">Please review before continuing, {customerName}.</p>
          </div>
        </div>

        <div className="bg-black/50 border border-white/5 rounded-2xl p-6 h-64 overflow-y-auto custom-scrollbar mb-8 text-sm text-white/60 space-y-4">
          <p>
            Welcome to Vyntra. By accessing or using our platform, you agree to be bound by these Terms and Conditions and our Privacy Policy.
          </p>
          
          <h3 className="text-white/90 font-semibold text-base mt-4 mb-2">1. Data Collection & Privacy</h3>
          <p>
            Vyntra uses advanced AI features that require access to your device's microphone for voice commands and GPS for location-based services (like local weather). We do not store raw audio recordings permanently.
          </p>

          <h3 className="text-white/90 font-semibold text-base mt-4 mb-2">2. Artificial Intelligence</h3>
          <p>
            Aura, your AI assistant, provides information based on real-time data APIs. While we strive for accuracy, Vyntra is not liable for any errors, omissions, or actions taken based on the AI's responses.
          </p>

          <h3 className="text-white/90 font-semibold text-base mt-4 mb-2">3. Acceptable Use</h3>
          <p>
            You agree not to misuse the platform, attempt to bypass security measures, or spam the AI backend. Violation of these terms may result in immediate account termination.
          </p>

          <h3 className="text-white/90 font-semibold text-base mt-4 mb-2">4. Limitation of Liability</h3>
          <p>
            The service is provided "as is" without warranties of any kind. We are not responsible for any indirect, incidental, or consequential damages arising from your use of the platform.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
          <button
            onClick={onDecline}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all font-medium text-sm w-full sm:w-auto justify-center"
          >
            <XCircle size={18} />
            Decline & Logout
          </button>
          
          <LiquidButton onClick={onAccept} className="w-full sm:w-auto justify-center">
            I Accept the Terms
          </LiquidButton>
        </div>
      </motion.div>
    </div>
  );
};
