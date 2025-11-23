import { Model, DataTypes } from "sequelize";

//

class Activity extends Model {}

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
  fine: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 20,
  },
  description: {
    type: DataTypes.STRING(512),
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
  evaluated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
};

const opts = (sequelize) => ({
  sequelize,
  tableName: "activities",
  timestamps: true,
});

//

export default { Activity, attr, opts };
