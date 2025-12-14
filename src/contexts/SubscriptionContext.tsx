import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { subscriptionApi } from "../api/subscription";

interface SubscriptionContextType {
  hasSubscription: boolean;
  subscriptionPlan: string | null;
  isLoading: boolean;
  checkSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkSubscription = async () => {
    setIsLoading(true);
    try {
      const status = await subscriptionApi.checkSubscriptionStatus();
      // console.log(status);

      if (
        status?.subscriptionStatus === "active" ||
        status?.subscriptionStatus === "trial"
      ) {
        setHasSubscription(true);
        setSubscriptionPlan(status.plan || null);
      } else {
        setHasSubscription(false);
        setSubscriptionPlan(null);
      }
    } catch (err) {
      console.error("Failed to check subscription status", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  const value: SubscriptionContextType = {
    hasSubscription,
    subscriptionPlan,
    isLoading,
    checkSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// Custom hook to use the subscription context
export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};

export default SubscriptionContext;
