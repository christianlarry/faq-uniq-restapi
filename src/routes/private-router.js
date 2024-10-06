import express from "express"

// IMPORT CONTROLLER
import userController from "../controllers/user-controller.js"

const privateApiRouter = express.Router()

// PRIVATE AUTH ROUTER
privateApiRouter.post("/register",userController.register)

export default privateApiRouter