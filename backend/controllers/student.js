import models from "../models/index.js"
import schema from "../schema/index.js"

//

const post = async (req, res) => {
    const parsed = schema.student.StudentCreateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const student = await models.student.Student.create(parsed.data)
    res.json(student.dataValues)
}

//

export default { post }
