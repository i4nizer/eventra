import express from "express"
import controllers from "../controllers/index.js"
import middlewares from "../middlewares/index.js"

//

const student = express.Router()
student.route("/")
    .post(middlewares.auth.access, controllers.student.post)

//

export default student
