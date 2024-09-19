import express from "express"
import cors from "cors"

import { errorMiddleware } from "../middlewares/error-middleware.js"

// -- IMPORT ROUTER
import publicRouter from "../routes/public-router.js"
import privateRouter from "../routes/private-router.js"

export const web = express()

// TOP MIDDLEWARE
web.use(express.json())
web.use(express.static("public"))
web.use(express.urlencoded({extended: true}))
web.use(cors())

// ROUTES
web.use("/api", publicRouter)
web.use("/api", privateRouter)

// BOTTOM MIDDLEWARE
web.use(errorMiddleware)

// ! TENTUKKAN AGAR API BISA DIBUAT! Apakah ada pagination, Pembagian kategori seperti apa.