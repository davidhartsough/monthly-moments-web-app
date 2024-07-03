import { createContext, useContext } from "react";

export interface UserData {
  uid: string;
  id: string | null;
  name: string | null;
  displayName: string | null;
  email: string | null;
  data: Record<string, string | string[]> | null;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within the AuthProvider");
  }
  return context;
};
