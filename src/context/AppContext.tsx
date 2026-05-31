import { createContext, useContext, useState, type ReactNode } from 'react';

export type Brand = 'AntiGravity' | 'Lovable' | 'Stitch';
export type View = 'Dashboard' | 'Events' | 'Tickets' | 'Admin';

interface AppContextType {
  activeBrand: Brand;
  setActiveBrand: (brand: Brand) => void;
  activeView: View;
  setActiveView: (view: View) => void;
  experienceCredits: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeBrand, setActiveBrand] = useState<Brand>('AntiGravity');
  const [activeView, setActiveView] = useState<View>('Dashboard');
  const [experienceCredits] = useState(14500); // Mock credits

  return (
    <AppContext.Provider
      value={{
        activeBrand,
        setActiveBrand,
        activeView,
        setActiveView,
        experienceCredits
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
