import Joi from "joi";

const searchFaqValidation = Joi.string()
  .max(100)
  .required()
  .messages({
    'string.base': 'Search query must be a string.',
    'string.empty': 'Search query cannot be empty.',
    'string.max': 'Search query must be less than or equal to 100 characters.',
    'any.required': 'Search query is required.'
  });

const postFaqValidation = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      'string.base': 'Title must be a string.',
      'string.empty': 'Title cannot be empty.',
      'any.required': 'Title is required.'
    }),
  
  questions: Joi.array()
    .items(Joi.string().min(1))
    .required()
    .messages({
      'array.base': 'Questions must be an array.',
      'array.empty': 'Questions array cannot be empty.',
      'any.required': 'Questions are required.',
      'string.base': 'Each question must be a string.',
      'string.empty': 'Each question cannot be empty.'
    }),
  
  answer: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.base': 'Answer must be a string.',
      'string.empty': 'Answer cannot be empty.',
      'any.required': 'Answer is required.'
    }),
  
  id_sub_category: Joi.array()
    .items(Joi.string().required())
    .required()
    .messages({
      'array.base': 'ID subcategory must be an array.',
      'array.empty': 'ID subcategory array cannot be empty.',
      'any.required': 'ID subcategory is required.',
      'string.base': 'Each ID subcategory must be a string.'
    })
});

const updateFaqValidation = Joi.object({
  id: Joi.string()
  .min(1)
  .required()
  .messages({
    'string.base': 'id must be a string.',
    'string.empty': 'id cannot be empty.',
    'any.required': 'id is required.'
  }), 
  title: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      'string.base': 'Title must be a string.',
      'string.empty': 'Title cannot be empty.',
      'any.required': 'Title is required.'
    }),
  
  questions: Joi.array()
    .items(Joi.string().min(1))
    .required()
    .messages({
      'array.base': 'Questions must be an array.',
      'array.empty': 'Questions array cannot be empty.',
      'any.required': 'Questions are required.',
      'string.base': 'Each question must be a string.',
      'string.empty': 'Each question cannot be empty.'
    }),
  
  answer: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.base': 'Answer must be a string.',
      'string.empty': 'Answer cannot be empty.',
      'any.required': 'Answer is required.'
    }),
  
  id_sub_category: Joi.array()
    .items(Joi.string().required())
    .required()
    .messages({
      'array.base': 'ID subcategory must be an array.',
      'array.empty': 'ID subcategory array cannot be empty.',
      'any.required': 'ID subcategory is required.',
      'string.base': 'Each ID subcategory must be a string.'
    })
})

export {
  searchFaqValidation,
  postFaqValidation,
  updateFaqValidation
}