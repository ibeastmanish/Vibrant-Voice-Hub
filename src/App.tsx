import { AppProvider, useAppContext } from "./context/AppContext";
import { VoiceProvider } from "./context/VoiceContext";
import { IntroScreen } from "./components/layout/IntroScreen";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { VoiceOrb } from "./components/voice/VoiceOrb";
import { SupportDashboard } from "./components/admin/SupportDashboard";
import { ChatCanvas } from "./components/search/ChatCanvas";
import { AccessibilityScreen } from "./components/accessibility/AccessibilityScreen";
import { ProfileScreen } from "./components/profile/ProfileScreen";
import { InterestsScreen } from "./components/onboarding/InterestsScreen";
import { NewsFeed } from "./components/dashboard/NewsFeed";
import { ShaderAnimation } from "./components/ui/shader-lines";
import { GlassFilter } from "./components/ui/liquid-glass";
import { cn } from "./lib/utils";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoginScreen } from "./components/layout/LoginScreen";

import { ToastContainer } from "./components/ui/Toast";
import { QuickActions } from "./components/voice/QuickActions";
import { ConversationPanel } from "./components/voice/ConversationPanel";


const MainLayout = () => {
  const {
    activeBrand,
    activeView,
    customerName,
    highContrast,
    textSize,
    reducedMotion,
    focusMode,
    setCustomerName,
    setIsGuest,
    hasSelectedInterests,
  } = useAppContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Text size map: 1=xs 2=sm 3=base 4=lg 5=xl
  const textSizeClass =
    ["text-xs", "text-sm", "text-base", "text-lg", "text-xl"][textSize - 1] ??
    "text-base";

  const brandBg = { Vyntra: "from-[#0c051c] to-[#030108]" };

  const isFullscreen = ["Chat", "Support"].includes(activeView);

  return (
    <div
      className={cn(
        "flex h-screen w-full transition-colors duration-1000 overflow-hidden",
        brandBg[activeBrand] || brandBg.Vyntra
      )}
    >
      {/* Ambient background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <ShaderAnimation />
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none backdrop-blur-xl bg-black/20" />
      <GlassFilter />

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <IntroScreen onStart={() => setHasStarted(true)} />
          </motion.div>
        ) : !isAuthenticated ? (
          <LoginScreen
            key="login"
            onLogin={(name) => {
              setCustomerName(name);
              setIsGuest(false);
              setIsAuthenticated(true);
            }}
          />
        ) : !hasSelectedInterests ? (
          <motion.div
            key="interests"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <InterestsScreen />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "flex w-full h-full relative z-10",
              textSizeClass,
              highContrast && "contrast-125 saturate-150",
              reducedMotion && "[&_*]:!transition-none [&_*]:!duration-0 [&_*]:!animate-none"
            )}
          >
            <Sidebar />

            <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
              <Header />

              <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative flex flex-col">
                <div
                  className={cn(
                    "w-full max-w-7xl mx-auto",
                    !isFullscreen && "pb-0",
                    isFullscreen && "pb-0 h-full flex flex-col"
                  )}
                >
                  {/* Dashboard view */}
                  {activeView === "Dashboard" && (
                    <div className="flex flex-col items-center w-full">

                      {/* Hero section — orb + greeting + controls tightly grouped */}
                      <div className="flex flex-col items-center justify-center pt-6 pb-4 w-full">
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center mb-8"
                        >
                          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
                            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(167,139,250,0.6)]">
                              {customerName}
                            </span>
                            <span className="text-white">!</span>
                          </h1>
                          <p className="text-white/30 text-sm mt-2 font-medium tracking-wide">Your AI assistant is ready</p>
                        </motion.div>

                        <VoiceOrb />


                        {/* Quick Actions — tap to speak shortcuts */}
                        <QuickActions />
                      </div>

                      {!focusMode && <NewsFeed />}
                    </div>
                  )}

                  {/* Fullscreen views */}
                  {activeView === "Chat" && <ChatCanvas />}
                  {activeView === "Support" && <SupportDashboard />}
                  {activeView === "Accessibility" && <AccessibilityScreen />}
                  {activeView === "Profile" && <ProfileScreen />}
                </div>
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <VoiceProvider>
        <ToastContainer />
        <ConversationPanel />
        <MainLayout />
      </VoiceProvider>
    </AppProvider>
  );
}

export default App;
