import { useState, type JSX, type ReactNode } from "react";
import { AuthContext } from "./authContext";
import { authService } from "../services/authService";
import type { LoginCredentials, RegisterUserData, User } from "../types/User";

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const [loggedUser, setLoggedUser] = useState<User | null>(() =>
        authService.getLoggedUser(),
    );

    const register = (data: RegisterUserData): User => authService.register(data);

    const login = (credentials: LoginCredentials): User => {
        const user = authService.login(credentials);
        setLoggedUser(user);
        return user;
    };

    const logout = (): void => {
        authService.logout();
        setLoggedUser(null);
    };

    return (
        <AuthContext.Provider value={{ loggedUser, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
