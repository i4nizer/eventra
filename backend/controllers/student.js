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

    const students = await models.student.Student.findAll({
        where: filter,
        limit: parsed.data.limit,
        offset: parsed.data.offset,
    })

    res.json(students.map((s) => s.dataValues))
}

const post = async (req, res) => {
    const parsed = schema.student.StudentCreateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const student = await models.student.Student.create(parsed.data)
    res.json(student.dataValues)
}

const patch = async (req, res) => {
    const parsed = schema.student.StudentUpdateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const student = await models.student.Student.findOne({ where: { id: parsed.data.id } })
    if (!student) return res.status(404).send("Student not found.")

    await student.update({ ...parsed.data })
    res.json(student.dataValues)
}

//

export default { get, post, patch }
