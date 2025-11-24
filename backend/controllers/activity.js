import models from "../models/index.js"
import schema from "../schema/index.js"
import { Op } from "sequelize"

//

const get = async (req, res) => {
    if (req.params.actid) {
        const actid = req.params.actid
        const activity = await models.activity.Activity.findOne({ where: { id: actid } })
        
        if (!activity) return res.status(404).send("Activity not found.")
        return res.json(activity.dataValues)
    }

    const parsed = schema.pagination.PaginationSchema.safeParse(req.query)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const options = {
        where: {
            ...(parsed.data.idarr && { id: { [Op.in]: parsed.data.idarr } }),
            ...(parsed.data.alpha && { createdAt: { [Op.gte]: new Date(parsed.data.alpha) } }),
            ...(parsed.data.omega && { createdAt: { [Op.gte]: new Date(parsed.data.omega) } }),
        },
        ...(parsed.data.limit && { limit: parsed.data.limit }),
        ...(parsed.data.offset && { offset: parsed.data.offset }),
    }

    const activitys = await models.activity.Activity.findAll(options)
    res.json(activitys.map((s) => s.dataValues))
}

const post = async (req, res) => {
    const parsed = schema.activity.ActivityCreateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const activity = await models.activity.Activity.create(parsed.data)
    res.json(activity.dataValues)
}

const patch = async (req, res) => {
    const actid = req.params.actid
    if (!actid) return res.status(400).send("Activity id expected.")

    const activity = await models.activity.Activity.findOne({ where: { id: actid } })
    if (!activity) return res.status(404).send("Activity not found.")
    
    const parsed = schema.activity.ActivityUpdateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)

    await activity.update({ ...parsed.data })
    res.json(activity.dataValues)
}

const destroy = async (req, res) => {
    const actid = req.params.actid
    if (!actid) return res.status(400).send("Activity id expected.")
    
    const activity = await models.activity.Activity.findOne({ where: { id: actid } })
    if (!activity) return res.status(404).send("Activity not found.")

    await activity.destroy()
    res.json({})
}

//

export default { get, post, patch, destroy }
