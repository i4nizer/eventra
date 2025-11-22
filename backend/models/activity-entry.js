import { Model, DataTypes } from "sequelize"

//

class ActivityEntry extends Model {}

const attr = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: "",
	},
	startAt: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	finishAt: {
		type: DataTypes.DATE,
		allowNull: false,
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
    tableName: "activities-entries",
    timestamps: true,
})

//

export default { ActivityEntry, attr, opts }
