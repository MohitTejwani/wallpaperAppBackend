const mongoose = require('mongoose');
const wallpaper = mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    title:{type:String , required:true},
    imageurl:{type:String}
})

module.exports = mongoose.model('Wallpaper',wallpaper)