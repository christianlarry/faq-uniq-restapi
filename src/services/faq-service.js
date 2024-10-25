import {
  ObjectId
} from "mongodb"
import {
  db
} from "../application/database.js"
import {
  ResponseError
} from "../errors/response-error.js"
import { validate } from "../validations/validation.js"
import { searchFaqValidation } from "../validations/faq-validation.js"
import getEmbedding from "../utils/getEmbedd.js"



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

const getMany = async () => {
  const faq = await db.collection("faqmagang").find().toArray()

  return faq
}

const updateFaQ = async (title,questions,answer)=>
{
  //Dekelarasi Collection
  const faqEmbeddingCollection = db.collection("faq_embedding_question");
  const faqCollection = db.collection("faqmagang");

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
      { $set: { title: title, questions: questions, htmlAnswer: answer } }
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
};

const addFaQ = async (title, questions, answer, id_sub_category) => {

  //Dekelarasi Collection
  const faqEmbeddingCollection = db.collection("faq_embedding_question");
  const faqCollection = db.collection("faqmagang");
  const subCategoryCollection = db.collection("sub_category");

  // Simpan FAQ baru ke dalam database
  const newFAQ = {
    title: title,
    questions: questions,
    answer: null,
    htmlAnswer: answer
  };

  const result = await faqCollection.insertOne(newFAQ);

  if (result.insertedId) {
    console.log(`FAQ baru berhasil disimpan dengan ID: ${result.insertedId}`);

    // Masukkan ID FAQ ke document Sub Category berdasarkan id_sub_category
    const objectIdSubCategory = new ObjectId(id_sub_category);
    const updateSubCategoryResult = await subCategoryCollection.updateOne(
      { _id: objectIdSubCategory },
      { $push: { faqs: result.insertedId } } // Menambahkan ID FAQ baru ke array faqs di sub_category
    );

    if (updateSubCategoryResult.modifiedCount === 1) {
      console.log(`FAQ ID ${result.insertedId} berhasil ditambahkan ke Sub Category dengan ID: ${id_sub_category}`);
    } else {
      console.error(`Gagal menambahkan FAQ ke Sub Category dengan ID: ${id_sub_category}`);
    }

    // Gabungkan title dan questions
    const combinedText = title + " " + questions.join(" ");

    // Proses embedding
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
}

const removeFaQ = async (id) => {
  //Dekelarasi Collection
    const faqEmbeddingCollection = db.collection("faq_embedding_question");
    const faqCollection = db.collection("faqmagang");

    // Validasi dan ubah id menjadi ObjectId
    if (!ObjectId.isValid(id)) {
      throw new Error("ID is not a valid ObjectId");
    }
    const objectId = new ObjectId(id);

    // Cek apakah FAQ dengan ID tersebut ada
    const isFAQExist = await faqCollection.findOne({ _id: objectId });
    if (!isFAQExist) {
      throw new Error(`FAQ dengan ID ${id} tidak ditemukan!`);
    }

    // Hapus FAQ dari koleksi 'faq'
    const deleteFAQResult = await faqCollection.deleteOne({ _id: objectId });
    if (deleteFAQResult.deletedCount === 0) {
      throw new Error("Gagal menghapus FAQ!");
    }

    // Hapus data embedding terkait dari koleksi 'faq_embedding_question'
    const deleteEmbeddingResult = await faqEmbeddingCollection.deleteOne({ id_faq: objectId });
    if (deleteEmbeddingResult.deletedCount === 0) {
      console.log(`Tidak ada embedding terkait dengan FAQ ID ${id} yang ditemukan di koleksi 'faq_embedding_question'.`);
    }

    console.log(`FAQ dengan ID ${id} dan embedding terkait berhasil dihapus.`);
    return { message: "FAQ and related embedding deleted successfully" };
};

const search = async (q) => {
  // Validasi input query dengan aturan yang sudah ditentukan
  const searchQuery = validate(searchFaqValidation, q);

  // Mendapatkan embedding dari query pencarian
  const queryEmbedding = await getEmbedding(searchQuery);

  if (!queryEmbedding) {
    throw new ResponseError(500, "Failed to generate embedding for the query.");
  }

  // Ambil semua dokumen dari koleksi 'faq_embedding'
  const faqEmbeddings = await db.collection("faq_embedding_question").find({}).toArray();

  // Hitung kesamaan (dot product) untuk setiap FAQ
  const similarities = faqEmbeddings.map((faq) => ({
    id_faq: faq.id_faq,
    similarity: dotProduct(queryEmbedding, faq.payload),
  }));

  // Urutkan berdasarkan kesamaan dari tertinggi ke terendah
  similarities.sort((a, b) => b.similarity - a.similarity);

  // Ambil 5 FAQ yang paling mirip
  const top5Similar = similarities.slice(0, 10);

  // Ambil data lengkap dari koleksi 'faq' berdasarkan id_faq
  const faqs = await Promise.all(
    top5Similar.map(async (faq) => {
      let faqData;
      // Jika id_faq valid sebagai ObjectId, lakukan pencarian dengan ObjectId
      if (ObjectId.isValid(faq.id_faq)) {
        faqData = await db.collection("faqmagang").findOne({ _id: new ObjectId(faq.id_faq) });
      } else {
        // Jika bukan ObjectId yang valid, cari dengan string biasa
        faqData = await db.collection("faqmagang").findOne({ _id: faq.id_faq });
      }
      return faqData ? { ...faqData, similarity: faq.similarity } : null;
    })
  );

  // Filter untuk memastikan bahwa hanya data yang tidak null yang dikembalikan
  const filteredFaqs = faqs.filter(faq => faq !== null);

  return filteredFaqs
};

const getByCategory = async (id) => {
  const category = await db.collection("faq_category").findOne({
    "_id": new ObjectId(id)
  })

  if (!category) throw new ResponseError(404, "Category not found!")

  const sub_category_ids = category.sub_category
  
  // GET SUBCATEGORY IN CATEGORY, RETURN FAQSArr IN EVERY SUBCAT
  const faqsDataArr = await Promise.all(
    sub_category_ids.map(async subCatId =>{
      const result = await db.collection("sub_category").findOne({
        "_id": new ObjectId(subCatId)
      })
      if(result){
        return result.faqs
      }
    })
  )

  const filteredFaqDataArr = faqsDataArr.filter(val=>val != null)

  // COMBIE ALL SEPERATE FAQS ID IN ONE ARRAY
  let faqIds = []
  filteredFaqDataArr.forEach(faqsArr =>{
    faqsArr.forEach(val=>{
      // const chechByFilter = faqIds.filter(faq=>{
      //   if(ObjectId.isValid(faq)){
      //     return val.toString() === faq.toString()
      //   }else{
      //     return val === faq
      //   }
      // })
      val = ObjectId.isValid(val)?val.toString():val

      if(!faqIds.includes(val)){
        faqIds.push(val)
      }
    })
  })

  // GET ALL FAQS
  const faqsData = await Promise.all(
    faqIds.map(async faqId => {
      if (ObjectId.isValid(faqId)) {
        return await db.collection("faqmagang").findOne({
          "_id": new ObjectId(faqId)
        })
      } else {
        return await db.collection("faqmagang").findOne({
          "_id": faqId
        })
      }
    })
  )

  return faqsData.filter(faq=>faq !== null)
}

const getBySubCategory = async (id)=>{
  const sub_category = await db.collection("sub_category").findOne({
    "_id": new ObjectId(id) 
  })

  const {faqs} = sub_category

  const faqsData = await Promise.all(
    faqs.map(async faqId => {
      if (ObjectId.isValid(faqId)) {
        return await db.collection("faqmagang").findOne({
          "_id": new ObjectId(faqId)
        })
      } else {
        return await db.collection("faqmagang").findOne({
          "_id": faqId
        })
      }
    })
  )

  return faqsData.filter(faq=>faq!==null)
}

export default {
  getMany,
  getByCategory,
  getBySubCategory,
  search,
  updateFaQ,
  removeFaQ,
  addFaQ
}