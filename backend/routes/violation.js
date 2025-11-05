import express from "express"
import controllers from "../controllers/index.js"
import middlewares from "../middlewares/index.js"

//

const violation = express.Router({ mergeParams: true })
violation
	.route("/")
	.get(middlewares.auth.access, controllers.violation.get)
violation
	.route("/:vioid")
	.get(middlewares.auth.access, controllers.violation.get)
violation
	.route("/student/:stuid")
	.get(middlewares.auth.access, controllers.violation.get)
violation
	.route("/activity-entry/:entid")
	.get(middlewares.auth.access, controllers.violation.get)
violation
	.route("/student/:stuid/activity-entry/:entid")
	.get(middlewares.auth.access, controllers.violation.get)
violation
    .route("/:vioid/student/:stuid/activity-entry/:entid")
    .get(middlewares.auth.access, controllers.violation.get)

//

export default violation
