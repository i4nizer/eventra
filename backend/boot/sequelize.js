import config from "../config/index.js";
import models from "../models/index.js";

//

const run = async () => {
    // --- Init
    models.user.User.init(models.user.attr, models.user.opts(config.sequelize))
    models.section.Section.init(models.section.attr, models.section.opts(config.sequelize))
    models.student.Student.init(models.student.attr, models.student.opts(config.sequelize))
    models.activity.Activity.init(models.activity.attr, models.activity.opts(config.sequelize))
    models.activityEntry.ActivityEntry.init(models.activityEntry.attr, models.activityEntry.opts(config.sequelize))
    models.activitySection.ActivitySection.init(models.activitySection.attr, models.activitySection.opts(config.sequelize))

    // --- Assoc
    models.section.Section.hasMany(models.student.Student, { foreignKey: "sectionId", onDelete: "CASCADE" })
    models.student.Student.belongsTo(models.section.Section, { as: "section", foreignKey: "sectionId" })
    models.activity.Activity.hasMany(models.activityEntry.ActivityEntry, { foreignKey: "activityId", onDelete: "CASCADE" })
    models.activity.Activity.hasMany(models.activitySection.ActivitySection, { foreignKey: "activityId", onDelete: "CASCADE" })
    models.activityEntry.ActivityEntry.belongsTo(models.activity.Activity, { as: "activity", foreignKey: "activityId" })
    models.activitySection.ActivitySection.belongsTo(models.activity.Activity, { as: "activity", foreignKey: "activityId" })

    // --- Connection
    await config.sequelize.authenticate()
    console.info("Boot, sequelize authenticated.")

    if (!config.env.sequelizeSync) return
    await config.sequelize.sync({ alter: true })
    console.info("Boot, sequelize tables synced.")
}

//

export default { run }
