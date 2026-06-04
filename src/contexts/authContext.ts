import { createContext } from "react";
import type { LoginCredentials, RegisterUserData, User } from "../types/User";

export type AuthContextValue = {
    loggedUser: User | null;
    register: (data: RegisterUserData) => User;
    login: (credentials: LoginCredentials) => User;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
