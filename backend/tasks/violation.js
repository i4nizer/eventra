import models from "../models/index.js"
import { Op } from "sequelize"

//

let busy = false

//

const run = async (interval = 1000) => {
    setInterval(() => loop().catch(console.error).finally(() => busy = false), interval)
    console.info(`Task, violation task running.`)
}

const loop = async () => {
    if (busy) return
    busy = true

    // --- Find unevaluated activities
    const condition = { evaluated: false, finishAt: { [Op.lte]: new Date() } }
    const activities = await models.activity.Activity.findAll({ where: condition })
    if (activities.length <= 0) return busy = false

    const aids = activities.map((a) => a.dataValues.id)
    const entries = await models.activityEntry.ActivityEntry.findAll({ where: { activityId: { [Op.in]: aids } } })
    const sections = await models.activitySection.ActivitySection.findAll({ where: { activityId: { [Op.in]: aids } } })
    const sids = sections.map((s) => s.dataValues.id)
    const students = await models.student.Student.findAll({ where: { sectionId: { [Op.in]: sids } } })
    const dids = students.map((s) => s.dataValues.id)
    const attendances = await models.attendance.Attendance.findAll({ where: { studentId: { [Op.in]: dids } } })

    // --- Evaluate
    const violations = []
    for (const activity of activities) {
        const ents = entries.filter((e) => e.activityId == activity.id)
        const secs = sections.filter((s) => s.activityId == activity.id)
        const stus = students.filter((t) => secs.some((s) => s.id == t.sectionId))
        const atts = attendances.filter((a) => stus.some((t) => t.id == a.studentId))
        const vios = evaluate(activity, ents, stus, atts)
        violations.push(...vios)
    }
    
    // --- Avoid duplicate violation
    const viochks = violations.map((v) => ({ entryId: v.entryId, studentId: v.studentId }))
    const viodups = await models.violation.Violation.findAll({ where: { [Op.or]: viochks } })
    const vdedups = violations.filter((v) => !viodups.some((d) => d.entryId == v.entryId && d.studentId == v.studentId))

    if (vdedups.length > 0) await models.violation.Violation.bulkCreate(vdedups)
    await models.activity.Activity.update({ evaluated: true }, { where: { id: { [Op.in]: aids } } })
    busy = false
}

const evaluate = (activity, entries, students, attendances) => {
    const violations = []
    for (const entry of entries) {
        for (const student of students) {
            const attended = attendances.some((a) => a.entryId == entry.id && a.studentId == student.id)
            if (!attended) violations.push({ fine: activity.fine, entryId: entry.id, studentId: student.id })
        }
    }
    return violations
}

//

export default { run }
