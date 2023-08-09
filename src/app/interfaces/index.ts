import { User } from "../auth/interfaces";

export interface DataResponse {
    ok: boolean;
    message: string;
    data: any;
}

export interface ITask {
    _id: string;
    title: string;
    description: string;
    idDate: string;
    deadline: string;
    is_completed: boolean;
    is_expired: boolean;
    priority: IPriority;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateTask {
    title: string;
    description: string;
    idDate: string;
    deadline: string;
    idPriority: string;
    idUser: string;
}

export interface IPriority {
    _id: string;
    name: string;
    level: number;
    color: string;
    color_code: string;
    createdAt: Date;
    updatedAt: Date;
}