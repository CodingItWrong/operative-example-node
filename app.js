const express = require('express')
const http = require('http')
const db = require('./models')
const { Todo } = db

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

const postOperationsRoute = (req, res) => {
  const promises = req.body.map(operation => {
    switch (operation.action) {
      case 'create':
        return Todo.create(operation.attributes)
      case 'update':
        return Todo.update(operation.attributes, {
          where: { id: operation.id },
        })
      case 'delete':
        return Todo.destroy({ where: { id: operation.id } })
    }
  })
  Promise.all(promises)
    .then(results => res.send(results))
    .catch(err => res.send(err))
}

const todoRouter = express.Router()
todoRouter
  .route('/')
  .get(getDatabaseRoute)
  .post(express.json(), postOperationsRoute)

app.use('/todos', todoRouter)

const port = process.env.PORT || 3000
httpServer.listen(port, () => {
  console.log(`Operative ready at http://localhost:${port}`)
})
