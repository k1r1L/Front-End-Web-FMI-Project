const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);

    // User
    app.get('/register', controllers.user.registerGet);
    app.post('/register', controllers.user.registerPost);
    app.post('/logout', controllers.user.logout);
    app.get('/login', controllers.user.loginGet);
    app.post('/login', controllers.user.loginPost);
    app.get('/users/games', restrictedPages.isAuthed, controllers.user.getMyGames);

    // Admin
    app.get('/admin/all', restrictedPages.hasRole('Admin'),
        controllers.admin.getAllGames);
    app.get('/admin/add', restrictedPages.hasRole('Admin'),
        controllers.admin.getAddGame);
    app.post('/admin/add', restrictedPages.hasRole('Admin'),
        controllers.admin.postAddGame);
    app.get('/admin/edit/:id', restrictedPages.hasRole('Admin'),
        controllers.admin.getEditGame);
    app.post('/admin/edit/:id', restrictedPages.hasRole('Admin'),
        controllers.admin.postEditGame);
    app.get('/admin/delete/:id', restrictedPages.hasRole('Admin'),
        controllers.admin.getDeleteGame);
    app.post('/admin/delete/:id', restrictedPages.hasRole('Admin'),
        controllers.admin.postDeleteGame);

    // Game
    app.get('/game/details/:id', controllers.game.getGameDetails);   
    app.get('/game/buy/:id', controllers.game.addGameToCart);
    app.post('/game/order', restrictedPages.isAuthed ,controllers.game.orderGamesPost);

    // Cart
    app.get('/home/cart', controllers.home.getCart);
    app.get('/cart/remove/:id', controllers.home.removeFromCart);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};