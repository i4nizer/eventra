import models from "../models/index.js"
import schema from "../schema/index.js"
import { Op } from "sequelize"

//

const get = async (req, res) => {
    if (req.params.secid) {
        const secid = req.params.secid
        const section = await models.section.Section.findOne({ where: { id: secid } })
        
        if (!section) return res.status(404).send("Section not found.")
        return res.json(section.dataValues)
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

    const sections = await models.section.Section.findAll(options)
    res.json(sections.map((s) => s.dataValues))
}

const post = async (req, res) => {
    const parsed = schema.section.SectionCreateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const section = await models.section.Section.create(parsed.data)
    res.json(section.dataValues)
}

const patch = async (req, res) => {
    const secid = req.params.secid
    if (!secid) return res.status(400).send("Section id expected.")

    const section = await models.section.Section.findOne({ where: { id: secid } })
    if (!section) return res.status(404).send("Section not found.")
    
    const parsed = schema.section.SectionUpdateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)

    await section.update({ ...parsed.data })
    res.json(section.dataValues)
}

const destroy = async (req, res) => {
    const secid = req.params.secid
    if (!secid) return res.status(400).send("Section id expected.")
    
    const section = await models.section.Section.findOne({ where: { id: secid } })
    if (!section) return res.status(404).send("Section not found.")

    await section.destroy()
    res.json({})
}

//

export default { get, post, patch, destroy }
