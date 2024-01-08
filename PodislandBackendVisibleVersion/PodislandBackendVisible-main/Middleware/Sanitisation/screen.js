const jwt = require('jsonwebtoken');
const User = require('../../Mongoose/Models/User');
const sanitiseTextField = require("../../SanitiseUserInput/sanitiseTextField");

const screen = async (req,res,next) => {
    try {
        if (req.body)
        {
            let bodyKeys = Object.keys(req.body);
            let bodyValues = Object.values(req.body);
            bodyKeys = bodyKeys.reduce((acc,key)=>{acc.push(sanitiseTextField(key)); return acc;},[]);
            bodyValues = bodyValues.reduce((acc,value)=>{acc.push(sanitiseTextField(value)); return acc;},[]);
            req.body = bodyKeys.reduce((acc,bodyKey,index)=>{acc[bodyKey] = bodyValues[index]; return acc;},{});
        }

        if (req.token)
        {
            req.token = sanitiseTextField(req.token);
        }

        next();

    }
    catch (e) {
        console.log(e);
        res.status(404).send({error:e});
    }
};

module.exports = screen; 