import React, { createContext, useContext, useState, ReactNode } from "react";
import { ToastType, ToastVariant } from "../types";
import ToastNotification from "../components/ToastNotification";
import { v4 as uuidv4 } from 'uuid';

interface ToastContextProps {
  showToast: (message: string, variant: ToastVariant) => void;
}

interface ToastProviderProps {
  children: ReactNode;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<ToastType>>([]);

  const showToast = (message: string, variant: ToastVariant) => {
    const id = uuidv4();
    setToasts(prev => [...prev, { id, message, variant }]);
  };

  const removeToast = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastNotification toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};
