import models from "../models/index.js"
import schema from "../schema/index.js"
import { Op } from "sequelize"

//

const get = async (req, res) => {
    const entid = req.params.entid
    const vioid = req.params.vioid
    const stuid = req.params.stuid

    if (vioid) {
        const filter = {
            id: vioid,
            ...(stuid && { studentId: stuid }),
            ...(entid && { activityEntryId: entid }),
        }

        const violation = await models.violation.Violation.findOne({ where: filter })
        if (!violation) return res.status(404).send("Violation not found.")
        return res.json(violation.dataValues)
    }

    const parsed = schema.pagination.PaginationSchema.safeParse(req.query)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const options = {
        where: {
            ...(stuid && { studentId: stuid }),
            ...(entid && { activityEntryId: entid }),
            ...(parsed.data.alpha && { createdAt: { [Op.gte]: new Date(parsed.data.alpha) } }),
            ...(parsed.data.omega && { createdAt: { [Op.gte]: new Date(parsed.data.omega) } }),
        },
        ...(parsed.data.limit && { limit: parsed.data.limit }),
        ...(parsed.data.offset && { offset: parsed.data.offset }),
    }

    const violations = await models.violation.Violation.findAll(options)
    res.json(violations.map((s) => s.dataValues))
}

//

export default { get }
