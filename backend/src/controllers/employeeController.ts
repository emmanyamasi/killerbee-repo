
import { Request, Response, NextFunction } from "express";

import asyncHandler from "../middlwares/asyncHandler";
import { generateToken } from "../utils/helpers/generatoken";
import pool from "../../config/db.config";



export const registerEmployee = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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