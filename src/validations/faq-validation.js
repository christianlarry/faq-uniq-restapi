import Joi from "joi";

const searchFaqValidation = Joi.string().max(100).required()

const addFaqValidation = Joi.object({
  title: Joi.string(),
  questions: Joi.string(),
  answer: Joi.string(),
  id_sub_category: Joi.string()
})

export {
  searchFaqValidation
}