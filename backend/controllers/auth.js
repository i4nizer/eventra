import bcrypt from "bcrypt"
import models from "../models/index.js"
import schema from "../schema/index.js"

//

const signUp = async (req, res) => {
    const parsed = schema.user.UserCreateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const hashed = await bcrypt.hash(parsed.data.password, 10)
    const user = await models.user.User.create({ ...parsed.data, password: hashed })

    res.json({ ...user.dataValues, password: "" })
}

//

export default { signUp }
