import { Request, Response, NextFunction } from "express";

import asyncHandler from "../middlwares/asyncHandler";
import { generateToken } from "../utils/helpers/generatoken";
import pool from "../../config/db.config";

// Admin-only signup (create employee accounts)
export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role_id } = req.body;

    // Check if user exists
    const userExists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
        res.status(400).json({ message: "User already exists" });
        return;
    }



    // Insert user
    const newUser = await pool.query(
        "INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role_id",
        [name, email,password, role_id]
    );

    // ❌ Do NOT auto-login employee (no token generation here)

    res.status(201).json({
        message: " account created successfully",
        user: newUser.rows[0],
    });
});





// (and Admin) login
export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, password } = req.body;

    const userQuery = await pool.query(
        `SELECT users.id, users.name, users.email, users.password, users.role_id, roles.role_name
         FROM users
         JOIN roles ON users.role_id = roles.role_id
         WHERE name = $1`,
        [name]
    );

    if (userQuery.rows.length === 0) {
        res.status(401).json({ message: "Invalid username or password" });
        return;
    }

    const user = userQuery.rows[0];

    // Compare password (⚠️ not hashed here)
    if (password !== user.password) {
        res.status(401).json({ message: "Invalid username or password" });
        return;
    }

    // Generate JWTs (cookies + return token)
    const { accessToken } = generateToken(res, user.id, user.role_id);

    res.status(200).json({
        message: "Login successful",
        accessToken,   // 👈 send token in body
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role_id: user.role_id,
            role_name: user.role_name,
        },
    });
});

// Logout
export const logoutUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("access_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        expires: new Date(0),
    });

    res.cookie("refresh_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        expires: new Date(0),
    });

    res.status(200).json({ message: "User logged out successfully" });
});
