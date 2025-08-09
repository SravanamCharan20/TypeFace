// download_model.js
import { FlagEmbedding, EmbeddingModel } from "fastembed";

console.log("Downloading embedding model...");
await FlagEmbedding.init({ model: EmbeddingModel.BGEBaseENV15 });
console.log("Model downloaded and ready!");

// delay exit to avoid mutex error on macOS
setTimeout(() => process.exit(0), 200);