const Game = require('../models/Game');
const errHandlers = require('../util/error-handler');
const errorHandler = errHandlers.errorHandler;
const handleDbErrors = errHandlers.handleDbErrors;

module.exports = {
  getGameDetails: async (req, res) => {
    try {
      let gameId = req.params.id;
      let gameFromDb = await Game.findById(gameId);
      gameFromDb.dateAsStr = gameFromDb.date.toISOString().split('T')[0];
      res.render('game/details', { game: gameFromDb });
    } catch (e) {
      let allGamesFromDb = await Game.find({});
      errorHandler('Such game does not exists!', 'home/index', res, { games: allGamesFromDb });
    }
  },
  addGameToCart: async (req, res) => {
    let gameId = req.params.id;
    if (!req.session.gamesInCart) {
      req.session.gamesInCart = [];
    }

    if (req.session.gamesInCart.includes(gameId)) {
      let gameFromDb = await Game.findById(gameId);
      errorHandler('Game already added to cart!', 'game/details', res, { game: gameFromDb });
    } else {
      req.session.gamesInCart.push(gameId);
      res.redirect('/home/cart');
    }
  },
  orderGamesPost: async (req, res) => {
    let gameIds = req.session.gamesInCart;
    gameIds.forEach(id => {
      if (!req.user.games.includes(id)) {
        req.user.games.push(id);
      }
    });

    try {
      await req.user.save();
      req.session.gamesInCart = [];

      res.redirect('/users/games');
    } catch (e) {
      let errorMessages = handleDbErrors(e);
      errorHandler(errorMessages, 'home/index', res);
    }
  }
}