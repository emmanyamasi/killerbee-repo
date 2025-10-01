import { Request, Response } from "express";
import pool from "../../config/db.config";
import asyncHandler from "../middlwares/asyncHandler";


// @desc    Add a new model (R&D only)
// @route   POST /api/v1/models
// @access  R&D
export const addModel = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, pUHT, range } = req.body;

  if (!name || !pUHT || !range) {
    res.status(400).json({ message: "Name, price (pUHT), and range are required" });
    return;
  }

  const result = await pool.query(
    `INSERT INTO models (name, description, pUHT, range) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, description, pUHT, range]
  );

  res.status(201).json(result.rows[0]);
});

// @desc    Get all models
// @route   GET /api/v1/models
// @access  All logged in users
export const getModels = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM models ORDER BY id ASC");
  res.json(result.rows);
});

// @desc    Update a model (R&D only)
// @route   PUT /api/v1/models/:id
// @access  R&D
export const updateModel = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, pUHT, range } = req.body;

  const result = await pool.query(
    `UPDATE models 
     SET name = $1, description = $2, pUHT = $3, range = $4
     WHERE id = $5
     RETURNING *`,
    [name, description, pUHT, range, id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ message: "Model not found" });
    return;
  }

  res.json(result.rows[0]);
});

// @desc    Delete a model (R&D only)
// @route   DELETE /api/v1/models/:id
// @access  R&D
export const deleteModel = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM models WHERE id = $1 RETURNING *",
    [id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ message: "Model not found" });
    return;
  }

  res.json({ message: "Model deleted", model: result.rows[0] });
});
