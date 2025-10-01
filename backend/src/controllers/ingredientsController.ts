import { Request, Response } from "express";
import pool from "../../config/db.config";
import asyncHandler from "../middlwares/asyncHandler";


// @desc    Add new ingredient (R&D only)
// @route   POST /api/v1/ingredients
// @access  R&D
export const addIngredient = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400).json({ message: "Ingredient name is required" });
    return;
  }

  const result = await pool.query(
    "INSERT INTO ingredients (name, description) VALUES ($1, $2) RETURNING *",
    [name, description]
  );

  res.status(201).json(result.rows[0]);
});

// @desc    Get all ingredients
// @route   GET /api/v1/ingredients
// @access  Any logged in user
export const getIngredients = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM ingredients ORDER BY id ASC");
  res.json(result.rows);
});

// @desc    Update ingredient (R&D only)
// @route   PUT /api/v1/ingredients/:id
// @access  R&D
export const updateIngredient = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const result = await pool.query(
    "UPDATE ingredients SET name = $1, description = $2 WHERE id = $3 RETURNING *",
    [name, description, id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ message: "Ingredient not found" });
    return;
  }

  res.json(result.rows[0]);
});

// @desc    Delete ingredient (R&D only)
// @route   DELETE /api/v1/ingredients/:id
// @access  R&D
export const deleteIngredient = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM ingredients WHERE id = $1 RETURNING *",
    [id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ message: "Ingredient not found" });
    return;
  }

  res.json({ message: "Ingredient deleted", ingredient: result.rows[0] });
});
