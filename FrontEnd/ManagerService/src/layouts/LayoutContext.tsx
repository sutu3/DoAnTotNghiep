import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface LayoutContextType {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }

  return context;
};

interface LayoutProviderProps {
  children: ReactNode;
  initialCollapsed: boolean;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({
  children,
  initialCollapsed,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(initialCollapsed);

  // const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  return (
    <LayoutContext.Provider
      value={{ isSidebarCollapsed, setIsSidebarCollapsed /*, toggleSidebar */ }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
