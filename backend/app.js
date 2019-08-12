const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('app');
const bodyParser = require('body-parser');
const ChatSocketService = require('./services/ChatSocketService');

const app = express();
const server = require('http').Server(app);

const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});

const test = new ChatSocketService(server);

