import express from "express"
import controllers from "../../controllers/index.js"

//

const student = express.Router({ mergeParams: true })
student.route("/:rfid").get(controllers.esp.student.get)

//

export default student
