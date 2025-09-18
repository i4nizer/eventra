import { Sequelize } from "sequelize"
import env from "./env.js"

//

const sequelize = new Sequelize(
    env.sequelizeUri,
    { logging: env.sequelizeLogging ? console.log : false }
)

//

export default sequelize