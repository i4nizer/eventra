import express from "express"
import controllers from "../controllers/index.js"
import middlewares from "../middlewares/index.js"

//

const student = express.Router()
student.route("/")
    .get(middlewares.auth.access, controllers.student.get)
    .post(middlewares.auth.access, controllers.student.post)
    .patch(middlewares.auth.access, controllers.student.patch)

//

export default student
