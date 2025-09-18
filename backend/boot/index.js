import sequelize from "./sequelize.js"

//

const run = async () => {
    await sequelize.run()
}

//

export default { run, sequelize }
