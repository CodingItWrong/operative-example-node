'use strict';
const DataTypes = require('sequelize').DataTypes;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Operations', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      recordId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      attributes: {
        type: Sequelize.JSONB,
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Operations');
  },
};
