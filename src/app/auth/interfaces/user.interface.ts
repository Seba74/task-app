import { Role } from "./role.interface";

export interface User {
    _id: string;
    name: string;
    lastName: string;
    username: string;
    email: string;
    role: Role;
}