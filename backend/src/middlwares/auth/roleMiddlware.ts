import { Request, Response, NextFunction } from "express";
import asyncHandler from "../asyncHandler";
import { RoleRequest } from "../../utils/types/userRoles";


// Generic role guard
export const roleGuard = (allowedRoles: string[]) =>
  asyncHandler<void, RoleRequest>(async (req: RoleRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role_name)) {
      res.status(403).json({ message: "Access denied: Insufficient permissions" });
      return;
    }
    next();
  });

// Specific guards for KillerBee app
export const adminGuard = roleGuard(["Admin"]);        // Full control
export const rdGuard = roleGuard(["R&D"]);             // R&D role
export const factoryGuard = roleGuard(["Factory"]);    // Factory role
export const testerGuard = roleGuard(["Tester"]);      // Tester role
