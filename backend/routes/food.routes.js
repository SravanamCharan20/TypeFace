// routes/foodRoutes.js
import express from "express";
import { aggrePractice, createFood, getSimilarPreview, searchFoods } from "../controllers/food.controller.js";

const router = express.Router();

router.post("/", createFood);             // Insert & create embedding
router.post("/similar", getSimilarPreview); // Preview similar (no save)
router.get("/search", searchFoods);  
router.get('/aggregration',aggrePractice)     // Search existing items

export default router;