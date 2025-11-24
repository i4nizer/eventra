import express from "express"
import controllers from "../../controllers/index.js"
import attendance from "./attendance.js"

//

const event = express.Router({ mergeParams: true })
event.use("/:eveid/attendance", attendance)
event.route("/").get(controllers.esp.event.get)
event.route("/:eveid").get(controllers.esp.event.get)

//

export default event
