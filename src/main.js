// SETUP dotenv
import dotenv from "dotenv"
dotenv.config()

import { logger } from "./application/logging.js";
import { web } from "./application/web.js";

const port = process.env.PORT

web.listen(port,()=>{
  logger.info("Server is up and running at port "+port)
})

// TODO data kategori FAQ 