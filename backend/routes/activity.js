import express from "express"
import controllers from "../controllers/index.js"
import middlewares from "../middlewares/index.js"
import activityEntry from "./activity-entry.js"
import activitySection from "./activity-section.js"

//

const activity = express.Router()
activity.use("/:actid/entry", activityEntry)
activity.use("/:actid/section", activitySection)
activity.route("/")
    .get(middlewares.auth.access, controllers.activity.get)
    .post(middlewares.auth.access, controllers.activity.post)
activity.route("/:actid")
    .get(middlewares.auth.access, controllers.activity.get)
    .patch(middlewares.auth.access, controllers.activity.patch)
    .delete(middlewares.auth.access, controllers.activity.destroy)

//

export default activity
