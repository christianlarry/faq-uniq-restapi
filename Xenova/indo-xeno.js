import { pipeline } from "@xenova/transformers";
import { MongoClient } from "mongodb";

// Fungsi untuk mendapatkan embedding dari kalimat
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

// Fungsi untuk menghitung dot product dari dua vektor
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

// Fungsi untuk memproses dan menyimpan embedding dari title dan questions
async function processAndStoreEmbeddings() {
  const uri = "mongodb+srv://uniq-intern-2024:HAOWa1vkNTAnL6hJ@uniq-report.pk7bg.gcp.mongodb.net/?retryWrites=true&w=majority&appName=UNIQ-Report"; // Connection string to MongoDB
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db("chat_support");
    const faqCollection = database.collection("faq");
    const faqEmbeddingCollection = database.collection("faq_embedding_question");

    const faqs = await faqCollection.find({}, { projection: { _id: 1, title: 1, questions: 1 } }).toArray();

    for (const faq of faqs) {
      const { _id, title, questions } = faq;
      
      // Gabungkan title dan questions
      const combinedText = title + " " + questions.join(" ");

      const embedding = await getEmbedding(combinedText);

      if (embedding) {
        const embeddingArray = Array.from(embedding);

        const embeddingDocument = {
          id_faq: _id,
          title: title,
          questions: questions,
          payload: embeddingArray,
        };

        await faqEmbeddingCollection.insertOne(embeddingDocument);
        console.log(`Successfully inserted embedding for title: ${title}`);
      } else {
        console.log(`Failed to generate embedding for title: ${title}`);
      }
    }
  } catch (error) {
    console.error("Error while processing embeddings:", error);
  } finally {
    await client.close();
  }
}

// Fungsi untuk mencari pertanyaan yang paling mirip berdasarkan embedding
async function findTopSimilarQuestions(queryEmbedding) {
  const uri = "mongodb+srv://uniq-intern-2024:HAOWa1vkNTAnL6hJ@uniq-report.pk7bg.gcp.mongodb.net/?retryWrites=true&w=majority&appName=UNIQ-Report"; // MongoDB connection string
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("chat_support");
    const faqEmbeddingCollection = database.collection("faq_embedding_question");

    const faqs = await faqEmbeddingCollection.find({}).toArray();

    const similarities = faqs.map((faq) => ({
      id_faq: faq.id_faq,
      title: faq.title,
      questions: faq.questions,
      similarity: dotProduct(queryEmbedding, faq.payload),
    }));

    similarities.sort((a, b) => b.similarity - a.similarity);

    const top5Similar = similarities.slice(0, 5);

    console.log("Top 5 most similar questions:");
    top5Similar.forEach((faq) => {
      console.log(`Title: ${faq.title}, Similarity: ${faq.similarity}`);
    });

    return top5Similar;
  } catch (error) {
    console.error("Error during similarity search:", error);
  } finally {
    await client.close();
  }
}

// Main program
(async () => {
  try {
    // Storing embedding ke MongoDB
    // Uncomment ini jika ingin memproses dan menyimpan embedding
    await processAndStoreEmbeddings();

    // Contoh pencarian
    // const p = "cara menambahkan nomor wa";
    // const q = await getEmbedding(p);

    // if (q) {
    //   console.log("Pertanyaan yang mirip dengan: " + p);
    //   await findTopSimilarQuestions(q);
    // } else {
    //   console.log("Failed to generate embedding for the query.");
    // }

  } catch (error) {
    console.error("Error during similarity calculation:", error);
  }
})();
