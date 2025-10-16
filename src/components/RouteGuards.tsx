// src/components/RouteGuard.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

const PROTECTED_PREFIXES = [
    // '/assessment',
    // '/inspection',
    // '/results',
    // '/inspection-results',
    // '/documents',
    // '/procedures',
    // '/traceability',
    // '/pharmacovigilance',
    // '/ordonnancier',
    // '/swot'
    '/abc',
];

const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { openModal } = useApp();

    useEffect(() => {
        const path = location.pathname;
        const wantsProtected = PROTECTED_PREFIXES.some(prefix => path === prefix || path.startsWith(prefix + '/'));
        if (wantsProtected && !isAuthenticated) {
            navigate('/login')
            openModal('login');
        }
    }, [location.pathname, isAuthenticated, navigate]);

    return <>{children}</>;
};

export default RouteGuard;