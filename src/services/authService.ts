import type { LoginCredentials, RegisterUserData, User } from "../types/User";

const USERS_STORAGE_KEY = "city-denuncia-users";
const LOGGED_USER_STORAGE_KEY = "loggedUser";

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const getStoredUsers = (): User[] => {
    if (typeof window === "undefined") {
        return [];
    }

    const storedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!storedUsers) {
        return [];
    }

    try {
        return JSON.parse(storedUsers) as User[];
    } catch {
        return [];
    }
};

const saveStoredUsers = (users: User[]): void => {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const authService = {
    getLoggedUser(): User | null {
        if (typeof window === "undefined") {
            return null;
        }

        const storedUser = window.localStorage.getItem(LOGGED_USER_STORAGE_KEY);
        if (!storedUser) {
            return null;
        }

        try {
            return JSON.parse(storedUser) as User;
        } catch {
            window.localStorage.removeItem(LOGGED_USER_STORAGE_KEY);
            return null;
        }
    },

    register(data: RegisterUserData): User {
        const users = getStoredUsers();
        const email = normalizeEmail(data.email);
        const userAlreadyExists = users.some(
            (user) => normalizeEmail(user.email) === email,
        );

        if (userAlreadyExists) {
            throw new Error("Ja existe uma conta cadastrada com este email.");
        }

        const newUser: User = {
            ...data,
            id: crypto.randomUUID(),
            email,
            createdAt: new Date().toISOString(),
        };

        saveStoredUsers([...users, newUser]);
        return newUser;
    },

    login(credentials: LoginCredentials): User {
        const email = normalizeEmail(credentials.email);
        const users = getStoredUsers();
        const user = users.find(
            (storedUser) =>
                normalizeEmail(storedUser.email) === email &&
                storedUser.password === credentials.password,
        );

        if (!user) {
            throw new Error("Email ou senha incorretos.");
        }

        window.localStorage.setItem(LOGGED_USER_STORAGE_KEY, JSON.stringify(user));
        return user;
    },

    logout(): void {
        if (typeof window === "undefined") {
            return;
        }

        window.localStorage.removeItem(LOGGED_USER_STORAGE_KEY);
    },
};
