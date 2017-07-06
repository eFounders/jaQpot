const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

const models = require('./models');
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('hello, world!')
})

app.post('/', (req, res) => {
  console.log('The attemp is', req.body.text)
  res.send({
    text: `Got it! Your attempt is ${req.body.text} and.. you lost!`
  })
})

const server = app.listen(8080, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);});
