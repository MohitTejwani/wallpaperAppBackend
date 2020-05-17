var express = require('express');
var app = express();
const morgan = require('morgan')
bodyParser = require('body-parser');
port = process.env.PORT || 5000;
var cors = require('cors');
const path = require("path");

const uri = "mongodb://Mohit:uzaxTgMfxHUkUAL4@wallpaperapp-shard-00-00-eszj9.mongodb.net:27017,wallpaperapp-shard-00-01-eszj9.mongodb.net:27017,wallpaperapp-shard-00-02-eszj9.mongodb.net:27017/test?ssl=true&replicaSet=WallpaperApp-shard-0&authSource=admin&retryWrites=true&w=majority";
const mongoose = require('mongoose');
mongoose
  .connect(uri,{ useNewUrlParser: true , useUnifiedTopology: true})
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log(err);
  });




// Header request
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
  });
app.use(morgan('dev'))
app.listen(port);

console.log('API server started on: ' + port);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use("/uploads", express.static(path.join("BackendWallpaper/uploads")));
// app.use('/uploads', express.static('uploads'));
app.use('/uploads',express.static(__dirname + '/uploads'));

var routes = require('./router/appRouter'); //importing route
routes(app); //register the route