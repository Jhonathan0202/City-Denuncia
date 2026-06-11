export type User = {
    id: string;
    name: string;
    phone: string;
    email: string;
    password: string;
    address: string;
    neighborhood: string;
    createdAt: string;
};

export type RegisterUserData = Omit<User, "id" | "createdAt">;

export type LoginCredentials = {
    email: string;
    password: string;
};

export type TokensService = {
    accessToken: string | null;
    refreshToken: string | null;
}

export const ACCESS_TOKEN_KEY: string = "access_token";

export const REFRESH_TOKEN_KEY: string = "refresh_token";
