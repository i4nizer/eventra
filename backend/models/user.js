import { Model, DataTypes } from "sequelize"

//

class User extends Model {}

const attr = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: "email",
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
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
	tableName: "users",
	timestamps: true,
})

//

export default { User, attr, opts }
