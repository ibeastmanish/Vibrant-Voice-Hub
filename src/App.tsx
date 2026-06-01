import { AppProvider, useAppContext } from "./context/AppContext";
import { VoiceProvider } from "./context/VoiceContext";
import { IntroScreen } from "./components/layout/IntroScreen";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { VoiceOrb } from "./components/voice/VoiceOrb";
import { TelemetryDashboard } from "./components/admin/TelemetryDashboard";
import { SupportDashboard } from "./components/admin/SupportDashboard";
import { ChatCanvas } from "./components/search/ChatCanvas";
import { SmokeBackground } from "./components/ui/spooky-smoke-animation";
import { GlassFilter } from "./components/ui/liquid-glass";
import { cn } from "./lib/utils";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { LoginScreen } from "./components/layout/LoginScreen";

const MainLayout = () => {
  const { activeBrand, activeView, setIsGuest } = useAppContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Background Mesh based on brand
  const brandBg = {
    Vyntra: "from-[#0c051c] to-[#030108]",
  };

  return (
    <div
      className={cn(
        "flex h-screen w-full transition-colors duration-1000 overflow-hidden",
        brandBg[activeBrand] || brandBg.Vyntra,
      )}
    >
      {/* Ambient Mesh Graphics */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <SmokeBackground smokeColor="#FF5722" className="w-full h-full object-cover" />
      </div>
      <GlassFilter />

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <IntroScreen key="intro" onStart={() => setHasStarted(true)} />
        ) : !isAuthenticated ? (
          <LoginScreen key="login" onLogin={(guestMode) => {
              setIsGuest(guestMode);
              setIsAuthenticated(true);
          }} />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex w-full h-full relative z-10 overflow-hidden"
          >
            <Sidebar />

            <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
              <Header />

              <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                <div className="max-w-7xl mx-auto pb-32">
                  <VoiceOrb />

                  {/* View State Rendering */}
                  <div className="mt-12 transition-opacity duration-300">
                    {activeView === "Chat" && <ChatCanvas />}
                    {activeView === "Admin" && <TelemetryDashboard />}
                    {activeView === "Support" && <SupportDashboard />}
                    {activeView === "Dashboard" && (
                      <div className="text-center mt-20 text-white/40">
                        <p>Try saying "Show Events" or "Search for latest news"</p>
                      </div>
                    )}
                  </div>
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
