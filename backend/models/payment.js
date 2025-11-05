import { Model, DataTypes } from "sequelize"

//

class Payment extends Model {}

const attr = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	value: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	remarks: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: "",
	},
	violationId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "violations", key: "id" },
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
    tableName: "payments",
    timestamps: true,
})

//

export default { Payment, attr, opts }
