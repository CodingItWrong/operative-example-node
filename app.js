const express = require('express');
const http = require('http');
const WebSocket = require('ws');
var cors = require('cors');
const Operative = require('./operative');
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

let app = express();
const httpServer = http.createServer(app);

const operative = Operative.create({ repo });

app.use(cors());
app.use('/todos', operative.router());

const wss = new WebSocket.Server({ server: httpServer });
operative.configureWss(wss);

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Operative ready at http://localhost:${port}`);
});
