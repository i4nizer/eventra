import { Sequelize } from "sequelize"
import config from "../config/index.js"

//

const run = async () => {
    // --- Create
    const sequelize = new Sequelize(config.env.sequelizeRaw, { logging: false })
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${config.env.sequelizeName}\`;`)
    await sequelize.close()
    console.info("Boot, database checked.")
}

//

export default { run }
