import config from "../config/index.js";
import models from "../models/index.js";

//

const run = async () => {
    // --- Init
    models.user.User.init(models.user.attr, models.user.opts(config.sequelize))

    // --- Relationship

    // --- Connection
    await config.sequelize.authenticate()
    console.info("Boot, sequelize authenticated.")

    if (!config.env.sequelizeSync) return
    await config.sequelize.sync({ alter: true })
    console.info("Boot, sequelize tables synced.")
}

//

export default { run }
