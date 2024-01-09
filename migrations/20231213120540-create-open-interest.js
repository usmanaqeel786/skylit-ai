"use strict";
/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OpenInterests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ms_of_day: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      open_interest: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      counter: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING, // or DataTypes.DATEONLY if you want to store it as a date
        allowNull: false,
      },
      root: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiration: {
        type: DataTypes.STRING, // or DataTypes.DATEONLY if you want to store it as a date
        allowNull: false,
      },
      strike: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      right: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ddoi: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("OpenInterests");
  },
};
