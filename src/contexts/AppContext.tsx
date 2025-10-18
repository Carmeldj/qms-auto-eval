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
            {modalName === 'clearAll' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black opacity-40" onClick={closeModal} />
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full z-10 p-6">
                        <h2 className="text-lg font-semibold mb-3">Confirmer la suppression</h2>
                        <p className="text-sm text-gray-600 mb-4">Voulez-vous vraiment effacer toutes les réponses de l'opération ? Cette action est irréversible.</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 rounded-md bg-gray-100 text-gray-700"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => {
                                    try {
                                        modalProps?.onConfirm?.();
                                    } finally {
                                        closeModal();
                                    }
                                }}
                                className="px-4 py-2 rounded-md bg-red-600 text-white"
                            >
                                Effacer
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
