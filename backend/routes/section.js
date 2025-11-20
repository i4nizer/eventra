import express from "express"
import controllers from "../controllers/index.js"
import middlewares from "../middlewares/index.js"
import student from "./student.js"

//

const section = express.Router()
section.use("/:secid/student", student)
section.route("/")
    .get(middlewares.auth.access, controllers.section.get)
    .post(middlewares.auth.access, controllers.section.post)
section.route("/student")
    .get(middlewares.auth.access, controllers.student.get)
section.route("/:secid")
    .get(middlewares.auth.access, controllers.section.get)
    .patch(middlewares.auth.access, controllers.section.patch)
    .delete(middlewares.auth.access, controllers.section.destroy)

//

export default section
