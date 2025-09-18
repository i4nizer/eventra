import models from "../models/index.js"
import schema from "../schema/index.js"

//

const post = async (req, res) => {
    const parsed = schema.section.SectionCreateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const section = await models.section.Section.create(parsed.data)
    res.json(section.dataValues)
}

//

export default { post }
