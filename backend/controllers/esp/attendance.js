import { Op } from "sequelize"
import models from "../../models/index.js"

//

const post = async (req, res) => {
    const eveid = req.params.eveid
    if (!eveid) return res.status(400).send("Event id required.")
    
    // --- Find event
    const event = await models.activity.Activity.findByPk(eveid)
    if (!event) return res.status(404).send("Event not found.")
    
    // --- Check event expiry
    const expired = Date.now() > event.dataValues.finishAt.getTime()
    if (expired) return res.status(400).send("Event already expired.")
    
    // --- Find active event entry
    const entfil = { activityId: event.id, startAt: { [Op.lte]: new Date() }, finishAt: { [Op.gte]: new Date() } }
    const entry = await models.activityEntry.ActivityEntry.findOne({ where: entfil })
    if (!entry) return res.status(400).send(`Event "${event.name}" currently doesn't accept attendance.`)

    // --- Find student using rfid
    const { rfid } = req.body
    if (!rfid) return res.status(400).send("Student's rfid required.")
    
    const student = await models.student.Student.findOne({ where: { rfid } })
    if (!student) return res.status(404).send("Student not registered.")
    
    // --- Check if the student's section is part of the event
    const secfil = { sectionId: student.sectionId, activityId: event.id }
    const section = await models.activitySection.ActivitySection.findOne({ where: secfil })
    if (!section) return res.status(400).send("Student is not on the list.")
    
    // --- Check if the student already have an attendance entry
    const attdata = { entryId: entry.id, studentId: student.id }
    const attendance = await models.attendance.Attendance.findOne({ where: attdata })
    if (attendance) return res.status(403).send("Student already have an attendance to this event.")
    
    await models.attendance.Attendance.create(attdata)
    return res.send(`Attendance recorded successfully for ${student.name}.`)
}

//

export default { post }
