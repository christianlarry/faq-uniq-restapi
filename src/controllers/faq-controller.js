import faqService from "../services/faq-service.js"
import {responseOk} from "../utils/response.js"

const getMany = async (req,res,next)=>{
  try {
    const {category} = req.query
    
    let result

    if(category){
      result = await faqService.getByCategory(category)
    }else{
      result = await faqService.getMany()
    }

    responseOk(res,200,result)
  } catch (err) {
    next(err)
  }
}

// const search = async (req,res,next)=>{
//   try {
//     const q = req.query.q

//     const result = await faqService.search(q)

//     responseOk(res,200,result)
//   } catch (err) {
//     next(err)
//   }
// }

export default {
  getMany
}