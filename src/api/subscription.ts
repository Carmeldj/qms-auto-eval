import { api } from "../lib/axios";

export type SubscriptionInfo = {
  subscriptionStatus?: string;
};

export const subscriptionApi = {
  checkSubscriptionStatus: async (): Promise<SubscriptionInfo | null> => {
    const TENANT_ID = localStorage.getItem("tenantId");
    if (!TENANT_ID) {
      console.warn('subscriptionApi: tenantId missing in localStorage');
      return null;
    }

    try {
      const response = await api.get(`/tenants/${TENANT_ID}/subscription-info`);
      return response.data as SubscriptionInfo;
    } catch (err) {
      // Optionally inspect err.response.status and return structured info
      console.error('subscriptionApi.checkSubscriptionStatus failed', err);
      throw err; // or return null if you prefer callers to continue
    }
  },
};