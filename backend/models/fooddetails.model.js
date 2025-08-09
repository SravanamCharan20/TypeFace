// models/FoodDetail.js
import mongoose from "mongoose";

const foodDetailsSchema = new mongoose.Schema({
  foodname: { type: String, required: true },
  desc: { type: String, required: true },
  ExpiryDate: { type: Date, required: true },
  embedding: {
    type: [Number],
    required: true,
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length > 0,
      message: "embedding must be non-empty array"
    }
  }
}, { timestamps: true });

export default mongoose.model("FoodDetail", foodDetailsSchema);