import { Role } from "./role.interface";

export interface User {
    idUser: number;
    username: string;
    name: string;
    surname: string;
    email: string;
    idRole: number;
    role: Role;
}