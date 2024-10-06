import express from "express"

// IMPORT CONTROLLER
import authController from "../controllers/auth-controller.js"

const privateApiRouter = express.Router()

// PRIVATE AUTH ROUTER
privateApiRouter.post("/register",authController.register)

export default privateApiRouter