const express = require('express');
let app = express();
let cors = require('cors');
const bodyParser = require("body-parser");

const MongoDB = require('mongodb');
const ObjectID = MongoDB.ObjectID;

let connection;

let client = new MongoDB.MongoClient('// MONGODB URL //', {
  useUnifiedTopology: true,
  loggerLevel: 'error'
});

client.connect((err, client) => {
  if (err) return console.error(err.stack);
  connection = client;
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/todo/list', (req, res) => {
  connection.db('master').collection('tasks').find().toArray((err, result) => {
    if (err) return console.error(err.stack);
    res.json(result);
  });
});

app.post('/todo/new', (req, res) => {
  connection.db('master').collection('tasks').insertOne({
    title: req.body.title,
    completed: req.body.completed
  }, (err, result) => {
    if (err) return console.error(err.stack);
    res.json(result.ops[0]);
  });
});

app.post('/todo/update/:id', (req, res) => {
  connection.db('master').collection('tasks').updateOne({
    _id: ObjectID(req.params.id)
  }, {
    $set: {
      completed: req.body.completed
    }
  }, (err, result) => {
    if (err) return console.error(err.stack);
  });
});

app.delete('/todo/delete/:id', (req, res) => {
  connection.db('master').collection('tasks').deleteOne({
    _id: ObjectID(req.params.id)
  }, (err, result) => {
    if (err) return console.error(err.stack);
    res.sendStatus(200);
  });
});

app.listen(3000, () => { console.log('Listening on port 3000')} );
