import express from "express"

// IMPORT CONTROLLER
import faqController from "../controllers/faq-controller.js"
import userController from "../controllers/user-controller.js"

const publicRouter = express.Router()

// FAQ ROUTER
publicRouter.get("/faq",faqController.getMany)

// USER ROUTER
publicRouter.post("/login",userController.login)

export default publicRouter