import { Op } from "sequelize"
import models from "../../models/index.js"

//

const get = async (req, res) => {
    const eveid = req.params.eveid

    if (eveid) {
        const filter = { id: eveid, finishAt: { [Op.gt]: new Date() } }
        const event = await models.activity.Activity.findOne({ where: filter })
        if (!event) return res.status(404).send("Event not found.")
        return res.json(event.dataValues)
    }

    const events = await models.activity.Activity.findAll()
    return res.json(events.map((e) => e.dataValues))
}

//

export default { get }
