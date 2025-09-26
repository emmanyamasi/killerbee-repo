import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/authControllers";
import { adminGuard } from "../middlwares/roleMiddlware";
import { protect } from "../middlwares/auth/protect";

const router = express.Router();

// 🔒 Only Admin can create new employees

router.post("/admin-login", loginUser)
// 🌍 Public routes (accessible by everyone)
router.post("/login",loginUser);

router.post("/logout", protect,logoutUser);

export default router;
