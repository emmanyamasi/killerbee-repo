import express from "express";
import { loginUser, registerUser } from "../controllers/authControllers";
import { protect } from "../middlwares/auth/protect";
import { adminGuard } from "../middlwares/roleMiddlware";

const router = express.Router();

// Admin-only: create employees

router.post("/register",protect, adminGuard,registerUser);
router.post("/login",loginUser);
export default router;
