import { pipeline } from "@xenova/transformers";
async function getEmbedding(sentence) {
    try {
      const extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );
  
      const output = await extractor(sentence, {
        pooling: "mean",
        normalize: true,
      });
        
      return output.data;
    } catch (error) {
      console.error("Error during feature extraction:", error);
      return null;
    }
  }

export default getEmbedding