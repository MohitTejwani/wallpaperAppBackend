'use strict';
const wallpaper = require('../model/wallpaperModel');
const user = require('../model/userModel')
const mongoose = require('mongoose');
const url = "https://wallpapaerapi.herokuapp.com/";

const multer = require('multer');
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};
// ================= Image Storage ==============================//
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }

    callback(error, './uploads/');

  },
  filename: function (req, file, callback) {
    console.log(file)
    callback(null,  Date.now().toString() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage, limets: {
    fileSize: 1024 * 1024 * 5
  }
}).single('wallpaper');


exports.getAllWallpaper = function (req, res) {
  const postQuery = wallpaper.find();
  const currentPage = req.params.page;
  if (currentPage) {
    postQuery.skip(10 * (currentPage - 1)).limit(10)
  }

  postQuery.then(data => {
    res.status(200).json(data)
  }).catch(err => {
    res.status(210).json(err)
  })
}

exports.createWallpaper = function (req, res) {
  upload(req, res, function (err) {
    console.log(req.body)
    if (err) {
      res.status(401).json({
        message: "Not Able get Request" + err
      })
    } else {

      let newWallpaper = new wallpaper({
        _id: new mongoose.Types.ObjectId,
        title: req.body.title,
        imageurl: url+req.file.path
      })
      newWallpaper.save()
        .then(data => {
          res.status(200).json({
            message: "Wallpaper inserted ",
            wallpaperId: data._id
          })
        }).catch(err => {
          res.status(410).json(err)
        })

    }
  })
}


exports.getUserWallpaper = function (req, res) {
  user.findById(req.params.id)
    .then(data => {
      wallpaper.find({ _id: { $in: data.favorite } }).exec()
        .then(docData => {
          res.status(200).json({ docData })
        }).catch(err => {
          res.status(410).json({
            message: "not  able to find wallpaper" + err
          })
        })
    }).catch(err => {
      res.status(404).json({
        message: "invalid User ID" + err
      })
    })
}

exports.deleteall=function(req,res){
  wallpaper.remove({}).exec().then(data=>{
    res.status(200).json({
      message:"Deleted All Record"
    })
  }).catch(err=>{
    res.status(404).json(err)
  })
}