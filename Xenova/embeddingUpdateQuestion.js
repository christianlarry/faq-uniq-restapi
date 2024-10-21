import { MongoClient, ObjectId } from "mongodb";
import getEmbedding from "../src/utils/getEmbedd.js"; // Pastikan fungsi getEmbedding diimpor dari service

// Service untuk mengupdate FAQ dan mengganti embedding terkait
const updateFAQ = async (id, title, questions, answer) => {
  const uri = "mongodb+srv://uniq-intern-2024:HAOWa1vkNTAnL6hJ@uniq-report.pk7bg.gcp.mongodb.net/?retryWrites=true&w=majority&appName=UNIQ-Report"; // Connection string to MongoDB
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db("chat_support");
    const faqCollection = database.collection("faq_coba");
    const faqEmbeddingCollection = database.collection("faq_embedding_coba");

    // Validasi ID dan ubah menjadi ObjectId
    if (!ObjectId.isValid(id)) {
      throw new Error("ID is not a valid ObjectId");
    }
    const objectId = new ObjectId(id);

    // Cek apakah FAQ dengan ID tersebut ada
    const isFAQExist = await faqCollection.findOne({ _id: objectId });
    if (!isFAQExist) {
      throw new Error(`FAQ dengan ID ${id} tidak ditemukan!`);
    }

    // Hapus embedding lama terkait FAQ
    const deleteEmbeddingResult = await faqEmbeddingCollection.deleteOne({ id_faq: objectId });
    if (deleteEmbeddingResult.deletedCount === 0) {
      console.log(`Tidak ada embedding terkait dengan FAQ ID ${id} yang ditemukan.`);
    } else {
      console.log(`Embedding terkait FAQ ID ${id} berhasil dihapus.`);
    }

    // Update FAQ di koleksi 'faq'
    const updateFAQResult = await faqCollection.updateOne(
      { _id: objectId },
      { $set: { title: title, questions: questions, answer: answer } }
    );

    if (updateFAQResult.modifiedCount === 1) {
      console.log(`FAQ dengan ID ${id} berhasil di-update.`);

      // Gabungkan title dan questions untuk membuat embedding baru
      const combinedText = title + " " + questions.join(" ");

      // Generate embedding baru
      const embedding = await getEmbedding(combinedText);

      if (embedding) {
        const embeddingArray = Array.from(embedding);

        const embeddingDocument = {
          id_faq: objectId,
          title: title,
          questions: questions,
          payload: embeddingArray,
        };

        // Simpan embedding baru ke koleksi faq_embedding_question
        await faqEmbeddingCollection.insertOne(embeddingDocument);
        console.log(`Embedding baru berhasil disimpan untuk FAQ dengan ID: ${id}`);
      } else {
        console.error("Gagal menghasilkan embedding baru untuk FAQ yang di-update.");
      }
    } else {
      throw new Error(`Gagal mengupdate FAQ dengan ID ${id}.`);
    }
  } catch (error) {
    console.error("Error during the FAQ update process:", error);
    throw error;
  } finally {
    await client.close();
  }
};

(async () => {
    try {
      const faqId = "6715fb54d091f8c0b623ea18"; // Ganti dengan ID FAQ yang ingin diupdate
      const newTitle = "Bagaimana cara membeli Komputer?";
      const newQuestions = ["Apa saja tips membeli Komputer?", "Cara memilih Komputer yang baik?"];
      const newAnswer = "Untuk membeli Komputer, perhatikan spesifikasi, harga, dan kebutuhan Anda.";
  
      // Update FAQ dan ganti embedding secara otomatis
      await updateFAQ(faqId, newTitle, newQuestions, newAnswer);
    } catch (error) {
      console.error("Error during the FAQ update process:", error.message);
    }
  })();