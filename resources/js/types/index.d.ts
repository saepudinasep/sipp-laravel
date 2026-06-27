export interface User {
    id: number;
    email: string;
    role?: "admin" | "petugas" | "siswa" | string;
    is_active?: boolean;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
