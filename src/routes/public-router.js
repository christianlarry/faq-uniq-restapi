import express from "express"
import faqController from "../controllers/faq-controller.js"

const publicRouter = express.Router()

// FAQ ROUTER
publicRouter.get("/faq",faqController.getMany)

export default publicRouter