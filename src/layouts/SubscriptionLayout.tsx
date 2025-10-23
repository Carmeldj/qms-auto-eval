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
          <div className="text-center">Vérification de l'abonnement...</div>
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
