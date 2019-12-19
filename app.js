const express = require('express')
const http = require('http')
var cors = require('cors')
const db = require('./models')
const { Op } = require('sequelize')
const { Todo, Operation } = db

// create first record
// Todo.create({ name: 'my todo' })
//   .then(console.log)
//   .catch(console.error)

let app = express()
const httpServer = http.createServer(app)

const getDatabaseRoute = (req, res) => {
  Todo.findAll()
    .then(todos => res.send(todos))
    .catch(err => res.send(err))
}

const getOperationsRoute = (req, res) => {
  const startDate = new Date(parseInt(req.query.since))
  Operation.findAll({
    where: {
      createdAt: { [Op.gt]: startDate },
    },
  })
    .then(operations => res.send(operations))
    .catch(err => res.send(err))
}

const postOperationsRoute = (req, res) => {
  const operations = req.body
  const promises = operations.map(async operation => {
    await Operation.create(operation)
    switch (operation.action) {
      case 'create': {
        const attributesWithId = Object.assign(
          { id: operation.recordId },
          operation.attributes
        )
        return Todo.create(attributesWithId).then(todo => todo.id)
      }
      case 'update':
        return Todo.update(operation.attributes, {
          where: { id: operation.recordId },
        }).then(() => operation.recordId)
      case 'delete':
        return Todo.destroy({ where: { id: operation.recordId } }).then(
          () => operation.recordId
        )
    }
  })
  Promise.all(promises)
    .then(ids => res.send(ids))
    .catch(err => res.send(err))
}

const todoRouter = express.Router()
todoRouter.route('/').get(getDatabaseRoute)
todoRouter
  .route('/operations')
  .get(getOperationsRoute)
  .post(express.json(), postOperationsRoute)

app.use(cors())
app.use('/todos', todoRouter)

const port = process.env.PORT || 3000
httpServer.listen(port, () => {
  console.log(`Operative ready at http://localhost:${port}`)
})
