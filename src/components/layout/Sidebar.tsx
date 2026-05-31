import { LayoutDashboard, Settings2, Activity } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAppContext, type View } from "../../context/AppContext";

export const Sidebar = () => {
  const { activeBrand, activeView, setActiveView } = useAppContext();

  const brandColors = {
    AntiGravity: "text-primary",
    Lovable: "text-accent-pink",
    Stitch: "text-accent-green",
  };

  const navItems: { label: string; icon: React.ReactNode; view: View }[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      view: "Dashboard",
    },
    { label: "Event Discovery", icon: <Activity size={20} />, view: "Events" },
    { label: "Admin Insights", icon: <Settings2 size={20} />, view: "Admin" },
  ];

  return (
    <div className="w-64 h-screen bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col justify-between transition-colors duration-500 z-10 shrink-0">
      <div>
        <div className="flex items-center gap-3 mb-12">
          <div
            className={cn(
              "w-8 h-8 rounded-full bg-current opacity-20",
              brandColors[activeBrand],
            )}
          />
          <h1 className="text-xl font-bold tracking-tight">
            Vibrant Voice Hub
          </h1>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveView(item.view)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                activeView === item.view
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5",
              )}
            >
              <span
                className={
                  activeView === item.view ? brandColors[activeBrand] : ""
                }
              >
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
        <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse-fast" />
        <span className="text-sm font-medium text-white/70">
          System Node: Ready
        </span>
      </div>
    </div>
  );
};
