import express from "express"
import controllers from "../controllers/index.js"
import middlewares from "../middlewares/index.js"

//

const payment = express.Router({ mergeParams: true })
payment
	.route("/")
	.get(middlewares.auth.access, controllers.payment.get)
payment
	.route("/:payid")
	.get(middlewares.auth.access, controllers.payment.get)
	.patch(middlewares.auth.access, controllers.payment.patch)
	.delete(middlewares.auth.access, controllers.payment.destroy)
payment
	.route("/violation/:vioid")
	.get(middlewares.auth.access, controllers.payment.get)
	.post(middlewares.auth.access, controllers.payment.post)

//

export default payment
