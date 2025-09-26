import express from "express";
import { loginUser} from "../controllers/authControllers";
import { protect } from "../middlwares/auth/protect";
import { adminGuard } from "../middlwares/roleMiddlware";
import { registerEmployee } from "../controllers/employeeController";

const router = express.Router();

console.log("✅ Employee routes file loaded");

router.get("/debug", (req, res) => {
  res.json({ message: "Employee routes are working" });
});


// Admin-only: create employees

router.post("/",protect, adminGuard,registerEmployee);

router.get("/test", (req, res) => {
  res.json({ message: "Employee route is working" });
});


//router.post("/login",loginUser);
export default router;
