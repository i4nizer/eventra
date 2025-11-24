import models from "../models/index.js"
import schema from "../schema/index.js"
import { Op } from "sequelize"

//

const get = async (req, res) => {
    const actid = req.params.actid
    const aseid = req.params.aseid
    const secid = req.params.secid

    if (aseid) {
        const filter = {
            id: aseid,
            ...(secid && { sectionId: secid }),
            ...(actid && { activityId: actid }),
        }

        const activitySection = await models.activitySection.ActivitySection.findOne({ where: filter })
        if (!activitySection) return res.status(404).send("Activity section not found.")
        return res.json(activitySection.dataValues)
    }

    const parsed = schema.pagination.PaginationSchema.safeParse(req.query)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const options = {
        where: {
            ...(secid && { sectionId: secid }),
            ...(actid && { activityId: actid }),
            ...(parsed.data.idarr && { id: { [Op.in]: parsed.data.idarr } }),
            ...(parsed.data.alpha && { createdAt: { [Op.gte]: new Date(parsed.data.alpha) } }),
            ...(parsed.data.omega && { createdAt: { [Op.gte]: new Date(parsed.data.omega) } }),
        },
        ...(parsed.data.limit && { limit: parsed.data.limit }),
        ...(parsed.data.offset && { offset: parsed.data.offset }),
    }

    const activitySections = await models.activitySection.ActivitySection.findAll(options)
    res.json(activitySections.map((s) => s.dataValues))
}

const post = async (req, res) => {
    const actid = req.params.actid
    if (!actid) return res.status(400).send("Activity id expected.")
    
    const secid = req.params.secid
    if (!secid) return res.status(400).send("Section id expected.")
    
    const activitySection = await models.activitySection.ActivitySection.create({ activityId: actid, sectionId: secid })
    res.json(activitySection.dataValues)
}

const patch = async (req, res) => {
    const actid = req.params.actid
    const aseid = req.params.aseid
    if (!aseid) return res.status(400).send("Activity section id expected.")
    
    const secid = req.params.secid
	if (!secid) return res.status(400).send("Section id expected.")

    const filter = { id: aseid, ...(actid && { activityId: actid }) }
    const activitySection = await models.activitySection.ActivitySection.findOne({ where: filter })
    if (!activitySection) return res.status(404).send("Activity section not found.")
    
    await activitySection.update({ sectionId: secid })
    res.json(activitySection.dataValues)
}

const destroy = async (req, res) => {
    const actid = req.params.actid
    const aseid = req.params.aseid
    const secid = req.params.secid
    if (!aseid) return res.status(400).send("Activity section id expected.")
    
    const filter = {
		id: aseid,
		...(secid && { sectionId: secid }),
		...(actid && { activityId: actid }),
    }
    
    const activitySection = await models.activitySection.ActivitySection.findOne({ where: filter })
    if (!activitySection) return res.status(404).send("Activity section not found.")

    await activitySection.destroy()
    res.json({})
}

//

export default { get, post, patch, destroy }
