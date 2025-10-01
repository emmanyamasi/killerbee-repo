import express from "express";


import { protect } from "../middlwares/auth/protect";
import { rdGuard } from "../middlwares/roleMiddlware";
import { addModel, deleteModel, getModels, updateModel } from "../controllers/modelsController";

const router = express.Router();

// R&D can add a model
router.post("/", protect, rdGuard, addModel);

// All logged-in users can view models
router.get("/", protect, getModels);

// R&D can update a model
router.put("/:id", protect, rdGuard, updateModel);

// R&D can delete a model
router.delete("/:id", protect, rdGuard, deleteModel);

export default router;
