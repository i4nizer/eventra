import bcrypt from "bcrypt"
import config from "../config/index.js"
import models from "../models/index.js"

//

const run = async () => {
    // --- Keep only one
    const count = await models.user.User.count()
    if (count > 1) await models.user.User.destroy()
    const { adminName: name, adminEmail: email, adminPassword } = config.env
    const password = await bcrypt.hash(adminPassword, 10)
    const [_, created] = await models.user.User.findOrCreate({ where: {}, defaults: { name, email, password } })
    console.info(`Boot, admin user ${created ? "created" : "found"}.`)
}

//

export default { run }
