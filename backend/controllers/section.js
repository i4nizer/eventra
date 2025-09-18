import z from "zod"
import models from "../models/index.js"
import schema from "../schema/index.js"
import { Op } from "sequelize"

//

const get = async (req, res) => {
    const parser = schema.pagination.PaginationSchema.extend({ id: z.coerce.number().optional() })
    const parsed = parser.safeParse(req.query)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const filter = {
        ...(parsed.data.id && { id: parsed.data.id }),
        ...(parsed.data.alpha && { createdAt: { [Op.gte]: new Date(parsed.data.alpha) } }),
        ...(parsed.data.omega && { createdAt: { [Op.gte]: new Date(parsed.data.omega) } }),
    }

    const sections = await models.section.Section.findAll({
        where: filter,
        limit: parsed.data.limit,
        offset: parsed.data.offset,
    })

    req.json(sections.map((s) => s.dataValues))
}

const post = async (req, res) => {
    const parsed = schema.section.SectionCreateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const section = await models.section.Section.create(parsed.data)
    res.json(section.dataValues)
}

const patch = async (req, res) => {
    const parsed = schema.section.SectionUpdateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const section = await models.section.Section.findOne({ where: { id: parsed.data.id } })
    if (!section) return res.status(404).send("Section not found.")

    await section.update({ ...parsed.data })
    res.json(section.dataValues)
}

const destroy = async (req, res) => {
    const parser = schema.section.SectionSchema.pick({ id: true })
    const parsed = parser.safeParse(req.query)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const rows = await models.section.Section.destroy({ where: { id: parsed.data.id } })
    
    if (rows <= 0) res.status(404).send("Section not found.")
    else res.json({})
}

//

export default { get, post, patch, destroy }
