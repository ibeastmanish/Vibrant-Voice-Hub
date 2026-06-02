import { AppProvider, useAppContext } from "./context/AppContext";
import { VoiceProvider } from "./context/VoiceContext";
import { IntroScreen } from "./components/layout/IntroScreen";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { VoiceOrb } from "./components/voice/VoiceOrb";
import { TelemetryDashboard } from "./components/admin/TelemetryDashboard";
import { SupportDashboard } from "./components/admin/SupportDashboard";
import { ChatCanvas } from "./components/search/ChatCanvas";
import { ShaderAnimation } from "./components/ui/shader-lines";
import { GlassFilter } from "./components/ui/liquid-glass";
import { cn } from "./lib/utils";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { LoginScreen } from "./components/layout/LoginScreen";

const MainLayout = () => {
  const { activeBrand, activeView, setIsGuest, setCustomerName, customerName } = useAppContext();
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
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
          <ShaderAnimation />
      </div>
      {/* Permanent Glassmorphic Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none backdrop-blur-xl bg-black/20" />
      <GlassFilter />

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <IntroScreen key="intro" onStart={() => setHasStarted(true)} />
        ) : !isAuthenticated ? (
          <LoginScreen key="login" onLogin={(name) => {
              setCustomerName(name);
              setIsGuest(false);
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

              <main className={cn(
                "flex-1 overflow-y-auto p-8 custom-scrollbar relative flex flex-col",
                activeView === "Dashboard" && "justify-center"
              )}>
                <div className={cn(
                  "w-full max-w-7xl mx-auto",
                  activeView === "Dashboard" ? "pb-0" : "pb-32"
                )}>
                  {activeView !== "Chat" && activeView !== "Support" && (
                    <div className={cn(
                      "flex flex-col items-center justify-center transition-all duration-700 w-full",
                      activeView === "Dashboard" ? "" : "mt-24"
                    )}>
                      {activeView === "Dashboard" && (
                        <motion.h2 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-4xl md:text-5xl font-light text-white tracking-wide text-center mb-8"
                        >
                          Welcome <span className="font-semibold">{customerName}</span>!
                        </motion.h2>
                      )}
                      
                      <VoiceOrb />

                      {activeView === "Dashboard" && (
                        <motion.p 
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-lg md:text-xl text-white/50 tracking-wide font-light mt-8"
                        >
                          Explore more with vyntra
                        </motion.p>
                      )}
                    </div>
                  )}

                  {/* View State Rendering */}
                  <div className="mt-12 transition-opacity duration-300">
                    {activeView === "Chat" && <ChatCanvas />}
                    {activeView === "Admin" && <TelemetryDashboard />}
                    {activeView === "Support" && <SupportDashboard />}
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
