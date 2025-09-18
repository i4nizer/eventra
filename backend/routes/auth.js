import express from "express"
import controllers from "../controllers/index.js"

//

const auth = express.Router()
auth.post("/signup", controllers.auth.signUp)

//

export default auth
