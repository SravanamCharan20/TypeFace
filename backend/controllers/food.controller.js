// controllers/foodController.js
import fooddetailsModel from "../models/fooddetails.model.js";
import { embedText, normalizeVector } from "../services/embedding.js";
import mongoose from "mongoose";

const VECTOR_INDEX_NAME = process.env.VECTOR_INDEX_NAME || "default";

export async function createFood(req, res) {
    try {
      const { foodname, desc, ExpiryDate } = req.body;
      console.log({ foodname, desc, ExpiryDate });
      if (!foodname || !desc || !ExpiryDate) {
        return res.status(400).json({ message: "Missing fields" });
      }
  
      const vector = await embedText(`${foodname} ${desc}`);
      const normalized = normalizeVector(vector);
  
      const food = await fooddetailsModel.create({
        foodname,
        desc,
        ExpiryDate,
        embedding: normalized,
      });
  
      res.status(201).json(food);
    } catch (err) {
      console.error("createFood error", err);
      res.status(500).json({ message: err.message });
    }
  }

// POST preview similar without saving
export async function getSimilarPreview(req, res) {
  try {
    const { foodname, desc, k = 5 } = req.body;
    if (!foodname && !desc) return res.status(400).json({ message: "Provide foodname or desc" });

    const raw = await embedText(`${foodname || ""} ${desc || ""}`);
    const qvec = normalizeVector(raw);
    console.log("Query vector length:", qvec.length);
    const pipeline = [
        {
          $vectorSearch: {
            index: VECTOR_INDEX_NAME,
            queryVector: qvec,  // or { vector: qvec, path: "embedding" } for older syntax
            path: "embedding",
            numCandidates: 100, // must be > k, e.g., 100
            limit: Number(k)    // instead of `k` inside query
          }
        },
        {
          $project: {
            foodname: 1,
            desc: 1,
            ExpiryDate: 1,
            score: { $meta: "vectorSearchScore" }
          }
        }
      ];

    const results = await fooddetailsModel.aggregate(pipeline).allowDiskUse(true).exec();
    return res.json(results);
  } catch (err) {
    console.error("getSimilarPreview error", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET search via query param ?q=bananas
export async function searchFoods(req, res) {
    try {
      const q = req.query.q;
      const k = Number(req.query.k || 10);
      if (!q) return res.status(400).json({ message: "q is required" });
  
      const raw = await embedText(q);
      const qvec = normalizeVector(raw);
  
      const pipeline = [
        {
          $vectorSearch: {
            index: VECTOR_INDEX_NAME,
            queryVector: qvec,
            path: "embedding",
            numCandidates: 100,  // must be >= k
            limit: k,            // how many results to return
          }
        },
        {
          $project: {
            foodname: 1,
            desc: 1,
            ExpiryDate: 1,
            score: { $meta: "vectorSearchScore" }
          }
        }
      ];
  
      const results = await fooddetailsModel.aggregate(pipeline).allowDiskUse(true).exec();
      return res.json(results);
    } catch (err) {
      console.error("searchFoods error", err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  }