import config from "../config/index.js";
import models from "../models/index.js";

//

const run = async () => {
    // --- Init
    models.user.User.init(models.user.attr, models.user.opts(config.sequelize))
    models.section.Section.init(models.section.attr, models.section.opts(config.sequelize))
    models.student.Student.init(models.student.attr, models.student.opts(config.sequelize))

    // --- Assoc
    models.section.Section.hasMany(models.student.Student, { foreignKey: "sectionId", onDelete: "CASCADE" })
    models.student.Student.belongsTo(models.section.Section, { as: "section", foreignKey: "sectionId" })

    // --- Connection
    await config.sequelize.authenticate()
    console.info("Boot, sequelize authenticated.")

    if (!config.env.sequelizeSync) return
    await config.sequelize.sync({ alter: true })
    console.info("Boot, sequelize tables synced.")
}

//

export default { run }
