const jwt = require('jsonwebtoken');
const User = require('../../Mongoose/Models/User');

const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(__dirname,'../../config/.env')
dotenv.config({path:envPath});

const JWTSECRET = process.env.JWT_SECRET;

const auth = async (req,res,next) => {
    try {
        //console.log("Request header: ",req.header('Authorization'));
        const token = req.header('Authorization').replace('Bearer ','');
        const decodedUserData = jwt.verify(token,JWTSECRET);
        const user = await User.findOne({_id:decodedUserData._id});
        if (!user)
        {
            throw new Error("No user was found with this ID...");
        }

        req.user = user;
        req.token = token;

        next();

    }
    catch (e) {
        console.log(e);
        res.status(404).send({error:e});
    }
};

module.exports = auth; 