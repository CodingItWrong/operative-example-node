const express = require('express');
const http = require('http');
const WebSocket = require('ws');
var cors = require('cors');
const Operative = require('./operative');
const repo = require('./repo');

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
