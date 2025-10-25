import express from "express"
import controllers from "../controllers/index.js"
import middlewares from "../middlewares/index.js"

//

const activityEntry = express.Router({ mergeParams: true })
activityEntry.route("/")
    .get(middlewares.auth.access, controllers.activityEntry.get)
    .post(middlewares.auth.access, controllers.activityEntry.post)
activityEntry.route("/:entid")
    .get(middlewares.auth.access, controllers.activityEntry.get)
    .patch(middlewares.auth.access, controllers.activityEntry.patch)
    .delete(middlewares.auth.access, controllers.activityEntry.destroy)

//

export default activityEntry
