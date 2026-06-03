import { Home, MessageSquare, Accessibility, User, LogOut, Bell } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAppContext, type View } from "../../context/AppContext";
import { LiquidButton } from "../ui/liquid-glass-button";
import { ButtonColorful } from "../ui/button-colorful";
import { useVoiceContext } from "../../context/VoiceContext";

export const Sidebar = () => {
  const { activeView, setActiveView, isMobileMenuOpen, setIsMobileMenuOpen } = useAppContext();
  const { userSentiment } = useVoiceContext();

  const sentimentColors: Record<string, string> = {
    Positive: "bg-green-500",
    Neutral: "bg-blue-400",
    Frustrated: "bg-red-500",
    Unknown: "bg-white/30",
  };

  const navItems: { label: string; icon: React.ReactNode; view: View }[] = [
    { label: "Dashboard", icon: <Home size={20} />, view: "Dashboard" },
    { label: "Ask Aura", icon: <MessageSquare size={20} />, view: "Chat" },
    { label: "Reminders", icon: <Bell size={20} />, view: "Support" },
    { label: "Accessibility", icon: <Accessibility size={20} />, view: "Accessibility" },
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
          {/* Logo + Sentiment Dot */}
          <div className="flex items-center gap-3 mb-12">
            <h1 className="text-xl font-bold tracking-tight text-white/90">Vyntra</h1>
            <div className="flex items-center gap-1.5 ml-auto">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", sentimentColors[userSentiment] || "bg-white/30")} />
              <span className="text-white/40 text-xs">{userSentiment}</span>
            </div>
          </div>

          <nav className="space-y-3">
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
                    : "opacity-60 hover:opacity-100 text-white/80"
                )}
                variant="default"
                size="lg"
              >
                <span className={activeView === item.view ? "text-primary" : ""}>
                  {item.icon}
                </span>
                <span className="font-medium text-inherit">{item.label}</span>
              </LiquidButton>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <ButtonColorful
            onClick={() => {
              setActiveView("Profile");
              setIsMobileMenuOpen(false);
            }}
            className="w-full rounded-xl"
            label="Profile"
            icon={<User size={16} className="text-white/90" />}
          />

          <ButtonColorful
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="w-full rounded-xl"
            label="Log Out"
            icon={<LogOut size={16} className="text-white/90" />}
          />
        </div>
      </div>
    </>
  );
};
