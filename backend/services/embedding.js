// services/embedding.js
import { pipeline } from '@xenova/transformers';

let embedder = null;


export async function initEmbeddingModel() {
  if (!embedder) {
    console.log("Loading SBERT model (Xenova/all-MiniLM-L6-v2)...");
    embedder = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2' 
    );
    console.log("SBERT model loaded!");
  }
  return embedder;
}

export function normalizeVector(vec, eps = 1e-12) {
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) {
    const val = Number(vec[i]);
    sumSq += val * val;
  }
  const norm = Math.sqrt(sumSq);
  if (norm < eps) return vec.map(() => 0);
  return vec.map((x) => Number(x) / norm);
}

export async function embedText(text) {
  if (!text || typeof text !== 'string') {
    throw new Error("Text must be a non-empty string");
  }

  const model = await initEmbeddingModel();

  // Extract features without internal normalization
  const output = await model(text, { pooling: 'mean', normalize: false });

  // Convert tensor data to plain array
  const arr = Array.from(output.data);
  console.log(arr);

  // Normalize manually for consistency
  return normalizeVector(arr);
}