import { Menu } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export const Header = () => {
  const { activeBrand, activeView, isMobileMenuOpen, setIsMobileMenuOpen } = useAppContext();

  return (
    <header className="h-20 w-full bg-transparent border-b border-white/5 flex items-center justify-between px-8 z-10">
      <div className="flex items-center gap-2 text-white/60">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mr-2 md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
        >
          <Menu size={20} />
        </button>
        <span className="font-medium hover:text-white transition-colors cursor-pointer">
          {activeBrand}
        </span>
        <span>/</span>
        <span className="font-medium text-white">{activeView}</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Removed static XP and Profile tag */}
      </div>
    </header>
  );
};
