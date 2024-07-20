import React, { createContext, useContext, useState } from 'react';

type SheetContextType = {
  activeSheet: string | null;
  setActiveSheet: (sheetName: string | null) => void;
};

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export const SheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSheet, setActiveSheet] = useState<string | null>(null);

  return (
    <SheetContext.Provider value={{ activeSheet, setActiveSheet }}>
      {children}
    </SheetContext.Provider>
  );
};

export const useSheet = (): SheetContextType => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('useSheet must be used within a SheetProvider');
  }
  return context;
};
