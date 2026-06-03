import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Brand = "Vyntra";
export type View = "Dashboard" | "Search" | "Support" | "Chat" | "Accessibility" | "Profile";

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

  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  textSize: number;
  setTextSize: (val: number) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  focusMode: boolean;
  setFocusMode: (val: boolean) => void;

  hasSelectedInterests: boolean;
  setHasSelectedInterests: (val: boolean) => void;
  selectedInterests: string[];
  setSelectedInterests: (val: string[]) => void;

  discountCode: { code: string; percentage: number; reason: string } | null;
  setDiscountCode: (val: { code: string; percentage: number; reason: string } | null) => void;

  voiceLang: string;
  setVoiceLang: (lang: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeBrand, setActiveBrand] = useState<Brand>("Vyntra");
  const [activeView, setActiveView] = useState<View>("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [customerName, setCustomerName] = useState(() => localStorage.getItem("customerName") || "Guest");
  const [activeOrder, setActiveOrder] = useState<any | null>(null);
  const [tasks, setTasks] = useState<string[]>([]);

  const [citations, setCitations] = useState<Citation[]>([]);

  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState(3);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  const [hasSelectedInterests, setHasSelectedInterests] = useState(() => localStorage.getItem("hasSelectedInterests") === "true");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [discountCode, setDiscountCode] = useState<{ code: string; percentage: number; reason: string } | null>(null);
  const [voiceLang, setVoiceLang] = useState("en-US");

  useEffect(() => {
    localStorage.setItem("customerName", customerName);
  }, [customerName]);

  useEffect(() => {
    localStorage.setItem("hasSelectedInterests", hasSelectedInterests.toString());
  }, [hasSelectedInterests]);

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
        
        highContrast,
        setHighContrast,
        textSize,
        setTextSize,
        reducedMotion,
        setReducedMotion,
        focusMode,
        setFocusMode,

        hasSelectedInterests,
        setHasSelectedInterests,
        selectedInterests,
        setSelectedInterests,

        discountCode,
        setDiscountCode,

        voiceLang,
        setVoiceLang,
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
