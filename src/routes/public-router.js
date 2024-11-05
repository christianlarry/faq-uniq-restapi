import express from "express"

// IMPORT CONTROLLER
import faqController from "../controllers/faq-controller.js"
import userController from "../controllers/user-controller.js"
import categoryController from "../controllers/category-controller.js"
import { generateTokenController, verifyTokenController } from "../controllers/chatbot-controller.js"

const publicRouter = express.Router()

// FAQ ROUTER
publicRouter.get("/faq",faqController.getMany)

// FAQ CATEGORY ROUTER
publicRouter.get("/faq-category",categoryController.getMany)

// USER ROUTER
publicRouter.post("/login",userController.login)

//Chatbot Router
publicRouter.post("/generate-token",generateTokenController);
publicRouter.post("/verify-token",verifyTokenController);

export default publicRouter