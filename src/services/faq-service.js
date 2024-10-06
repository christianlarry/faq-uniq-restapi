import {
  ObjectId
} from "mongodb"
import {
  db
} from "../application/database.js"
import {
  ResponseError
} from "../errors/response-error.js"

const getMany = async () => {
  const faq = await db.collection("faq").find().toArray()

  return faq
}

const getByCategory = async (id) => {
  const category = await db.collection("faq_category").findOne({
    "_id": new ObjectId(id)
  })

  if (!category) throw new ResponseError(404, "Category not found!")

  const {
    faqs
  } = category

  const faqsData = await Promise.all(
    faqs.map(async faq => {
      if (ObjectId.isValid(faq)) {
        return await db.collection("faq").findOne({
          "_id": new ObjectId(faq)
        })
      } else {
        return await db.collection("faq").findOne({
          "_id": faq
        })
      }
    })
  )

  return faqsData
}

export default {
  getMany,
  getByCategory
}