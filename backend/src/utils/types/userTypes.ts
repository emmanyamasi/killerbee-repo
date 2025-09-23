import { Request } from "express";

/**
 * User type defining structure of a user record in PostgreSQL
 */
export interface User {
    id: number;            // number instead of string
    name: string;
    email: string;
    password?: string;     // Exclude password when returning user info
    role_id: number;
    role_name: string;
    created_at?: Date;
    updated_at?: Date;
}

/**
 * Custom Express Request Type to include `user` object
 */
export interface UserRequest extends Request {
    user?: User;
}
