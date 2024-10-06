import { db } from "../application/database.js"

const getMany = async ()=>{
  const category = await db.collection("faq_category").find().toArray()

  return category
}

export default {
  getMany
}