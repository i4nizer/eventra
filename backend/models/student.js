import { Model, DataTypes } from "sequelize"

//

class Student extends Model {}

const attr = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	sid: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: "sid",
	},
	rfid: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: "rfid",
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
	photo: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	sectionId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: "sections", key: "id" },
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
    tableName: "students",
    timestamps: true,
})

//

export default { Student, attr, opts }
