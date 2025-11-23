import database from "./database.js"
import multer from "./multer.js"
import sequelize from "./sequelize.js"
import task from "./task.js"

//

const run = async () => {
    await multer.run()
    await database.run()
    await sequelize.run()
    await task.run()
}

//

export default { run, database, sequelize }
