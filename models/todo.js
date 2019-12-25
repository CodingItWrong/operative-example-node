'use strict';
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define(
    'Todo',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      completedAt: DataTypes.DATE,
    },
    {}
  );
  Todo.associate = function(models) {
    // associations can be defined here
  };
  return Todo;
};
