import { useAppContext } from "../../context/AppContext";

export const Header = () => {
  const { activeBrand, activeView } = useAppContext();

  return (
    <header className="h-20 w-full bg-transparent border-b border-white/5 flex items-center justify-between px-8 z-10">
      <div className="flex items-center gap-2 text-white/60">
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
