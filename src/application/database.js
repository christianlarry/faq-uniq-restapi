import {MongoClient} from "mongodb"
import { logger } from "./logging.js"

import dotenv from "dotenv"
dotenv.config()

const mongodbUri = process.env.MONGODB_URI

const client = new MongoClient(mongodbUri)
let db

const connectToMongoDB = async ()=>{
  try {
    await client.connect()
    logger.info("Connected to MongoDB")

    db = client.db("chat_support")
  } catch (err) {
    logger.error(err)
  }
}

connectToMongoDB()

export{
  db
}