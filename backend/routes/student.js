import express from "express"
import controllers from "../controllers/index.js"
import middlewares from "../middlewares/index.js"

//

const student = express.Router({ mergeParams: true })
student.route("/")
    .get(middlewares.auth.access, controllers.student.get)
    .post(middlewares.auth.access, controllers.student.post)
student.route("/:stuid")
    .get(middlewares.auth.access, controllers.student.get)
    .patch(middlewares.auth.access, controllers.student.patch)
    .delete(middlewares.auth.access, controllers.student.destroy)
student.route("/:stuid/balance")
    .get(middlewares.auth.access, controllers.student.balance)

//

export default student
