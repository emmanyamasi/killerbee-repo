import express from "express";
import { rdGuard } from "../middlwares/roleMiddlware";
import {
  addModelIngredient,
  getModelIngredients,
  deleteModelIngredient
} from "../controllers/modelIngredientController";
import { protect } from "../middlwares/auth/protect";

const router = express.Router();

// R&D can add or update ingredient weight for a model
router.post("/", protect, rdGuard, addModelIngredient);

// Anyone logged in can view ingredients of a model
router.get("/:modelId", protect, getModelIngredients);

// R&D can remove ingredient from a model
router.delete("/:modelId/:ingredientId", protect, rdGuard, deleteModelIngredient);

export default router;
