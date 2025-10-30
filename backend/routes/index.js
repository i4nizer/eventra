import express from "express"
import auth from "./auth.js"
import section from "./section.js"
import activity from "./activity.js"

//

const routes = express.Router()
routes.use("/auth", auth)
routes.use("/section", section)
routes.use("/activity", activity)

//

export default routes