import React from "react";
import { motion } from "framer-motion";
import { GooeyText } from "../ui/gooey-text-morphing";
import { SlideButton } from "../ui/slide-button";

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-transparent backdrop-blur-sm"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <GooeyText
          texts={["Vyntra", "Customer", "Experience"]}
          morphTime={1}
          cooldownTime={0.4}
          className="mb-8"
        />
      </div>

      <div className="flex flex-col items-center justify-center pb-24 w-full max-w-sm">
        <SlideButton onComplete={onStart} />
        <p className="mt-6 text-sm font-medium text-white/50 tracking-widest uppercase">
          Swipe to get started
        </p>
      </div>
    </motion.div>
  );
};
