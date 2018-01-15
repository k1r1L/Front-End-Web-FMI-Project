const Game = require('../models/Game');
const errHandlers = require('../util/error-handler');
const errorHandler = errHandlers.errorHandler;
const handleDbErrors = errHandlers.handleDbErrors;

module.exports = {
  getAllGames: async (req, res) => {
    try {
      let allGamesInDb = await Game.find({});
      let count = 1;
      allGamesInDb.forEach(g => {
        g.order = count;
        count++;
      });

      res.render('admin/all', { games: allGamesInDb });
    } catch (e) {
      errorHandler('Cannot load games from database', 'home/index', res);
    }
  },
  getAddGame: (req, res) => {
    res.render('admin/add');
  },
  postAddGame: async (req, res) => {
    try {
      req.body.price = +req.body.price;
      req.body.size = +req.body.size;
      let gameObj = await Game.create(req.body);

      res.redirect('/admin/all');
    } catch (e) {
      let errorMessages = handleDbErrors(e);
      errorHandler(errorMessages, 'admin/add', res, { game: req.body });
    }
  },
  getEditGame: async (req, res) => {
    try {
      let gameId = req.params.id;
      let gameToEdit = await Game.findById(gameId);
      gameToEdit.dateAsStr = gameToEdit.date.toISOString().split('T')[0];

      res.render('admin/edit', { game: gameToEdit });
    } catch (e) {
      let allGames = await Game.find({});
      let count = 1;
      allGames.forEach(g => {
        g.order = count;
        count++;
      });
      errorHandler('No such game exists in database!', 'admin/all', res,
        { games: allGames });
    }
  },
  postEditGame: async (req, res) => {
    let gameId = req.params.id;
    let game;
    try {
      game = await Game.findById(gameId);
      game.title = req.body.title;
      game.description = req.body.description;
      game.imageUrl = req.body.imageUrl;
      game.price = +req.body.price;
      game.size = +req.body.size;
      game.trailer = req.body.trailer;
      game.date = req.body.date;
      await game.save();

      res.redirect('/admin/all');
    } catch (e) {
      let errorMessages = handleDbErrors(e);
      let gameFromDb = await Game.findById(gameId);
      errorHandler(errorMessages, 'admin/edit', res, { game: gameFromDb });
    }
  }, 
  getDeleteGame: async (req, res) => {
    try {
      let gameId = req.params.id;
      let gameToDelete = await Game.findById(gameId);
      gameToDelete.dateAsStr = gameToDelete.date.toISOString().split('T')[0];
      res.render('admin/delete', { game: gameToDelete });
    } catch (e) {
      let allGames = await Game.find({});
      let count = 1;
      allGames.forEach(g => {
        g.order = count;
        count++;
      });
      errorHandler('No such game exists in database!', 'admin/all', res,
        { games: allGames });
    }
  },
  postDeleteGame: async (req, res) => {
    let gameId = req.body.gameId;
    try {
      await Game.findByIdAndRemove(gameId);

      res.redirect('/admin/all');
    } catch (e) {
      let allGames = await Game.find({});
      let count = 1;
      allGames.forEach(g => {
        g.order = count;
        count++;
      });
      errorHandler('No such game exists in database!', 'admin/all', res,
        { games: allGames });
    }
  }
}