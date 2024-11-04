import jwt from "jsonwebtoken"
import { ResponseError } from "../errors/response-error.js"

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (!token) throw new ResponseError(401,"Unathorized")
  
    // MENGATASI TOKEN YANG SUDAH DIANGGAP KADALUARSA (SEPERTI TOKEN UNTUK USER YANG SUDAH LOGOUT)
    // const [invalidToken] = await getInvalidAccessTokenByToken(token)
    // if (invalidToken.length != 0 || invalidToken.length === 1) return res.sendStatus(403)
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) throw new ResponseError(403,"Forbidden")
      req.user = decoded
      next()
    })
  } catch (err) {
    next(err)
  }
}