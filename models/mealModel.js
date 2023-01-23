const { DataTypes } = require("sequelize");
const { createDB } = require("../config/db");

const Meal = createDB.define("Meals", {
  id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER },
  name: DataTypes.STRING,
  time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  calories: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 250 },
});

module.exports = Meal;
