import jwt from "jsonwebtoken"
import config from "../config/index.js"

//

const photo = async (req, res, next) => {
    const token = req.query.token
    if (!token) return res.status(401).send("Authorization required.")
    
    await Promise.resolve()
        .then(() => jwt.verify(token, config.env.jwtAccessSecret))
        .then((payload) => req.payload = payload)
        .then(() => next())
        .catch(() => res.status(401).send("Authorization required."))
}

const access = async (req, res, next) => {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).send("Authorization required.")
    
    const access = auth.split(" ")[1]
    await Promise.resolve()
        .then(() => jwt.verify(access, config.env.jwtAccessSecret))
        .then((payload) => req.payload = payload)
        .then(() => next())
        .catch(() => res.status(401).send("Authorization required."))
}

//

export default { photo, access }
