
import { AppProvider, useAppContext } from './context/AppContext';
import { VoiceProvider } from './context/VoiceContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { VoiceOrb } from './components/voice/VoiceOrb';
import { EventDiscovery } from './components/events/EventCard';
import { TelemetryDashboard } from './components/admin/TelemetryDashboard';
import { FloatingMascot } from './components/help/FloatingMascot';
import { MeshGradient, DotOrbit } from '@paper-design/shaders-react';
import { cn } from './lib/utils';

const MainLayout = () => {
  const { activeBrand, activeView } = useAppContext();

  // Background Mesh based on brand
  const brandBg = {
    AntiGravity: 'from-[#0c051c] to-[#030108]',
    Lovable: 'from-[#1c0512] to-[#080104]',
    Stitch: 'from-[#051c0a] to-[#010802]',
  };

  return (
    <div className={cn("flex h-screen w-full transition-colors duration-500 overflow-hidden", brandBg[activeBrand])}>
      {/* Ambient Mesh Graphics */}
      <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-50">
         {activeBrand === 'AntiGravity' ? (
           <MeshGradient
             className="w-full h-full absolute inset-0"
             colors={["#000000", "#1a1a1a", "#ff0000", "#ff5722"]}
             speed={1.0}
           />
         ) : activeBrand === 'Lovable' ? (
           <DotOrbit
             className="w-full h-full"
             speed={1.5}
           />
         ) : (
           <>
             <MeshGradient
               className="w-full h-full absolute inset-0"
               colors={["#000000", "#1a1a1a", "#ff0000", "#ffffff"]}
               speed={0.5}
             />
           </>
         )}
      </div>

      <Sidebar />
      
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          <div className="max-w-7xl mx-auto pb-32">
            <VoiceOrb />
            
            {/* View State Rendering */}
            <div className="mt-12 transition-opacity duration-300">
              {activeView === 'Events' && <EventDiscovery />}
              {activeView === 'Admin' && <TelemetryDashboard />}
              {activeView === 'Dashboard' && (
                <div className="text-center mt-20 text-white/40">
                  <p>Try saying "Show Events" or "Open Tickets"</p>
                </div>
              )}
            </div>
          </div>
        </main>
        
        <FloatingMascot />
      </div>
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
