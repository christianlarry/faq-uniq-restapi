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

const getMany = async () => {
  const faq = await db.collection("faq").find().toArray()

  return faq
}

const search = async (q) => {

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
        return await db.collection("faq").findOne({
          "_id": new ObjectId(faqId)
        })
      } else {
        return await db.collection("faq").findOne({
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
        return await db.collection("faq").findOne({
          "_id": new ObjectId(faqId)
        })
      } else {
        return await db.collection("faq").findOne({
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