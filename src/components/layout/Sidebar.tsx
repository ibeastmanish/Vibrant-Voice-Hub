import { Home, Shield, MessageSquare, Activity, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAppContext, type View } from "../../context/AppContext";
import { LiquidButton } from "../ui/liquid-glass-button";

export const Sidebar = () => {
  const { activeBrand, activeView, setActiveView, isMobileMenuOpen, setIsMobileMenuOpen } = useAppContext();

  const brandColors = {
    Vyntra: "text-primary",
    Lovable: "text-accent-pink",
    Stitch: "text-accent-green",
  };

  const navItems: { label: string; icon: React.ReactNode; view: View }[] = [
    { label: "Dashboard", icon: <Home size={20} />, view: "Dashboard" },
    { label: "Agentic Support", icon: <Shield size={20} />, view: "Support" },
    { label: "Chat Assistant", icon: <MessageSquare size={20} />, view: "Chat" },
    { label: "Telemetry", icon: <Activity size={20} />, view: "Admin" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <div 
        className={cn(
          "w-64 h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col justify-between transition-transform duration-300 z-50 shrink-0",
          "fixed md:relative inset-y-0 left-0 transform",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div>
        <div className="flex items-center gap-3 mb-12">
          <h1 className="text-xl font-bold tracking-tight text-white/90">
            Vyntra
          </h1>
        </div>

        <nav className="space-y-4">
          {navItems.map((item) => (
            <LiquidButton
              key={item.label}
              onClick={() => {
                setActiveView(item.view);
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "w-full rounded-2xl flex items-center justify-start gap-3 px-4 py-3 transition-all duration-300",
                activeView === item.view
                  ? "opacity-100 text-white"
                  : "opacity-70 hover:opacity-100 text-white/80"
              )}
              variant="default"
              size="lg"
            >
              <span
                className={
                  activeView === item.view ? brandColors[activeBrand] : ""
                }
              >
                {item.icon}
              </span>
              <span className="font-medium text-inherit">{item.label}</span>
            </LiquidButton>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        <LiquidButton
          onClick={() => window.location.reload()}
          className="w-full rounded-xl flex items-center justify-start gap-3 px-4 py-3 opacity-70 hover:opacity-100 text-white/80 transition-all duration-300"
          variant="default"
          size="lg"
        >
          <span className="text-red-400">
            <LogOut size={20} />
          </span>
          <span className="font-medium text-inherit">Log Out</span>
        </LiquidButton>

        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
          <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse-fast" />
          <span className="text-sm font-medium text-white/70">
            System Node: Ready
          </span>
        </div>
      </div>
    </div>
    </>
  );
};
