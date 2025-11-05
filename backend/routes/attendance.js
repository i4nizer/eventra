import express from "express"
import controllers from "../controllers/index.js"
import middlewares from "../middlewares/index.js"

//

const attendance = express.Router({ mergeParams: true })
attendance
	.route("/")
	.get(middlewares.auth.access, controllers.attendance.get)
attendance
	.route("/:attid")
	.get(middlewares.auth.access, controllers.attendance.get)
attendance
	.route("/student/:stuid")
	.get(middlewares.auth.access, controllers.attendance.get)
attendance
	.route("/activity-entry/:entid")
	.get(middlewares.auth.access, controllers.attendance.get)
attendance
	.route("/student/:stuid/activity-entry/:entid")
	.get(middlewares.auth.access, controllers.attendance.get)
	.post(middlewares.auth.access, controllers.attendance.post)
attendance
    .route("/:attid/student/:stuid/activity-entry/:entid")
    .get(middlewares.auth.access, controllers.attendance.get)

//

export default attendance
