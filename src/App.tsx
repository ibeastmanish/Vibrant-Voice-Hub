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
import { useVoiceContext } from "./context/VoiceContext";
import { Play } from "lucide-react";

const DemoButton = () => {
  const { processIntent } = useVoiceContext();
  return (
    <button
      onClick={() => {
        const demoTranscript = "I ordered a high-end laptop but the box arrived completely empty! I am absolutely furious. What kind of service is this?";
        processIntent(demoTranscript);
      }}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white transition-all text-sm font-medium"
    >
      <Play size={14} />
      Run Demo
    </button>
  );
};

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
                  {/* Dashboard / orb view */}
                  {activeView === "Dashboard" && (
                    <div className="flex flex-col items-center w-full min-h-[calc(100vh-10rem)] justify-center">
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-light text-white tracking-wide text-center mb-8"
                      >
                        Welcome <span className="font-semibold">{customerName}</span>!
                      </motion.h2>

                      <VoiceOrb />

                      {/* Demo button for judges */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6"
                      >
                        <DemoButton />
                      </motion.div>

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
        <MainLayout />
      </VoiceProvider>
    </AppProvider>
  );
}

export default App;
