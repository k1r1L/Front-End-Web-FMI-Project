const encryption = require('../util/encryption');
const User = require('mongoose').model('User');
const Game = require('../models/Game');
const errHandlers =  require('../util/error-handler');
const errorHandler = errHandlers.errorHandler;
const handleDbErrors = errHandlers.handleDbErrors;

module.exports = {
    registerGet: (req, res) => {
        res.render('users/register');
    },
    registerPost: async (req, res) => {
        const reqUser = req.body;
        const salt = encryption.generateSalt();
        const hashedPass =
            encryption.generateHashedPassword(salt, reqUser.password);
        try {
            if (reqUser.password !== reqUser.confirmPassword) {
                errorHandler('Passwords do not match!', 'users/register', res);
                return;
            }

            let existingUser = await User.findOne({ username: reqUser.username });
            if (existingUser) {
                errorHandler(`User with username ${reqUser.username} already exists!`, 'users/register', res);
                return;
            }

            const user = await User.create({
                username: reqUser.username,
                hashedPass,
                salt,
                fullName: reqUser.fullName,
                roles: []
            });
            req.logIn(user, (err, user) => {
                if (err) {
                    res.locals.globalError = err;
                    res.render('users/register', user);
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            let errorMessages = handleDbErrors(e);
            errorHandler(errorMessages, 'users/register', res);
        }
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    },
    loginGet: (req, res) => {
        res.render('users/login');
    },
    loginPost: async (req, res) => {
        const reqUser = req.body;
        try {
            const user = await User.findOne({ username: reqUser.username });
            if (!user) {
                errorHandler('Such user does not exist', 'users/login', res);
                return;
            }

            if (!user.authenticate(reqUser.password)) {
                errorHandler('Invalid user password', 'users/login', res);
                return;
            }

            req.logIn(user, (err, user) => {
                if (err) {
                    errorHandler(err);
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            errorHandler(e);
        }
    },
    getMyGames: async (req, res) => {
        try {
            let allGames = await Game.find({ _id: { $in: req.user.games } });

            console.log(allGames);

            for (let index = 0; index < allGames.length; index++) {
                allGames[index].description = allGames[index].description.substring(0, 500);
                allGames[index].everyThird = index % 3 === 0;
            }

            res.render('users/games', { games: allGames });
        } catch (e) {
            errorHandler('Cannot load all games from database!', 'home/index', res);
        }
    }
};