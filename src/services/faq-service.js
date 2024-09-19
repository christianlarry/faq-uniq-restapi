import {
  db
} from "../application/database.js"
import {
  logger
} from "../application/logging.js"

const getMany = async () => {
  const faq = await db.collection("faq").find().toArray()

  return faq
}

const search = async (q) => {

  const faq = await db.collection("faq").find({
    "questions": {
      $regex: q,
      $options: "i"
    }
  }).toArray()

  return faq
}


export default {
  getMany,
  search
}