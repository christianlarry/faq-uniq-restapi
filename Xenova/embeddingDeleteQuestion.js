import { MongoClient,ObjectId } from "mongodb";
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

// Fungsi untuk menghapus FAQ dan data embedding terkait
async function deleteFAQAndEmbedding(faqId) {
    const uri = "mongodb+srv://uniq-intern-2024:HAOWa1vkNTAnL6hJ@uniq-report.pk7bg.gcp.mongodb.net/?retryWrites=true&w=majority&appName=UNIQ-Report"; // Connection string to MongoDB
    const client = new MongoClient(uri);
  
    try {
      await client.connect();
  
      const database = client.db("chat_support");
      const faqCollection = database.collection("faq_coba");
      const faqEmbeddingCollection = database.collection("faq_embedding_coba");
  
      // Pastikan faqId diubah menjadi ObjectId
      const objectId = new ObjectId(faqId);
  
      // Cek apakah FAQ ada di koleksi 'faq'
      const isFAQExist = await faqCollection.findOne({ _id: objectId });
      if (!isFAQExist) throw new Error(`FAQ dengan ID ${faqId} tidak ditemukan!`);
  
      // Hapus FAQ dari koleksi 'faq'
      const deleteFAQResult = await faqCollection.deleteOne({ _id: objectId });
  
      if (deleteFAQResult.deletedCount === 1) {
        console.log(`FAQ dengan ID ${faqId} berhasil dihapus dari koleksi 'faq'.`);
  
        // Hapus data embedding terkait dari koleksi 'faq_embedding_question'
        const deleteEmbeddingResult = await faqEmbeddingCollection.deleteOne({ id_faq: objectId });
  
        if (deleteEmbeddingResult.deletedCount === 1) {
          console.log(`Embedding terkait dengan FAQ ID ${faqId} berhasil dihapus dari koleksi 'faq_embedding_question'.`);
        } else {
          console.log(`Tidak ada embedding terkait dengan FAQ ID ${faqId} yang ditemukan di koleksi 'faq_embedding_question'.`);
        }
      } else {
        throw new Error(`Gagal menghapus FAQ dengan ID ${faqId}`);
      }
    } catch (error) {
      console.error("Error during the FAQ deletion process:", error);
    } finally {
      await client.close();
    }
  }
  (async () => {
    try {
      // ID FAQ yang ingin dihapus
      const faqId = "671225eca18601ce33d2cf73"; // Ganti dengan ID FAQ yang sesuai
  
      // Panggil fungsi untuk menghapus FAQ dan embedding terkait
      await deleteFAQAndEmbedding(faqId);
    } catch (error) {
      console.error("Error during the deletion process:", error);
    }
  })();


// Fungsi untuk menghapus FAQ dan data embedding terkait berdasarkan title
// async function deleteFAQAndEmbeddingByTitle(faqTitle) {
//     const uri = "mongodb+srv://uniq-intern-2024:HAOWa1vkNTAnL6hJ@uniq-report.pk7bg.gcp.mongodb.net/?retryWrites=true&w=majority&appName=UNIQ-Report"; // Connection string to MongoDB
//     const client = new MongoClient(uri);
  
//     try {
//       await client.connect();
  
//       const database = client.db("chat_support");
//       const faqCollection = database.collection("faq");
//       const faqEmbeddingCollection = database.collection("faq_coba");
  
//       // Cari FAQ berdasarkan title
//       const faq = await faqCollection.findOne({ title: faqTitle });
  
//       if (faq) {
//         const faqId = faq._id;
  
//         // Hapus FAQ dari koleksi 'faq'
//         const deleteFAQResult = await faqCollection.deleteOne({ _id: faqId });
  
//         if (deleteFAQResult.deletedCount === 1) {
//           console.log(`FAQ dengan title "${faqTitle}" berhasil dihapus dari koleksi 'faq'.`);
  
//           // Hapus data embedding terkait dari koleksi 'faq_embedding_question'
//           const deleteEmbeddingResult = await faqEmbeddingCollection.deleteOne({ id_faq: faqId });
  
//           if (deleteEmbeddingResult.deletedCount === 1) {
//             console.log(`Embedding terkait dengan FAQ ID ${faqId} berhasil dihapus dari koleksi.`);
//           } else {
//             console.log(`Tidak ada embedding terkait dengan FAQ ID ${faqId} yang ditemukan di koleksi 'faq_embedding_question'.`);
//           }
//         } else {
//           console.log(`FAQ dengan title "${faqTitle}" tidak dapat dihapus dari koleksi 'faq'.`);
//         }
//       } else {
//         console.log(`FAQ dengan title "${faqTitle}" tidak ditemukan di koleksi 'faq'.`);
//       }
//     } catch (error) {
//       console.error("Error during the FAQ deletion process:", error);
//     } finally {
//       await client.close();
//     }
//   }
  
//   // Main program untuk menghapus FAQ dan embedding terkait berdasarkan title
//   (async () => {
//     try {
//       // Title FAQ yang ingin dihapus
//       const faqTitle = "Bagaimana cara membeli laptop?"; // Ganti dengan title FAQ yang sesuai
  
//       // Panggil fungsi untuk menghapus FAQ dan embedding terkait
//       await deleteFAQAndEmbeddingByTitle(faqTitle);
//     } catch (error) {
//       console.error("Error during the deletion process:", error);
//     }
//   })();