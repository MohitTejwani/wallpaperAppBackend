'use strict';
const User = require('../model/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

exports.listAllUser = function (req, res) {
    User.find()
        .then(userData => {
            res.status(200).json(userData)
        }).catch(err => {
            res.status(210).json({
                messege: "there is no record" + err
            })
        })
}
exports.createUser = function (req, res) {
    console.log(req.body)
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            _id: new mongoose.Types.ObjectId,
            name: req.body.name,
            email: req.body.email,
            password: hash
        })
        user
            .save()
            .then(data => {
                res.status(200).json({
                    messege: "User Created",
                    result: data._id

                })
            }).catch(err => {
                res.status(410).json({
                    messege: "invalid information" + err
                })
            })
    }).catch(err => {
        res.status(404).json({
            messege: "error encripte" + err
        })
    })
}
exports.loginUser = function (req, res) {
    let fetchUser
    User.findOne({ email: req.body.email })
        .then(userData => {
            if (!userData) {
                res.status(210).json({
                    messege: "Invalid User Email"
                })
            }
            fetchUser = userData;
            return bcrypt.compare(req.body.password, userData.password)
        }).then(result => {
            if (!result) {
                res.status(210).json({
                    messege: "Auth Faild" + err
                })
            }

            const token = jwt.sign(
                { email: fetchUser.email, userId: fetchUser._id },
                "the_secret_key_of_my_api",
                { expiresIn: 3600  }
            )
            res.status(200).json({
                messege: "Login Sucessful",
                token: token,
                userId: fetchUser._id,
                username:fetchUser.name
                
            })

        }).catch(err => {
            res.status(210).json({
                messege: "Invalid User Email and Password" + err
            })
        })
}
exports.addFavorite = function (req, res) {
    User.findById(req.params.id)
        .then(data => {
            if (data.favorite.indexOf(req.params.wid) < 0) {
                data.favorite.push(req.params.wid)
            } else {
                res.status(200).json({
                    messege: "Already Exists"
                })
            }

            console.log(data)
            User.findByIdAndUpdate(req.params.id, data)
                .then(docData => {
                    console.log(docData)
                    res.status(200).json({
                        messege: "add to favorite"
                    })
                })
        }).catch(err => {
            res.status(404).json({
                messege: "Invalid User" + err
            })
        })
}
exports.deleteFavorite = function (req, res) {
    User.findById(req.params.id)
        .then(data => {
            let index = data.favorite.indexOf(req.params.wid)
            if (index > -1) {
                data.favorite.splice(index, 1)
            }
            console.log(data)
            User.findByIdAndUpdate(req.params.id, data)
                .then(docData => {
                    console.log(docData)
                    res.status(200).json({
                        messege: "Delete to favorite"
                    })
                })
        }).catch(err => {
            res.status(404).json({
                messege: "Invalid User" + err
            })
        })
}