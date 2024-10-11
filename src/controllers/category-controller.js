import categoryService from "../services/category-service.js"

const getMany = async (req,res,next)=>{
  try {
    const result = await categoryService.getMany()

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