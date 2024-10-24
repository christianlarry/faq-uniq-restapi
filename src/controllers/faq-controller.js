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

const updateFaQ = async (req,res,next)=>
{
  try{
    const {title,questions,answer} = req.body

    let result = await faqService.updateFaQ(title,questions,answer);
    
    res.status(200).json({
      data:result
    });
  }
  catch(e)
  {
    next(e)
  }
};

const addFaQ = async (req,res,next)=>
{
  try{
    const {title,questions,answer,id_sub_category} = req.body

    let result = await faqService.addFaQ(title,questions,answer,id_sub_category);

    res.status(200).json({
      data:result
    });
  }
  catch(e)
  {
    next(e)
  }
}

const removeFaQ = async (req,res,next) =>
{
  try{
      await faqService.removeFaQ(req.params.id)

      res.status(200).json({
        data: "OK"
      })
  } catch(e)
  {
    next(e)
  }
}

export default {
  updateFaQ,
  addFaQ,
  removeFaQ,
  getMany
}