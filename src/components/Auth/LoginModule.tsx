import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const LoginModule: React.FC = () => {
    const navigate = useNavigate();

    const { openModal } = useApp();
    return (
        <div className="h-max flex flex-col items-center justify-center p-8 bg-white rounded-lg">
            <div className="max-w-md w-full border border-teal-200 bg-white shadow-lg rounded-xl p-8 flex flex-col items-center space-y-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 mb-2">
                    <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 2c-2.67 0-8 1.337-8 4v2a1 1 0 001 1h14a1 1 0 001-1v-2c0-2.663-5.33-4-8-4z" />
                    </svg>
                </div>
                <p className="text-xl font-bold text-gray-900 text-center">
                    Connexion requise
                </p>
                <p className="text-base text-gray-600 text-center">
                    Pour accéder à cette fonctionnalité, veuillez vous connecter à votre compte.
                    La connexion vous permet de profiter pleinement de nos services et de garantir la sécurité de vos informations.
                </p>
                <div className="flex flex-col md:flex-row w-full gap-4 mt-4">
                    <button
                        className="flex-1 px-4 py-2 rounded-lg font-medium text-teal-700 border border-teal-600 bg-white hover:bg-teal-50 transition"
                        onClick={() => navigate("/")}
                    >
                        Retour à l'accueil
                    </button>
                    <button
                        className="flex-1 px-4 py-2 rounded-lg font-medium text-white bg-teal-600 hover:bg-teal-700 transition"
                        onClick={(e) => {
                            openModal('login');
                        }}
                    >
                        Se connecter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModule;