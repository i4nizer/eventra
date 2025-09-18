import express from "express"
import auth from "./auth.js"
import section from "./section.js"

//

const routes = express.Router()
routes.use("/auth", auth)
routes.use("/section", section)

//

export default routes