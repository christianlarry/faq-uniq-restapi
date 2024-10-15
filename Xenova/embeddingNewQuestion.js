
import { MongoClient } from "mongodb";
import getEmbedding from "../src/utils/getEmbedd.js";

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

// Fungsi untuk menambahkan FAQ baru dan mengembed FAQ baru tersebut
async function addNewFAQAndEmbed(title, questions, answer) {
  const uri = "mongodb+srv://uniq-intern-2024:HAOWa1vkNTAnL6hJ@uniq-report.pk7bg.gcp.mongodb.net/?retryWrites=true&w=majority&appName=UNIQ-Report"; // Connection string to MongoDB
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db("chat_support");
    const faqCollection = database.collection("faq");
    const faqEmbeddingCollection = database.collection("faq_coba");

    // Simpan FAQ baru ke dalam database
    const newFAQ = {
      title: title,
      questions: questions,
      answer: answer,
    };

    const result = await faqCollection.insertOne(newFAQ);

    if (result.insertedId) {
      // FAQ berhasil disimpan, lanjutkan dengan proses embedding
      console.log(`FAQ baru berhasil disimpan dengan ID: ${result.insertedId}`);

      // Gabungkan title dan questions
      const combinedText = title + " " + questions.join(" ");

      const embedding = await getEmbedding(combinedText);

      if (embedding) {
        const embeddingArray = Array.from(embedding);

        const embeddingDocument = {
          id_faq: result.insertedId,
          title: title,
          questions: questions,
          payload: embeddingArray,
        };

        // Simpan embedding ke koleksi faq_embedding_question
        await faqEmbeddingCollection.insertOne(embeddingDocument);
        console.log(`Embedding berhasil disimpan untuk FAQ baru dengan ID: ${result.insertedId}`);
      } else {
        console.error("Gagal menghasilkan embedding untuk FAQ baru.");
      }
    } else {
      console.error("Gagal menyimpan FAQ baru.");
    }
  } catch (error) {
    console.error("Error during the FAQ insertion and embedding process:", error);
  } finally {
    await client.close();
  }
}

// Main program untuk menambahkan FAQ baru
(async () => {
  try {
    const title = "Bagaimana cara mereset password akun?";
    const questions = ["Bagaimana cara reset password?", "Langkah mereset password akun?"];
    const answer = "Untuk mereset password akun, silakan klik 'Lupa Password' di halaman login, lalu ikuti instruksi yang diberikan.";

    // Tambahkan FAQ baru dan lakukan embedding secara otomatis
    await addNewFAQAndEmbed(title, questions, answer);
  } catch (error) {
    console.error("Error during the FAQ submission process:", error);
  }
})();
