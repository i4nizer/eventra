import { Model, DataTypes } from "sequelize"

//

class Violation extends Model {}

const attr = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
    },
    fine: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
	studentId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "students", key: "id" },
		onDelete: "CASCADE",
	},
	activityEntryId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "activities-entries", key: "id" },
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
    tableName: "violations",
    timestamps: true,
})

//

export default { Violation, attr, opts }
