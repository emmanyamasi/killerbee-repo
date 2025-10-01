import express from "express";

import { addProcess } from "../controllers/processesController";
import { getProcesses } from "../controllers/processesController";
import { validateProcess } from "../controllers/processesController";
import { executeProcess } from "../controllers/processesController";
import { deleteProcess } from "../controllers/processesController";
import { protect } from "../middlwares/auth/protect";
import { factoryGuard, rdGuard, testGuard } from "../middlwares/roleMiddlware";

const router = express.Router();

// R&D can add process steps
router.post("/", protect, rdGuard, addProcess);

// Any logged-in user can view processes for a model
router.get("/:modelId", protect, getProcesses);

// Test can validate a process
router.put("/:id/validate", protect, testGuard, validateProcess);

// Factory can execute a validated process
router.put("/:id/execute", protect, factoryGuard, executeProcess);

// R&D can delete a process
router.delete("/:id", protect, rdGuard, deleteProcess);

export default router;
