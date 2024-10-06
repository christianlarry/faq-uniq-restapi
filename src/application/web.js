import express from "express"
import cors from "cors"

import { errorMiddleware } from "../middlewares/error-middleware.js"

// -- IMPORT ROUTER
import publicRouter from "../routes/public-router.js"
import privateRouter from "../routes/private-router.js"
import { authenticateToken } from "../middlewares/auth-middleware.js"

export const web = express()

// TOP MIDDLEWARE
web.use(express.json())
web.use(express.static("public"))
web.use(express.urlencoded({extended: true}))
web.use(cors())

// ROUTES
web.use("/api/v1", publicRouter)
web.use("/api/v1",authenticateToken,privateRouter)

// BOTTOM MIDDLEWARE
web.use(errorMiddleware)