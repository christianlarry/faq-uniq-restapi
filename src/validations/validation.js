import { ResponseError } from "../errors/response-error.js"

export const validate = (schema,data)=>{

  const result = schema.validate(data,{
    abortEarly: false
  })

  if(result.error){
    throw new ResponseError(400,result.error.message)
  }else{
    return result.value
  }
}