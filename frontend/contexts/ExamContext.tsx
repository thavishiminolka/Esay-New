import React, { createContext, useContext, useState, ReactNode } from "react";

interface ExamContextType {
  examId: string | null;
  setExamId: (id: string | null) => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [examId, setExamId] = useState<string | null>(null);

  return (
    <ExamContext.Provider value={{ examId, setExamId }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExamContext = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExamContext must be used within an ExamProvider");
  }
  return context;
};
