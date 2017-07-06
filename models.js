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

const Attempt = sequelize.define('attempt', {
  slackUserName: {
    type: Sequelize.STRING
  },
  combination: {
    type: Sequelize.STRING
  }
});

Game.hasMany(Attempt);
Attempt.belongsTo(Game);

Game.sync()
Attempt.sync()

module.exports = {
  Game: Game,
  Attempt: Attempt
}
