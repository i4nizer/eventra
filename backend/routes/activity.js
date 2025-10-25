import express from "express"
import controllers from "../controllers/index.js"
import middlewares from "../middlewares/index.js"

//

const activity = express.Router()
activity.route("/")
    .get(middlewares.auth.access, controllers.activity.get)
    .post(middlewares.auth.access, controllers.activity.post)
activity.route("/:actid")
    .get(middlewares.auth.access, controllers.activity.get)
    .patch(middlewares.auth.access, controllers.activity.patch)
    .delete(middlewares.auth.access, controllers.activity.destroy)

//

export default activity
