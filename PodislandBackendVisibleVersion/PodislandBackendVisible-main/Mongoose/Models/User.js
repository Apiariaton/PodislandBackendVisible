const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');
require("../DBConnect/mongoose");
const path = require('path');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');

const envPath = path.resolve(__dirname,'../../config/.env');
dotenv.config({path:envPath});
const JWT_SECRET = process.env.JWT_SECRET;


const userSchema = new mongoose.Schema({

    username : {
        type: String,
        required: true,
        unique: true,
        validate(value){
            if (!validator.isAlphanumeric(value))
            {
                throw new Error("Username should only contain numbers and letters.")
            }
        }
    },
    
    firstName : {
        type: String,
        required: true,
        validate(value){
        if (validator.isEmpty(value) || !validator.isAlpha(value,'en-GB',{ignore:"-'"}))
        {
            throw new Error("Please enter valid last name...")
        }
    }
    },

    lastName : {
        type: String,
        required: true,
        validate(value){
            if (validator.isEmpty(value) || !validator.isAlpha(value,'en-GB',{ignore:"-'"}))
            {
                throw new Error("Please enter valid last name...")
            }
        }    
    },


    email: {
        type: String,
        required: true,
        unique: true,
        validate(value){
            if (!validator.isEmail)
            {
                throw new Error("Please enter a valid email...");
            }
        }
    },


    password: {
        type: String,
        required: true,
        validate(value){
            if (!validator.isStrongPassword(value))
            {
                throw new Error("Please provide a strong password...");
            }
        }

    },


    age : {
        type: Number,
        required: true,
        validate(value){
            if (value < 15 || 125 < value)
            {
                throw new Error("Only those between 15 and 125 may create a Podisland account...");
            }
        }


    },

    googleAccount: {
        type: Boolean,
        required: true
    },

    passwordChangeIsPermitted: {
        type: Boolean,
        default: false,
    },

    tokens: [
        {
        token: {
            type: String,
            required: true
        }
        }
    ],



},
{
    timestamps: true,
}
);


userSchema.pre("save",async function (next) {
    const user = this;
    if (user.isModified('password'))
    {

        user.password = await bcrypt.hash(user.password,8);

    }
    next();
});


userSchema.statics.findByCredentials = async (email,password)=>{

        //console.log("User email", email);

        const user = await User.findOne({email});
        if (!user)
        {
            throw new Error("No user was found with these details!");
        }

        const isMatch = bcrypt.compare(password,user.password);
        if (!isMatch)
        {
            throw new Error("Invalid password!");
        }
        return user;
};


userSchema.plugin(uniqueValidator,{message:'An account already exists with this {PATH}...'});


userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id:user._id.toString()}, JWT_SECRET, {expiresIn: '30d'});
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
    //Save this token to React front-end local storage
};

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}




userSchema.virtual('orders',{
    ref: 'Order',
    localField: '_id',
    foreignField: 'customer'
});


const User = mongoose.model('User',userSchema);


module.exports = User;