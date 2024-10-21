import faqService from "../services/faq-service.js"
import {responseOk} from "../utils/response.js"

const getMany = async (req,res,next)=>{
  try {
    const {category,sub_category,search} = req.query
    
    let result

    if(search){
      result = await faqService.search(search)
      return responseOk(res,200,result)
    }

    if(category){
      result = await faqService.getByCategory(category)
    }else if(sub_category){
      result = await faqService.getBySubCategory(sub_category)
    }else{
      result = await faqService.getMany()
    }

    responseOk(res,200,result)
  } catch (err) {
    next(err)
  }
}

const addFaQ = async (req,res,next)=>
{
  try{
    
  }
  catch(e)
  {
    next(e)
  }
}

export default {
  getMany
}