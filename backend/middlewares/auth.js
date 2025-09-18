import jwt from "jsonwebtoken"
import config from "../config/index.js"

//

const access = async (req, res, next) => {
    const access = req.cookies.access
    await Promise.resolve()
        .then(() => jwt.verify(access, config.env.jwtAccessSecret))
        .then((payload) => req.payload = payload)
        .then(() => next())
        .catch(() => res.status(401).send("Authorization required."))
}

//

export default { access }
