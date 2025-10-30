import { Model, DataTypes } from "sequelize"

//

class ActivitySection extends Model {}

const attr = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	sectionId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "sections", key: "id" },
		onDelete: "CASCADE",
	},
	activityId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "activities", key: "id" },
		onDelete: "CASCADE",
	},
	createdAt: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
	},
	updatedAt: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
	},
}

const opts = (sequelize) => ({
    sequelize,
    tableName: "activities-sections",
    timestamps: true,
})

//

export default { ActivitySection, attr, opts }
