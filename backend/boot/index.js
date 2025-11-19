import database from "./database.js"
import multer from "./multer.js"
import sequelize from "./sequelize.js"

//

const run = async () => {
    await multer.run()
    await database.run()
    await sequelize.run()
}

//

export default { run, database, sequelize }
