'use strict';
module.exports = function (app) {

    const user = require('../controller/userController');
    const wallpaper = require('../controller/wallpaperController');
    const checkAuth = require('../middleware/check-auth');
    
    // User Route 
    app.route('/user')
        .get(user.listAllUser)
        .post(user.createUser)
    
    // User Login  
    app.route('/userlogin')
        .post(user.loginUser);

    //  Add to  Favorite  
    app.route('/favorite/:id/:wid')
        .get(checkAuth,user.addFavorite);

    //  Remove From Favorite 
    app.route('/delfavorite/:id/:wid')
        .get(checkAuth,user.deleteFavorite);
    
    
    // Add New  Wallpaper
    app.route('/wallpaper')
        .post(wallpaper.createWallpaper);
    
    //  Get Wallpaer 
    app.route('/getwallpaper/:page')
        .get(checkAuth,wallpaper.getAllWallpaper);
   
    // Get  User Favorite  Wall PApers 
    app.route('/getuserwallpaper/:id')
        .get(checkAuth,wallpaper.getUserWallpaper);
    // Delete All Wallpaper 
    app.route('/deleteallwallpaer')
        .delete(wallpaper.deleteall);
    // Default Routes  
    app.get('/', function (req, res) {
        return res.send({ error: true, message: 'hello Mohit Default Page ' })
    });

    app.use((req, res, next) => {
        const error = new Error("Not Found");
        error.status = 404;
        next(error);
    })

    app.use((error, req, res, next) => {
        res.status(error.status || 500);
        res.json({
            error: {
                message: error.message
            }
        })
    })

}