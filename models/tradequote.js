"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TradeQuote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TradeQuote.init(
    {
      date: DataTypes.INTEGER,
      root: DataTypes.STRING,
      expiration: DataTypes.INTEGER,
      strike: DataTypes.DECIMAL,
      right: DataTypes.STRING,
      counter_value: DataTypes.INTEGER,
      counter_status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TradeQuote",
    }
  );
  return TradeQuote;
};
