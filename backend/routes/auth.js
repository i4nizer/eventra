import express from "express"
import controllers from "../controllers/index.js"

//

const auth = express.Router()
auth.post("/sign-up", controllers.auth.signUp)
auth.post("/sign-in", controllers.auth.signIn)
auth.post("/sign-out", controllers.auth.signOut)

//

export default auth
