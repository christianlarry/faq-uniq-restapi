import express from "express"

// IMPORT CONTROLLER
import userController from "../controllers/user-controller.js"

const privateApiRouter = express.Router()

// PRIVATE USER ROUTER
privateApiRouter.post("/register",userController.register)
privateApiRouter.get("/user",userController.get)
privateApiRouter.delete("/user/:id",userController.remove)

export default privateApiRouter