import { motion } from "framer-motion";
import { Eye, Type, Volume2, Zap, Focus, MousePointer, Check } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

// Reusable toggle row
const ToggleRow = ({
  enabled,
  onToggle,
  label,
  description,
}: {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description: string;
}) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-white font-medium">{label}</p>
      <p className="text-white/50 text-sm mt-0.5">{description}</p>
    </div>
    <button
      onClick={onToggle}
      aria-label={`Toggle ${label}`}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0 ${
        enabled ? "bg-blue-500" : "bg-white/10"
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
          enabled ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

const TEXT_SIZES = [
  { label: "XS", value: 1, cls: "text-xs" },
  { label: "S",  value: 2, cls: "text-sm" },
  { label: "M",  value: 3, cls: "text-base" },
  { label: "L",  value: 4, cls: "text-lg" },
  { label: "XL", value: 5, cls: "text-xl" },
];

export const AccessibilityScreen = () => {
  const {
    highContrast, setHighContrast,
    reducedMotion, setReducedMotion,
    focusMode, setFocusMode,
    textSize, setTextSize,
  } = useAppContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-1">Accessibility Hub</h2>
        <p className="text-white/50">Customise Vyntra to fit your needs. Changes apply instantly.</p>
      </div>

      {/* Text Size */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Type className="text-purple-400" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-white">Text Size</h3>
        </div>

        <div className="flex gap-2">
          {TEXT_SIZES.map((s) => (
            <button
              key={s.value}
              onClick={() => setTextSize(s.value)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 ${s.cls} ${
                textSize === s.value
                  ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.4)]"
                  : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <p className="text-white/40 text-xs">
          Preview: <span className={TEXT_SIZES.find(s => s.value === textSize)?.cls ?? "text-base"}>The quick brown fox</span>
        </p>
      </div>

      {/* Toggles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* High Contrast */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Eye className="text-blue-400" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">High Contrast</h3>
          </div>
          <ToggleRow
            enabled={highContrast}
            onToggle={() => setHighContrast(!highContrast)}
            label="Boost contrast"
            description="Makes text sharper and backgrounds darker"
          />
        </div>

        {/* Reduced Motion */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <Zap className="text-green-400" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Reduced Motion</h3>
          </div>
          <ToggleRow
            enabled={reducedMotion}
            onToggle={() => setReducedMotion(!reducedMotion)}
            label="Reduce animations"
            description="Minimises transitions for motion sensitivity"
          />
        </div>

        {/* Focus Mode */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-orange-500/20 rounded-xl">
              <Focus className="text-orange-400" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Focus Mode</h3>
          </div>
          <ToggleRow
            enabled={focusMode}
            onToggle={() => setFocusMode(!focusMode)}
            label="Hide news feed"
            description="Keeps the dashboard minimal — just the mic"
          />
        </div>

        {/* Keyboard Navigation */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-pink-500/20 rounded-xl">
              <MousePointer className="text-pink-400" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Keyboard Shortcuts</h3>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { key: "Space", action: "Start / Stop listening" },
              { key: "Ctrl+Shift+F", action: "Run demo mode" },
              { key: "Escape", action: "Close any modal" },
            ].map(({ key, action }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-white/50">{action}</span>
                <kbd className="px-2 py-0.5 bg-white/10 text-white/80 rounded text-xs font-mono border border-white/10">{key}</kbd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Screen Reader Banner */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex items-start gap-4">
        <div className="p-2 bg-green-500/20 rounded-xl shrink-0">
          <Volume2 className="text-green-400" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Screen Reader Ready</h3>
          <p className="text-white/50 text-sm">
            Vyntra is built with full ARIA attributes and semantic HTML. It's compatible with VoiceOver, NVDA, and JAWS. Voice interaction is prioritised by default — no screen reader required to use any feature.
          </p>
        </div>
        <div className="p-2 bg-green-500/10 rounded-xl shrink-0 ml-auto">
          <Check className="text-green-400" size={20} />
        </div>
      </div>
    </motion.div>
  );
};
