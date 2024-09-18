import {db} from "../application/database.js"

const getMany = async ()=>{
  const faq = await db.collection("faq").find().toArray()

  return faq
}

export default{
  getMany
}