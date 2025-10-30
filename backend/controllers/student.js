import models from "../models/index.js"
import schema from "../schema/index.js"
import { Op } from "sequelize"

//

const get = async (req, res) => {
    const secid = req.params.secid
    const stuid = req.params.stuid

    if (stuid) {
        const filter = { id: stuid, ...(secid && { sectionId: secid }) }
        const student = await models.student.Student.findOne({ where: filter })
        if (!student) return res.status(404).send("Student not found.")
        return res.json(student.dataValues)
    }

    const parsed = schema.pagination.PaginationSchema.safeParse(req.query)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const options = {
        where: {
            ...(secid && { sectionId: secid }),
            ...(parsed.data.alpha && { createdAt: { [Op.gte]: new Date(parsed.data.alpha) } }),
            ...(parsed.data.omega && { createdAt: { [Op.gte]: new Date(parsed.data.omega) } }),
        },
        ...(parsed.data.limit && { limit: parsed.data.limit }),
        ...(parsed.data.offset && { offset: parsed.data.offset }),
    }

    const students = await models.student.Student.findAll(options)
    res.json(students.map((s) => s.dataValues))
}

const post = async (req, res) => {
    const secid = req.params.secid
    if (!secid) return res.status(400).send("Section id expected.")
    
    const parsed = schema.student.StudentCreateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const student = await models.student.Student.create({ ...parsed.data, sectionId: secid })
    res.json(student.dataValues)
}

const patch = async (req, res) => {
    const secid = req.params.secid
    const stuid = req.params.stuid
    if (!stuid) return res.status(400).send("Student id expected.")

    const filter = { id: stuid, ...(secid && { sectionId: secid }) }
    const student = await models.student.Student.findOne({ where: filter })
    if (!student) return res.status(404).send("Student not found.")
    
    const parsed = schema.student.StudentUpdateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)

    await student.update({ ...parsed.data })
    res.json(student.dataValues)
}

const destroy = async (req, res) => {
    const secid = req.params.secid
    const stuid = req.params.stuid
    if (!stuid) return res.status(400).send("Student id expected.")
    
    const filter = { id: stuid, ...(secid && { sectionId: secid }) }
    const student = await models.student.Student.findOne({ where: filter })
    if (!student) return res.status(404).send("Student not found.")

    await student.destroy()
    res.json({})
}

//

export default { get, post, patch, destroy }
