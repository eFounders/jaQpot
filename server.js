require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const removeWhitespace = require('remove-whitespace');

const Briq = require('briq-api').Client;
Briq.BASE_URL = process.env.BRIQ_BASE_URL;

const briq = new Briq(process.env.BRIQ_ACCESS_TOKEN);
const briqOrganization = briq.organization(process.env.ORGANIZATION_KEY);

const app = express();

const models = require('./models');
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('hello, world!')
})

console.log(briqOrganization)

app.post('/', (req, res, next) => {
  let the_game = null;

  models.Game.findRunningOne()
    .then(game => {
      if(!game) {
        res.send({
          text: 'No game for the moment :('
        })
        return;
      }
      the_game = game;

      briqOrganization.createTransaction({
        amount: 2,
        app: "jaqpot",
        comment: "You plaid jaqpot ",
        from: req.body.user_name
      })

      return game.createAttempt({
        slackUserName: req.body.user_name,
        combination: removeWhitespace(req.body.text)
      })
    })
    .then(attempt => attempt.isWinner())
    .then(isWinner => {
      the_game.getJaqpotAmount().then(amount => {
        if(isWinner) {

          briqOrganization.createTransaction({
            amount: amount,
            app: "jaqpot",
            comment: "You plaid jaqpot",
            to: req.body.user_name
          })

          res.send({
            text: `Got it! Your attempt is ${req.body.text} and.. you win! Golden briq of ${amount}bq shower for you`
          })
        } else {
          res.send({
            text: `Got it! Your attempt is ${req.body.text} and.. you lost! The jackpot is ${amount}bq`
          })
        }

      })
    })
})

const server = app.listen(8080, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);});
