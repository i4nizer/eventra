import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import models from "../models/index.js"
import schema from "../schema/index.js"
import env from "../config/env.js"

//

const signUp = async (req, res) => {
    const parsed = schema.user.UserCreateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const hashed = await bcrypt.hash(parsed.data.password, 10)
    const user = await models.user.User.create({ ...parsed.data, password: hashed })

    res.json({ ...user.dataValues, password: "" })
}

const signIn = async (req, res) => {
    const parser = schema.user.UserSchema.pick({ email: true, password: true })
    const parsed = parser.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error.issues.at(0)?.message)
    
    const user = await models.user.User.findOne({ where: { email: parsed.data.email } })
    if (!user) return res.status(404).send("User not found.")
    
    const match = await bcrypt.compare(parsed.data.password, user.dataValues.password)
    if (!match) return res.status(400).send("Incorrect credentials.")
    
    const access = jwt.sign(
        { uid: user.dataValues.id },
        env.jwtAccessSecret,
        { expiresIn: env.jwtAccessLife / 1000 }
    )
    
    res.cookie("access", access, {
        httpOnly: true,
        secure: false,
        sameSite: false,
        maxAge: env.jwtAccessLife,
    })
    
    res.json({ ...user.dataValues, password: "" })
}

//

export default { signUp, signIn }
