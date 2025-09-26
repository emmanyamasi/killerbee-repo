import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../../../config/db.config";
import { UserRequest } from "../../utils/types/userTypes";
import asyncHandler from "../asyncHandler";

// Auth middleware to protect routes
export const protect = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    let token;

    // Try to get token from Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Get the token from cookies if not in header
    if (!token && req.cookies?.access_token) {
      token = req.cookies.access_token;
    }

    // If no token found
    if (!token) {
      res.status(401).json({ message: "Not authorized, no token" });
      return;
    }

    try {
      if (!process.env.JWT_SECRET) {
        throw new Error(
          "JWT_SECRET is not defined in environment variables"
        );
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: string;
        roleId: number;
      };

      // ✅ Correct query for your schema
      const userQuery = await pool.query(
        `SELECT users.id, users.name, users.email, users.role_id, roles.role_name
         FROM users
         JOIN roles ON users.role_id = roles.role_id
         WHERE users.id = $1`,
        [decoded.userId]
      );

      if (userQuery.rows.length === 0) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      // Attach the user to the request
      req.user = userQuery.rows[0];

      next(); // proceed
    } catch (error) {
      console.error("JWT Error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
);
