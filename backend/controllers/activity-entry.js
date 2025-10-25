import models from "../models/index.js"
import schema from "../schema/index.js"
import { Op } from "sequelize"

//

const get = async (req, res) => {
    const actid = req.params.actid
    const entid = req.params.entid

    if (entid) {
        const filter = { id: entid, ...(actid && { activityId: actid }) }
        const activityEntry = await models.activityEntry.ActivityEntry.findOne({ where: filter })
        if (!activityEntry) return res.status(404).send("Activity entry not found.")
        return res.json(activityEntry.dataValues)
    }

    const parsed = schema.pagination.PaginationSchema.safeParse(req.query)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const options = {
        where: {
            ...(actid && { activityId: actid }),
            ...(parsed.data.alpha && { createdAt: { [Op.gte]: new Date(parsed.data.alpha) } }),
            ...(parsed.data.omega && { createdAt: { [Op.gte]: new Date(parsed.data.omega) } }),
        },
        ...(parsed.data.limit && { limit: parsed.data.limit }),
        ...(parsed.data.offset && { offset: parsed.data.offset }),
    }

    const activityEntrys = await models.activityEntry.ActivityEntry.findAll(options)
    res.json(activityEntrys.map((s) => s.dataValues))
}

const post = async (req, res) => {
    const actid = req.params.actid
    if (!actid) return res.status(400).send("Activity id expected.")
    
    const parsed = schema.activityEntry.ActivityEntryCreateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const activityEntry = await models.activityEntry.ActivityEntry.create({ ...parsed.data, activityId: actid })
    res.json(activityEntry.dataValues)
}

const patch = async (req, res) => {
    const actid = req.params.actid
    const entid = req.params.entid
    if (!entid) return res.status(400).send("Activity entry id expected.")

    const filter = { id: entid, ...(actid && { activityId: actid }) }
    const activityEntry = await models.activityEntry.ActivityEntry.findOne({ where: filter })
    if (!activityEntry) return res.status(404).send("Activity entry not found.")
    
    const parsed = schema.activityEntry.ActivityEntryUpdateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)

    await activityEntry.update({ ...parsed.data })
    res.json(activityEntry.dataValues)
}

const destroy = async (req, res) => {
    const actid = req.params.actid
    const entid = req.params.entid
    if (!entid) return res.status(400).send("Activity entry id expected.")
    
    const filter = { id: entid, ...(actid && { activityId: actid }) }
    const activityEntry = await models.activityEntry.ActivityEntry.findOne({ where: filter })
    if (!activityEntry) return res.status(404).send("Activity entry not found.")

    await activityEntry.destroy()
    res.json({})
}

//

export default { get, post, patch, destroy }
