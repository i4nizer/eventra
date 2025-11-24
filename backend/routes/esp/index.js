import express from "express"
import event from "./event.js"
import student from "./student.js"

//

const esp = express.Router({ mergeParams: true })
esp.use("/event", event)
esp.use("/student", student)

//

export default esp
