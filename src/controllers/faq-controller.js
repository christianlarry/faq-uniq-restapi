import faqService from "../services/faq-service.js"

const getMany = async (req,res,next)=>{
  try {
    const result = await faqService.getMany()

    res.status(200).json({
      data: result
    })
  } catch (err) {
    next(err)
  }
}

export default {
  getMany
}