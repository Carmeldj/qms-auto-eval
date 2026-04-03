import { User } from "../types/user";
import { DEMO_CREDENTIALS, DEMO_USER, DEMO_ACCESS_TOKEN } from "../data/demoAccount";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  accessToken: string;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const login = async (
  credentials: LoginCredentials
): Promise<User | undefined> => {
  try {
    // Check for demo account first
    if (
      credentials.email === DEMO_CREDENTIALS.email &&
      credentials.password === DEMO_CREDENTIALS.password
    ) {
      // Demo account login
      localStorage.setItem("tenantId", DEMO_USER.tenantId);
      localStorage.setItem("accessToken", DEMO_ACCESS_TOKEN);
      localStorage.setItem("user", JSON.stringify(DEMO_USER));
      return DEMO_USER;
    }

    // If not demo account, try regular API login
    if (!API_BASE_URL) {
      throw new Error("API URL not configured");
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Login failed");
    }
    const data = await response.json();
    // persist auth pieces so app can rehydrate on refresh
    localStorage.setItem("tenantId", data.user.tenantId);
    localStorage.setItem("accessToken", data.accessToken);
    try {
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch {}

    return data.user;
  } catch (e) {
    console.error(e);
  }
};
