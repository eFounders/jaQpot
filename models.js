const Sequelize = require('sequelize');
const sequelize = new Sequelize('sqlite://./data/db.sqlite');

const Game = sequelize.define('game', {
  combination: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.STRING
  }
});
Game.prototype.getJaqpotAmount = function() {
  return this.getAttempts().then(attempts => attempts.length);
}
Game.findRunningOne = () => Game.findOne({ where: { status: 'running'}});
const Attempt = sequelize.define('attempt', {
  slackUserName: {
    type: Sequelize.STRING
  },
  combination: {
    type: Sequelize.STRING
  }
});

Attempt.prototype.isWinner = function() {
  return this.getGame().then(game => {
    console.log('isWinner', this.combination, ' vs ', game.combination)
    return this.combination === game.combination;
  });
}

Game.hasMany(Attempt);
Attempt.belongsTo(Game);

Game.sync()
Attempt.sync()

module.exports = {
  Game: Game,
  Attempt: Attempt
}
