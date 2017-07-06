const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const removeWhitespace = require('remove-whitespace');

const app = express();

const models = require('./models');
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('hello, world!')
})

app.post('/', (req, res, next) => {
  console.log(req.body)
  models.Game.findRunningOne()
    .then(game => {
      if(!game) {
        res.send({
          text: 'No game for the moment :('
        })
        return;
      }
      return game.createAttempt({
        slackUserName: req.body.user_name,
        combination: removeWhitespace(req.body.text)
      })
    })
    .then(attempt => attempt.isWinner())
    .then(isWinner => {
      if(isWinner) {
        res.send({
          text: `Got it! Your attempt is ${req.body.text} and.. you win! Golden briq shower for you`
        })
      } else {
        res.send({
          text: `Got it! Your attempt is ${req.body.text} and.. you lost!`
        })
      }
    })
})

const server = app.listen(8080, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);});
