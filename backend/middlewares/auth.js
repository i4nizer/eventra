import jwt from "jsonwebtoken"
import config from "../config/index.js"

//

const access = async (req, res, next) => {
    const auth = req.headers.authorization
    console.info(req.headers)
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).send("Authorization required.")
    
    const access = auth.split(" ")[1]
    await Promise.resolve()
        .then(() => jwt.verify(access, config.env.jwtAccessSecret))
        .then((payload) => req.payload = payload)
        .then(() => next())
        .catch(() => res.status(401).send("Authorization required."))
}

//

export default { access }
