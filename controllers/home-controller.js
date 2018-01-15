const Game = require('../models/Game');
const errHandlers = require('../util/error-handler');
const errorHandler = errHandlers.errorHandler;
const handleDbErrors = errHandlers.handleDbErrors;

module.exports = {
    index: async (req, res) => {
        if (!req.session.gamesInCart) {
            req.session.gamesInCart = [];
        }

        try {
            let allGames = await Game.find({});

            if (req.query.order === 'Name') {
                allGames = allGames.sort((a, b) => a.title > b.title);
            } else if (req.query.order === 'Release Date') {
                allGames = allGames.sort((a, b) => a.date > b.date);
            } else if(req.query.order === 'Price') {
                allGames = allGames.sort((a, b) => a.price - b.price);
            }

            for (let index = 0; index < allGames.length; index++) {
                allGames[index].description = allGames[index].description.substring(0, 500);
                allGames[index].everyThird = index % 3 === 0;
            }

            res.render('home/index', { games: allGames });
        } catch (e) {
            errorHandler('Cannot load all games from database!', 'home/index', res);
        }
    },
    getCart: async (req, res) => {
        try {
            let cart = req.session.gamesInCart;
            let allGames = await Game.find({ _id: { $in: cart } });
            let totalPrice = 0;
            if (allGames.length > 0) {
                allGames.forEach(g => {
                    g.description = g.description.substring(0, 500);
                })
                totalPrice = allGames.map(g => g.price).reduce((a, b) => a + b);
            }

            res.render('home/cart', { games: allGames, totalPrice: totalPrice });
        } catch (e) {
            res.redirect('/');
        }
    },
    removeFromCart: (req, res) => {
        let gameId = req.params.id;

        if(req.session.gamesInCart.includes(gameId)) {
            req.session.gamesInCart = req.session.gamesInCart.filter(id => id !== gameId);
        }

        res.redirect('/home/cart');
    }
};