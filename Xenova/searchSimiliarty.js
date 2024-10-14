import { pipeline } from "@xenova/transformers";
import { MongoClient } from "mongodb";

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

    console.log("Embedding shape:", output.data.length);
    return output.data;
  } catch (error) {
    console.error("Error during feature extraction:", error);
    return null;
  }
}

function dotProduct(a, b) {
  if (a.length !== b.length) {
    throw new Error("Both arguments must have the same length");
  }

  let result = 0;

  for (let i = 0; i < a.length; i++) {
    result += a[i] * b[i];
  }

  return result;
}

async function findTopSimilarQuestions(queryEmbedding) {
  const uri =
    "mongodb+srv://uniq-intern-2024:HAOWa1vkNTAnL6hJ@uniq-report.pk7bg.gcp.mongodb.net/?retryWrites=true&w=majority&appName=UNIQ-Report"; // MongoDB connection string
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();

    // Access the 'chat_support' database and 'faq_embedding' collection
    const database = client.db("chat_support");
    const faqEmbeddingCollection = database.collection("faq_embedding");

    // Get all the documents from the 'faq_embedding' collection
    const faqs = await faqEmbeddingCollection.find({}).toArray();

    // Calculate cosine similarity for each entry
    const similarities = faqs.map((faq) => ({
      id_faq: faq.id_faq,
      title: faq.title,
      similarity: dotProduct(queryEmbedding, faq.payload),
    }));

    // Sort by similarity in descending order
    similarities.sort((a, b) => b.similarity - a.similarity);

    // Get the top 5 most similar entries
    const top5Similar = similarities.slice(0, 5);

    console.log("Top 5 most similar questions:");
    top5Similar.forEach((faq) => {
      console.log(`Title: ${faq.title}, Similarity: ${faq.similarity}`);
    });

    return top5Similar;
  } catch (error) {
    console.error("Error during similarity search:", error);
  } finally {
    // Ensure the client is closed after operations
    await client.close();
  }
}

(async () => {
  try {
    // INI BUAT MELAKUKAN PENCARIAN
    const p = "cara menambahkan nomor wa";
    const q = await getEmbedding(p);

    if (q) {
      console.log("pertanyaan yang mirip dengan: " + p);
      await findTopSimilarQuestions(q);
    } else {
      console.log("Failed to generate embedding for the query.");
    }

  } catch (error) {
    console.error("Error during similarity calculation:", error);
  }
})();
