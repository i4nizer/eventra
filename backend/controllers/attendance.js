import models from "../models/index.js"
import schema from "../schema/index.js"
import { Op } from "sequelize"

//

const get = async (req, res) => {
    const entid = req.params.entid
    const attid = req.params.attid
    const stuid = req.params.stuid

    if (attid) {
        const filter = {
            id: attid,
            ...(stuid && { studentId: stuid }),
            ...(entid && { entryId: entid }),
        }

        const attendance = await models.attendance.Attendance.findOne({ where: filter })
        if (!attendance) return res.status(404).send("Attendance not found.")
        return res.json(attendance.dataValues)
    }

    const parsed = schema.pagination.PaginationSchema.safeParse(req.query)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const options = {
        where: {
            ...(stuid && { studentId: stuid }),
            ...(entid && { entryId: entid }),
            ...(parsed.data.idarr && { id: { [Op.in]: parsed.data.idarr } }),
            ...(parsed.data.alpha && { createdAt: { [Op.gte]: new Date(parsed.data.alpha) } }),
            ...(parsed.data.omega && { createdAt: { [Op.gte]: new Date(parsed.data.omega) } }),
        },
        ...(parsed.data.limit && { limit: parsed.data.limit }),
        ...(parsed.data.offset && { offset: parsed.data.offset }),
    }

    const attendances = await models.attendance.Attendance.findAll(options)
    res.json(attendances.map((s) => s.dataValues))
}

const post = async (req, res) => {
    if (!req.params.stuid && !req.params.entid) return res.status(400).send("Missing stuid and entid.")
    const { stuid, entid } = req.params

    const attendance = await models.attendance.Attendance.create({ studentId: stuid, entryId: entid })
    res.json(attendance.dataValues)
}

//

export default { get, post }
