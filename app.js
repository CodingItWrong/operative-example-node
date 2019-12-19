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

const todoRouter = express.Router()
todoRouter.route('/').get((req, res) => {
  Todo.findAll()
    .then(todos => res.send(todos))
    .catch(err => res.send(err))
})

app.use('/todos', todoRouter)

const port = process.env.PORT || 3000
httpServer.listen(port, () => {
  console.log(`Operative ready at http://localhost:${port}`)
})
