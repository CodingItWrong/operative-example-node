const express = require('express')
const http = require('http')
var cors = require('cors')
const db = require('./models')
const { Op } = require('sequelize')
const { Todo, Operation } = db

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

const postOperationsRoute = async (req, res) => {
  const operations = req.body

  for (const operation of operations) {
    await Operation.create(operation)

    switch (operation.action) {
      case 'create': {
        const attributesWithId = Object.assign(
          { id: operation.recordId },
          operation.attributes
        )
        await Todo.create(attributesWithId)
        break
      }
      case 'update':
        await Todo.update(operation.attributes, {
          where: { id: operation.recordId },
        })
        break
      case 'delete':
        await Todo.destroy({ where: { id: operation.recordId } })
        break
    }
  }

  res.send([])
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
