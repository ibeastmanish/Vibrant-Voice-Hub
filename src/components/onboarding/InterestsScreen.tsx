import { useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../lib/utils";
import { LiquidButton } from "../ui/liquid-glass-button";

const ALL_INTERESTS = [
  "Technology", "Startups", "Machine Learning",
  "Global News", "Business", "Finance",
  "Sports", "Entertainment", "Health",
  "Science", "Space", "Politics"
];

export const InterestsScreen = () => {
  const { setHasSelectedInterests, setSelectedInterests } = useAppContext();
  const [localSelection, setLocalSelection] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setLocalSelection((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleNext = () => {
    const finalSelection = localSelection.length > 0 ? localSelection : ["Technology", "Global News"];
    setSelectedInterests(finalSelection);
    setHasSelectedInterests(true);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mx-auto flex flex-col items-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-semibold text-white mb-4 text-center"
        >
          Choose the topics you are interested most.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/50 mb-12 text-center"
        >
          We'll curate real-time news just for you on your dashboard.
        </motion.p>

        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mb-16">
          {ALL_INTERESTS.map((interest, i) => {
            const isSelected = localSelection.includes(interest);
            return (
              <motion.div
                key={interest}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.04 }}
              >
                <LiquidButton
                  onClick={() => toggleInterest(interest)}
                  size="sm"
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                    isSelected
                      ? "text-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                      : "text-white/60 hover:text-white"
                  )}
                >
                  {isSelected && <span className="mr-1">✓</span>}
                  {interest}
                </LiquidButton>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <LiquidButton
            onClick={handleNext}
            size="xl"
            className="rounded-full px-12 text-white font-semibold"
          >
            {localSelection.length > 0 ? `Continue with ${localSelection.length} topic${localSelection.length > 1 ? 's' : ''}` : 'Skip'}
          </LiquidButton>
        </motion.div>
      </motion.div>
    </div>
  );
};
