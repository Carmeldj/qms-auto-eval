import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LoginModal } from '../components/Auth/login';

interface AppContextType {
  modalName: string | null;
  modalProps?: any;
  openModal: (name: string, props?: any) => void;
  closeModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};

interface AppProviderProps { children: ReactNode }

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [modalName, setModalName] = useState<string | null>(null);
  const [modalProps, setModalProps] = useState<any>(undefined);

  const openModal = (name: string, props?: any) => {
    setModalName(name);
    setModalProps(props);
  };

  const closeModal = () => {
    setModalName(null);
    setModalProps(undefined);
  };

  return (
    <AppContext.Provider value={{ modalName, modalProps, openModal, closeModal }}>
      {/* render known app-level modals here */}
      {modalName === 'login' && (
        <LoginModal isOpen={true} onClose={closeModal} {...modalProps} />
      )}
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
