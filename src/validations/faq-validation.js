import Joi from "joi";

const searchFaqValidation = Joi.string().max(100).required()

export {
  searchFaqValidation
}