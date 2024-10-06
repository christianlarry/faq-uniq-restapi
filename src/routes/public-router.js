import express from "express"

// IMPORT CONTROLLER
import faqController from "../controllers/faq-controller.js"
import authController from "../controllers/auth-controller.js"

const publicRouter = express.Router()

// FAQ ROUTER
publicRouter.get("/faq",faqController.getMany)

// AUTH ROUTER
publicRouter.get("/login",authController.login)

export default publicRouter