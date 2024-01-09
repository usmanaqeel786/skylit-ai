"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("TradeQuotes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.STRING,
      },
      root: {
        type: Sequelize.STRING,
      },
      expiration: {
        type: Sequelize.STRING,
      },
      strike: {
        type: Sequelize.STRING,
      },
      right: {
        type: Sequelize.STRING,
      },
      counter_value: {
        type: Sequelize.STRING,
      },
      counter_status: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("TradeQuotes");
  },
};
