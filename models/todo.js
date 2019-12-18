'use strict'
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define(
    'Todo',
    {
      name: DataTypes.UUID,
      completedAt: DataTypes.DATE,
    },
    {}
  )
  Todo.associate = function(models) {
    // associations can be defined here
  }
  return Todo
}
