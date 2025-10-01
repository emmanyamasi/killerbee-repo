import { Request, Response, NextFunction } from "express";
import { RoleRequest } from "../utils/types/userRoles";
import asyncHandler from "./asyncHandler";



// Generic role guard
export const roleGuard = (allowedRoles: string[]) =>
  asyncHandler<void, RoleRequest>(async (req: RoleRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role_name)) {
      res.status(403).json({ message: "Access denied: Insufficient permissions" });
      return;
    }
    next();
  });

// KillerBee specific guards
export const adminGuard   = roleGuard(["Admin"]);            // Manage users
export const rdGuard      = roleGuard(["R&D"]);   // Design processes
export const testGuard    = roleGuard(["Test"]);  // Validate tests
export const factoryGuard = roleGuard(["Factory"]);  