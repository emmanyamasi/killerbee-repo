import { Request, Response } from "express";
import pool from "../../config/db.config";
import asyncHandler from "../middlwares/asyncHandler";


// @desc    Add a process step for a model (R&D only)
// @route   POST /api/v1/processes
export const addProcess = asyncHandler(async (req: Request, res: Response) => {
  const { model_id, step_number, description } = req.body;

  if (!model_id || !step_number || !description) {
    res.status(400).json({ message: "model_id, step_number and description are required" });
    return;
  }

  const result = await pool.query(
    `INSERT INTO processes (model_id, step_number, description, validated)
     VALUES ($1, $2, $3, FALSE)
     RETURNING *`,
    [model_id, step_number, description]
  );

  res.status(201).json(result.rows[0]);
});

// @desc    Get all processes for a model
// @route   GET /api/v1/processes/:modelId
export const getProcesses = asyncHandler(async (req: Request, res: Response) => {
  const { modelId } = req.params;

  const result = await pool.query(
    `SELECT * FROM processes WHERE model_id = $1 ORDER BY step_number ASC`,
    [modelId]
  );

  res.json(result.rows);
});

// @desc    Validate a process (Test only)
// @route   PUT /api/v1/processes/:id/validate
export const validateProcess = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query(
    `UPDATE processes SET validated = TRUE WHERE id = $1 RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ message: "Process not found" });
    return;
  }

  res.json({ message: "Process validated", process: result.rows[0] });
});

// @desc    Execute a validated process (Factory only)
// @route   PUT /api/v1/processes/:id/execute
export const executeProcess = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Ensure process is validated
  const processCheck = await pool.query(
    `SELECT * FROM processes WHERE id = $1 AND validated = TRUE`,
    [id]
  );

  if (processCheck.rows.length === 0) {
    res.status(400).json({ message: "Process not validated or not found" });
    return;
  }

  // Simulate execution (in real system, could log production batch etc.)
  res.json({ message: "Process executed successfully", process: processCheck.rows[0] });
});

// @desc    Delete a process (R&D only)
// @route   DELETE /api/v1/processes/:id
export const deleteProcess = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query(
    `DELETE FROM processes WHERE id = $1 RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ message: "Process not found" });
    return;
  }

  res.json({ message: "Process deleted", process: result.rows[0] });
});
