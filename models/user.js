const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose= require('passport-local-mongoose');

const UserSchema=new Schema({
    email:{
        type: String, 
        required:true, 
        unique:true
    }
});

UserSchema.plugin(passportLocalMongoose); //Connects to passport. it automatically creates a username unique in the schema dn checks for the db , password etc...
module.exports=mongoose.model('User', UserSchema);