import { createContext, useContext, useState, type ReactNode } from "react";

export type Brand = "Vyntra";
export type View = "Dashboard" | "Admin" | "Search" | "Support" | "Chat";

export interface Citation {
  id: number;
  title: string;
  url: string;
  snippet: string;
}

interface AppContextType {
  activeBrand: Brand;
  setActiveBrand: (brand: Brand) => void;
  activeView: View;
  setActiveView: (view: View) => void;

  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;

  isGuest: boolean;
  setIsGuest: (val: boolean) => void;

  customerName: string;
  setCustomerName: (name: string) => void;

  activeOrder: any | null;
  setActiveOrder: (order: any | null) => void;

  tasks: string[];
  setTasks: (tasks: string[] | ((prev: string[]) => string[])) => void;

  citations: Citation[];
  setCitations: (citations: Citation[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeBrand, setActiveBrand] = useState<Brand>("Vyntra");
  const [activeView, setActiveView] = useState<View>("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [customerName, setCustomerName] = useState("Guest");
  const [activeOrder, setActiveOrder] = useState<any | null>(null);
  const [tasks, setTasks] = useState<string[]>([]);

  const [citations, setCitations] = useState<Citation[]>([]);

  return (
    <AppContext.Provider
      value={{
        activeBrand,
        setActiveBrand,
        activeView,
        setActiveView,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isGuest,
        setIsGuest,
        customerName,
        setCustomerName,
        activeOrder,
        setActiveOrder,

        tasks,
        setTasks,

        citations,
        setCitations,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
};
