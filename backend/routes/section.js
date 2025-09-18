import express from "express"
import controllers from "../controllers/index.js"
import middlewares from "../middlewares/index.js"

//

const section = express.Router()
section.route("/")
    .post(middlewares.auth.access, controllers.section.post)
    .patch(middlewares.auth.access, controllers.section.patch)

//

export default section
