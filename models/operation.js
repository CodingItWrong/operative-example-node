'use strict'
module.exports = (sequelize, DataTypes) => {
  const Operation = sequelize.define(
    'Operation',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      action: DataTypes.STRING,
      recordId: DataTypes.UUID,
      attributes: DataTypes.JSONB,
    },
    {}
  )
  Operation.associate = function(models) {
    // associations can be defined here
  }
  return Operation
}
