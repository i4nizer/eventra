import express from "express"
import auth from "./auth.js"
import section from "./section.js"
import activity from "./activity.js"
import attendance from "./attendance.js"
import violation from "./violation.js"
import payment from "./payment.js"
import middlewares from "../middlewares/index.js"
import esp from "./esp/index.js"

//

const routes = express.Router()
routes.use("/auth", auth)
routes.use("/section", section)
routes.use("/activity", activity)
routes.use("/attendance", attendance)
routes.use("/violation", violation)
routes.use("/payment", payment)
routes.use("/uploads/photo", middlewares.auth.photo, express.static(`uploads/photo`))
routes.use("/esp", esp)

//

export default routes