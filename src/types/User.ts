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
