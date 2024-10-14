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



const getMany = async () => {
  const faq = await db.collection("faq").find().toArray()

  return faq
}

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
  const top5Similar = similarities.slice(0, 5);

  // Ambil data lengkap dari koleksi 'faq' berdasarkan id_faq
  const faqs = await Promise.all(
    top5Similar.map(async (faq) => {
      let faqData;
      // Jika id_faq valid sebagai ObjectId, lakukan pencarian dengan ObjectId
      if (ObjectId.isValid(faq.id_faq)) {
        faqData = await db.collection("faq").findOne({ _id: new ObjectId(faq.id_faq) });
      } else {
        // Jika bukan ObjectId yang valid, cari dengan string biasa
        faqData = await db.collection("faq").findOne({ _id: faq.id_faq });
      }
      return faqData ? { ...faqData, similarity: faq.similarity } : null;
    })
  );

  // Filter untuk memastikan bahwa hanya data yang tidak null yang dikembalikan
  const filteredFaqs = faqs.filter(faq => faq !== null);

  return { data: filteredFaqs };
};



const search2 = async (q) => {

  const searchQuery = validate(searchFaqValidation,q)

  const faq = await db.collection("faq").find({
    "questions": {
      $regex: searchQuery,
      $options: "i"
    }
  }).toArray()

  return faq
}

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
        return await db.collection("faq_embedding").findOne({
          "_id": new ObjectId(faqId)
        })
      } else {
        return await db.collection("faq_embedding").findOne({
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
        return await db.collection("faq_embedding").findOne({
          "_id": new ObjectId(faqId)
        })
      } else {
        return await db.collection("faq_embedding").findOne({
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
  search
}