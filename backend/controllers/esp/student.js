import models from "../../models/index.js"

//

const get = async (req, res) => {
    const { rfid } = req.params
    if (!rfid) return res.status(400).send("Student's rfid required.")
    
    // --- Find student using rfid
    const student = await models.student.Student.findOne({ where: { rfid } })
    if (!student) return res.status(404).send("Student not registered.")
    
    // --- Find and sum all of the student's violations
    const violations = await models.violation.Violation.findAll({ where: { studentId: student.id } })
    const fines = violations.reduce((prev, curr) => prev + curr.dataValues.fine, 0)

    // --- Find all payments for the violations
    const vioids = violations.map((v) => v.dataValues.id)
    const payments = await models.payment.Payment.findAll({ where: { violationId: { [Op.in]: vioids } } })
    const settled = payments.reduce((prev, curr) => prev + curr.dataValues.value, 0)

    // --- Send student and balance
    return res.json({ ...student.dataValues, balance: fines - settled })
}

//

export default { get }
