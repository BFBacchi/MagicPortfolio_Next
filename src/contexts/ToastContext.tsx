"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { createPortal } from 'react-dom';
import { Dialog, Button, Text } from "@once-ui-system/core";

type ToastVariant = "success" | "danger";

interface Toast {
  id: string;
  variant: ToastVariant;
  message: ReactNode;
  action?: ReactNode;
}

interface ToastContextType {
  addToast: (message: string, variant?: ToastVariant, action?: ReactNode) => void;
  removeToast: (id: string) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | null>(null);

// Componente de Toast usando los componentes de OnceUI
const Toast = ({ message, variant, onClose }: { message: ReactNode, variant: ToastVariant, onClose: () => void }) => {
  return (
    <div className={`flex items-center justify-between p-4 rounded-md shadow-lg ${
      variant === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white min-w-[250px] max-w-md`}>
      <Text className="text-white">{message}</Text>
      <Button 
        variant="tertiary" 
        size="s" 
        onClick={onClose}
        className="text-white hover:bg-white/20"
      >
        ×
      </Button>
    </div>
  );
};

const ToastContainer = ({ toasts, onClose }: { toasts: Toast[], onClose: (id: string) => void }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  );
};

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    // Create a container for the toasts
    const toastContainer = document.createElement('div');
    document.body.appendChild(toastContainer);
    setContainer(toastContainer);

    return () => {
      document.body.removeChild(toastContainer);
    };
  }, []);

  const addToast = useCallback((message: string, variant: ToastVariant = 'success', action?: ReactNode) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, variant, action };
    
    setToasts(prevToasts => [...prevToasts, newToast]);
    
    // Auto-remove toast after 5 seconds
    const timer = setTimeout(() => {
      removeToast(id);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const contextValue = {
    addToast,
    removeToast,
    toasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {mounted && container && createPortal(
        <ToastContainer toasts={toasts} onClose={removeToast} />,
        container
      )}
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export { ToastProvider, useToast };
