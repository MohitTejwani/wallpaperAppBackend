const mongoose = require('mongoose');
const user = mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    name:{type:String , required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    favorite:{
        type:Array
    }
})

module.exports = mongoose.model('User',user)