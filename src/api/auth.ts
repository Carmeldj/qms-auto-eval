import { User } from "../types/user";
import { DEMO_CREDENTIALS, DEMO_USER, DEMO_ACCESS_TOKEN } from "../data/demoAccount";
import { supabase } from "../lib/supabase";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignUpData = {
  email: string;
  password: string;
  fullName: string;
  pharmacyName?: string;
  pharmacyInitials?: string;
};

export type LoginResponse = {
  user: User;
  accessToken: string;
};

export const login = async (
  credentials: LoginCredentials
): Promise<User | undefined> => {
  try {
    if (
      credentials.email === DEMO_CREDENTIALS.email &&
      credentials.password === DEMO_CREDENTIALS.password
    ) {
      localStorage.setItem("tenantId", DEMO_USER.tenantId);
      localStorage.setItem("accessToken", DEMO_ACCESS_TOKEN);
      localStorage.setItem("user", JSON.stringify(DEMO_USER));
      return DEMO_USER;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Connexion échouée");
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      throw new Error("Profil utilisateur introuvable");
    }

    const user: User = {
      id: data.user.id,
      email: profile.email,
      fullName: profile.full_name,
      tenantId: profile.tenant_id,
      pharmacyName: profile.pharmacy_name,
      pharmacyInitials: profile.pharmacy_initials,
    };

    localStorage.setItem("tenantId", user.tenantId);
    localStorage.setItem("accessToken", data.session?.access_token || "");
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (e) {
    console.error("Erreur de connexion:", e);
    throw e;
  }
};

export const signUp = async (signUpData: SignUpData): Promise<User> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: signUpData.email,
      password: signUpData.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Erreur lors de la création du compte");
    }

    const tenantId = `tenant_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        id: data.user.id,
        email: signUpData.email,
        full_name: signUpData.fullName,
        pharmacy_name: signUpData.pharmacyName,
        pharmacy_initials: signUpData.pharmacyInitials,
        tenant_id: tenantId,
      });

    if (profileError) {
      throw new Error("Erreur lors de la création du profil: " + profileError.message);
    }

    const user: User = {
      id: data.user.id,
      email: signUpData.email,
      fullName: signUpData.fullName,
      tenantId: tenantId,
      pharmacyName: signUpData.pharmacyName,
      pharmacyInitials: signUpData.pharmacyInitials,
    };

    localStorage.setItem("tenantId", user.tenantId);
    localStorage.setItem("accessToken", data.session?.access_token || "");
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (e) {
    console.error("Erreur d'inscription:", e);
    throw e;
  }
};

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
  localStorage.removeItem("tenantId");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};
