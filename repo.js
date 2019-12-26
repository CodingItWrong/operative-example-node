const db = require('./models');
const { Op } = require('sequelize');
const { Todo, Operation } = db;

const repo = {
  findAllRecords: () => Todo.findAll(),
  createRecord: attributes => Todo.create(attributes),
  updateRecord: (id, attributes) =>
    Todo.update(attributes, {
      where: { id },
    }),
  destroyRecord: id => Todo.destroy({ where: { id } }),

  recordOperation: operation => Operation.create(operation),
  findOperationsSince: since => {
    const startDate = new Date(parseInt(since));
    return Operation.findAll({
      where: {
        createdAt: { [Op.gt]: startDate },
      },
    });
  },
};

module.exports = repo;
