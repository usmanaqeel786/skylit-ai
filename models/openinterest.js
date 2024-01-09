"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OpenInterest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OpenInterest.init(
    {
      ms_of_day: DataTypes.INTEGER,
      open_interest: DataTypes.INTEGER,
      counter: DataTypes.INTEGER,
      date: DataTypes.INTEGER,
      root: DataTypes.STRING,
      expiration: DataTypes.INTEGER,
      strike: DataTypes.DECIMAL,
      right: DataTypes.STRING,
      ddoi: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "OpenInterest",
    }
  );
  return OpenInterest;
};
