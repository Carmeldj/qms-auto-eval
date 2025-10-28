import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
// import Header from '../components/Header';

const SubscriptionLayout: React.FC = () => {
  const { hasSubscription, checkSubscription } = useSubscription();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!isAuthenticated) {
        // let auth guard or modal handle login
        setChecking(false);
        return;
      }
      try {
        await checkSubscription();
      } finally {
        if (mounted) setChecking(false);
      }
    };

    if (!isAuthLoading) {
      void run();
    }

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, isAuthLoading, checkSubscription]);

  if (isAuthLoading || checking) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* <Header /> */}
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <svg
              className="animate-spin h-12 w-12 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              role="status"
              aria-label="Chargement"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <div className="text-center text-sm text-gray-700">Vérification de l'abonnement…</div>
          </div>
        </main>
      </div>
    );
  }

  // If user is authenticated but does not have subscription, redirect to subscribe
  if (isAuthenticated && !hasSubscription) {
    // avoid redirect loop if already on /subscribe
    if (location.pathname !== '/subscribe') {
      navigate('/subscribe');
      return null;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default SubscriptionLayout;
