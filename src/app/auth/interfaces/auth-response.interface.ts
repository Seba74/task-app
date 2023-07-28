import { User } from "./user.interface";

export interface AuthResponse {
    ok: boolean;
    user: User;
    token: string;
    message: string;
}

export interface AuthTokenStatus {
    ok: boolean;
    token: string;
}