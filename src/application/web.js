import express from "express"
import { errorMiddleware } from "../middlewares/error-middleware.js"
import publicRouter from "../routes/public-router.js"
import privateRouter from "../routes/private-router.js"

export const web = express()

web.use(express.json())
web.use("/api", publicRouter)
web.use("/api", privateRouter)


// BOTTOM MIDDLEWARE
web.use(errorMiddleware)