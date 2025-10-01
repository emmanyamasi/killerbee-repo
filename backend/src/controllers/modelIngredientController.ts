import { Request, Response } from "express";
import pool from "../../config/db.config";
import asyncHandler from "../middlwares/asyncHandler";

// @desc    Add ingredient to a model with weight (R&D only)
// @route   POST /api/v1/model-ingredients
// @access  R&D
export const addModelIngredient = asyncHandler(async (req: Request, res: Response) => {
  const { model_id, ingredient_id, weight } = req.body;

  if (!model_id || !ingredient_id || !weight) {
    res.status(400).json({ message: "model_id, ingredient_id, and weight are required" });
    return;
  }

  const result = await pool.query(
    `INSERT INTO model_ingredients (model_id, ingredient_id, weight)
     VALUES ($1, $2, $3)
     ON CONFLICT (model_id, ingredient_id) DO UPDATE SET weight = $3
     RETURNING *`,
    [model_id, ingredient_id, weight]
  );

  res.status(201).json(result.rows[0]);
});

// @desc    Get all ingredients for a specific model
// @route   GET /api/v1/model-ingredients/:modelId
// @access  Any logged in user
export const getModelIngredients = asyncHandler(async (req: Request, res: Response) => {
  const { modelId } = req.params;

  const result = await pool.query(
    `SELECT mi.model_id, i.id AS ingredient_id, i.name, i.description, mi.weight
     FROM model_ingredients mi
     JOIN ingredients i ON mi.ingredient_id = i.id
     WHERE mi.model_id = $1`,
    [modelId]
  );

  res.json(result.rows);
});

// @desc    Remove ingredient from a model (R&D only)
// @route   DELETE /api/v1/model-ingredients/:modelId/:ingredientId
// @access  R&D
export const deleteModelIngredient = asyncHandler(async (req: Request, res: Response) => {
  const { modelId, ingredientId } = req.params;

  const result = await pool.query(
    `DELETE FROM model_ingredients
     WHERE model_id = $1 AND ingredient_id = $2
     RETURNING *`,
    [modelId, ingredientId]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ message: "Ingredient not found for this model" });
    return;
  }

  res.json({ message: "Ingredient removed from model", data: result.rows[0] });
});
