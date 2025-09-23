import { User } from "../types/user";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  accessToken: string;
};
export const login = async (
  credentials: LoginCredentials
): Promise<User | undefined> => {
  try {
    const response = await fetch(`${process.env.VITE_API_URL}/auth/login`, {
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

    localStorage.setItem("tenantId", data.user.tenantId);
    localStorage.setItem("accessToken", data.accessToken);

    return data.user;
  } catch (e) {
    console.error(e);
  }
};
