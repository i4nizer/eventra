import express from "express"
import controllers from "../../controllers/index.js"

//

const attendance = express.Router({ mergeParams: true })
attendance.route("/").post(controllers.esp.attendance.post)

//

export default attendance
