import faqService from "../services/faq-service.js"
import {responseOk} from "../utils/response.js"

const getMany = async (req,res,next)=>{
  try {
    const result = await faqService.getMany()

    responseOk(res,200,result)
  } catch (err) {
    next(err)
  }
}

const search = async (req,res,next)=>{
  try {
    const search = req.query.q

    const result = await faqService.search(search)

    responseOk(res,200,result)
  } catch (err) {
    next(err)
  }
}

export default {
  getMany,
  search
}