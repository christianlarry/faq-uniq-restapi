import express from "express"

// IMPORT CONTROLLER
import userController from "../controllers/user-controller.js"
import faqController from "../controllers/faq-controller.js"

const privateApiRouter = express.Router()

// PRIVATE USER ROUTER
privateApiRouter.post("/register",userController.register)
privateApiRouter.get("/user",userController.get)
privateApiRouter.delete("/user/:id",userController.remove)
privateApiRouter.post("/check-token",userController.checkToken)

privateApiRouter.post("/faq",faqController.addFaQ)
privateApiRouter.put("/faq/:id",faqController.updateFaQ)
privateApiRouter.delete("/faq/:id",faqController.removeFaQ)

export default privateApiRouter