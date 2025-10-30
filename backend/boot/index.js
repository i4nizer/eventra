import database from "./database.js"
import sequelize from "./sequelize.js"

//

const run = async () => {
    await database.run()
    await sequelize.run()
}

//

export default { run, database, sequelize }
