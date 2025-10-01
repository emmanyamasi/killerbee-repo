import express from "express";
import { protect } from "../middlwares/auth/protect";
import { getIngredients } from "../controllers/ingredientsController";
import { rdGuard } from "../middlwares/roleMiddlware";
import { addIngredient, updateIngredient, deleteIngredient } from "../controllers/ingredientsController";

const router = express.Router();

// R&D can add ingredient
router.post("/", protect, rdGuard, addIngredient);

// Any logged-in user can view ingredients
router.get("/", protect, getIngredients);

// R&D can update ingredient
router.put("/:id", protect, rdGuard, updateIngredient);

// R&D can delete ingredient
router.delete("/:id", protect, rdGuard, deleteIngredient);

export default router;
