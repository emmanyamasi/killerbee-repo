import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../../../config/db.config";
import { UserRequest } from "../../utils/types/userTypes";
import asyncHandler from "../asyncHandler";

// Auth middleware to protect routes
export const protect = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    let token;

    // 1. Try to get token from Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. Get the token from cookies if not in header
    if (!token && req.cookies?.access_token) {
      token = req.cookies.access_token;
    }

    // 3. If no token found
    if (!token) {
      console.warn("❌ No token provided");
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
      // 4. Check secret exists
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }

      console.log("🔑 Incoming Token:", token);

      // 5. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: string;
        roleId: number;
        iat: number;
        exp: number;
      };

      console.log("✅ Decoded Payload:", decoded);

      // 6. Get user from DB
      const userQuery = await pool.query(
        `SELECT users.id, users.name, users.email, users.role_id, roles.role_name
         FROM users
         JOIN roles ON users.role_id = roles.role_id
         WHERE users.id = $1`,
        [decoded.userId]
      );

      if (userQuery.rows.length === 0) {
        console.warn("❌ User not found in DB for ID:", decoded.userId);
        return res.status(401).json({ message: "User not found" });
      }

      // 7. Attach user to req
      req.user = userQuery.rows[0];
      console.log("✅ Authenticated User:", req.user);

      next(); // proceed
    } catch (error: any) {
      console.error("❌ JWT Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
);
