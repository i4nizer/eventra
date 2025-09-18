import models from "../models/index.js"
import schema from "../schema/index.js"

//

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

export default { post, patch, destroy }
