import {
  db
} from "../application/database.js"

const getMany = async () => {
  const faq = await db.collection("faq").find().toArray()

  return faq
}

// const search = async (q) => {

//   // VALIDATE INPUT
//   const searchQuery = validate(searchFaqValidation,q)

//   const faq = await db.collection("faq").find({
//     "questions": {
//       $regex: searchQuery,
//       $options: "i"
//     }
//   }).toArray()

//   return faq
// }


export default {
  getMany
}