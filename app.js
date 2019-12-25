const express = require('express');
const http = require('http');
const WebSocket = require('ws');
var cors = require('cors');
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

const getOperationsSince = since => repo.findOperationsSince(since);

const getDatabaseRoute = (req, res) => {
  repo
    .findAllRecords()
    .then(todos => res.send(todos))
    .catch(err => res.send(err));
};

const getOperationsRoute = (req, res) => {
  getOperationsSince(req.query.since)
    .then(operations => res.send(operations))
    .catch(err => res.send(err));
};

const handleOperations = async operations => {
  for (const operation of operations) {
    await repo.recordOperation(operation);

    switch (operation.action) {
      case 'create': {
        const attributesWithId = Object.assign(
          { id: operation.recordId },
          operation.attributes
        );
        await repo.createRecord(attributesWithId);
        break;
      }
      case 'update':
        await repo.updateRecord(operation.recordId, operation.attributes);
        break;
      case 'delete':
        await repo.destroyRecord(operation.recordId);
        break;
    }
  }
};

const postOperationsRoute = async (req, res) => {
  const operations = req.body;

  // this should NOT yet include the operation sent into us
  const otherOperations = await getOperationsSince(req.query.since);

  handleOperations(operations);

  res.send(otherOperations);
};

const todoRouter = express.Router();
todoRouter.route('/').get(getDatabaseRoute);
todoRouter
  .route('/operations')
  .get(getOperationsRoute)
  .post(express.json(), postOperationsRoute);

app.use(cors());
app.use('/todos', todoRouter);

const wss = new WebSocket.Server({ server: httpServer });

const clientsOtherThan = me =>
  Array.from(wss.clients).filter(
    client => client !== me && client.readyState === WebSocket.OPEN
  );

wss.on('connection', conn => {
  conn.on('message', message => {
    const operations = JSON.parse(message);
    handleOperations(operations);
    clientsOtherThan(conn).forEach(client => {
      client.send(message);
    });
  });
});

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Operative ready at http://localhost:${port}`);
});
