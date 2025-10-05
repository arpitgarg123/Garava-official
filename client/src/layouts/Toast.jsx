import React, { createContext, useContext } from 'react';
import { useToast } from '../components/ToastMessage';
import ToastMessage from '../components/ToastMessage';

const ToastContext = createContext();

export const ToastProvider = ({ children, position = 'top-right' }) => {
  const toastMethods = useToast();

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      <ToastMessage position={position} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};