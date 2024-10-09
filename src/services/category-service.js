import { ObjectId } from "mongodb"
import { db } from "../application/database.js"

const getMany = async ()=>{
  const category = await db.collection("faq_category").find().toArray()

  const reformattedCategory = await Promise.all(category.map(async cat=>{
    cat.sub_category = await Promise.all(cat.sub_category.map(async sub_cat=>{
      const subCatData = await db.collection("sub_category").findOne({"_id":new ObjectId(sub_cat)})

      return subCatData
    }))

    return cat
  }))

  return reformattedCategory
}

export default {
  getMany
}