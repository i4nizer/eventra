import models from "../models/index.js"
import schema from "../schema/index.js"
import { Op } from "sequelize"

//

const get = async (req, res) => {
    const payid = req.params.payid
    const vioid = req.params.vioid

    if (payid) {
        const filter = {
            id: payid,
            ...(vioid && { violationId: vioid }),
        }

        const payment = await models.payment.Payment.findOne({ where: filter })
        if (!payment) return res.status(404).send("Payment not found.")
        return res.json(payment.dataValues)
    }

    const parsed = schema.pagination.PaginationSchema.safeParse(req.query)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const options = {
        where: {
            ...(vioid && { violationId: vioid }),
            ...(parsed.data.idarr && { id: { [Op.in]: parsed.data.idarr } }),
            ...(parsed.data.alpha && { createdAt: { [Op.gte]: new Date(parsed.data.alpha) } }),
            ...(parsed.data.omega && { createdAt: { [Op.gte]: new Date(parsed.data.omega) } }),
        },
        ...(parsed.data.limit && { limit: parsed.data.limit }),
        ...(parsed.data.offset && { offset: parsed.data.offset }),
    }

    const payments = await models.payment.Payment.findAll(options)
    res.json(payments.map((s) => s.dataValues))
}

const post = async (req, res) => {
    if (!req.params.vioid) return res.status(400).send("Missing violation id.")
    const { vioid } = req.params

    const parsed = schema.payment.PaymentCreateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)

    const payment = await models.payment.Payment.create({ ...parsed.data, violationId: vioid })
    res.json(payment.dataValues)
}

const patch = async (req, res) => {
    if (!req.params.payid) return res.status(400).send("Missing payment id.")
    const { payid } = req.params
    
    const payment = await models.payment.Payment.findByPk(payid)
    if (!payment) return res.status(404).send("Payment not found.")
    
    const parsed = schema.payment.PaymentUpdateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)

    await payment.update(parsed.data)
    res.json(payment.dataValues)
}

const destroy = async (req, res) => {
    if (!req.params.payid) return res.status(400).send("Missing payment id.")
	const { payid } = req.params

	const payment = await models.payment.Payment.findByPk(payid)
	if (!payment) return res.status(404).send("Payment not found.")

    await payment.destroy()
    res.json(payment.dataValues)
}

//

export default { get, post, patch, destroy }
