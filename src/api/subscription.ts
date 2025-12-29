import { api } from "../lib/axios";
import { supabase } from "../lib/supabase";

export type SubscriptionInfo = {
  subscriptionStatus?: string;
  isActive?: boolean;
  isMember?: boolean;
  plan: string;
};

export const subscriptionApi = {
  checkSubscriptionStatus: async (): Promise<SubscriptionInfo | null> => {
    const TENANT_ID = localStorage.getItem("tenantId");
    if (!TENANT_ID) {
      console.warn("subscriptionApi: tenantId missing in localStorage");
      return null;
    }

    try {
      // First, try to get subscription from Supabase
      const { data: subscription, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .maybeSingle();

      if (subscription && !error) {
        // Check if subscription is still valid
        const endDate = new Date(subscription.end_date);
        const now = new Date();
        const isValid = endDate > now;

        return {
          subscriptionStatus: isValid ? subscription.status : "expired",
          isActive: isValid && subscription.status === "active",
          isMember: isValid,
          plan: subscription.plan,
        };
      }

      // Fallback to external API if Supabase doesn't have the data
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
      if (!API_BASE_URL) {
        // No external API configured, return null
        return null;
      }

      const response = await api.get(`/tenants/${TENANT_ID}/subscription-info`);
      return response.data as SubscriptionInfo;
    } catch (err) {
      console.error("subscriptionApi.checkSubscriptionStatus failed", err);
      return null;
    }
  },
};
