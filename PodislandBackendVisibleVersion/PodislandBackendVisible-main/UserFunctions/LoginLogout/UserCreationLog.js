const express = require('express');
const router = new express.Router();
const User = require('../../Mongoose/Models/User');

const auth = require('../../Middleware/Authentication/auth');
const screen = require("../../Middleware/Sanitisation/screen");

const db = require("../../Firestore/DBConnect/initialise");
const addUserLikeProfile = require('./AddUserLikeProfile');
const sendClientEmail = require('./SendClientEmail');
const {accountIsDeletedEmail,accountIsCreatedEmail} = require('../../ClientEmailTemplates/emailTemplates');


const removeUserLikeProfile = require('./RemoveUserLikeProfile');

//Create user
//-> Send user creation email
//-> Store details to Mongoose
//-> Give user login token
//-> Create user like profile
router.post('/users/new',screen,async (req,res)=>{
    try 
    {
        // console.log("Request:",req);
        // console.log("Request Body:",req.body);
        // console.log("Request Header:",req.header);
        // console.log("Request User:",req.user);

        const user = await new User(req.body);    
        const token = await user.generateAuthToken();
        await user.save();

        const dataFromThisCollRef = db.collection("podcasts");
        const dataToThisCollRef = db.collection("podcastLikes");

        addUserLikeProfile(dataFromThisCollRef,dataToThisCollRef,user);

        //console.log(user);

        const clientAndBusinessEmails = accountIsCreatedEmail(user.firstName);
    
        //Uncomment to send email
        await sendClientEmail(clientAndBusinessEmails,{name:user.firstName,email:user.email});

        res.status(201).send({user,token});
    }
    catch (e)
    {
        console.log(e);
        res.status(400).send(e.message);
    } 
});



//Delete user
//-> Send user deletion email
//-> Store details to Mongoose
//-> Keep orders for accounting but edit user personal details to Blank
router.delete('/users/me',auth,async (req,res)=> {
    try 
    {
        const user = req.user;
        const id = (user._id).toString();
        const email = user.email;
        const name = user.firstName;

        const customerAndBusinessEmails = accountIsDeletedEmail(name);
        
        // Uncomment to send email
        await sendClientEmail(customerAndBusinessEmails,{name:name,email:email});
        
        const userRecordCollection = db.collection("podcastLikes");
        await removeUserLikeProfile(userRecordCollection,id);

        await User.deleteOne({_id:id});

        res.status(200).send(user);
    }
    catch (e)
    {
        console.log(e);
        res.status(500).send(e,message);
    } 
});


router.get("/users/email",auth,async (req,res)=>{
    try {
        const userEmail = req.user.email;
        res.status(200).send({"userEmail":userEmail});
    }
    catch (e)
    {
        console.log(e);
        res.status(500).send({"error":e.message});
    }
});



//Login as user
//-> Send user token
router.post('/users/login', async (req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user,token});
    }
    catch (e)
    {
        console.log(e);
        res.status(500).send({error:e.message});
    }
});



//Logout as user
//-> Remove current token
router.post('/users/logout',auth, async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{return token.token != req.token});

        await req.user.save();

        res.status(200).send("Successfully logged out! ✅");

    }
    catch (e)
    {
        console.log(e);
        res.status(500).send({error:e.message});
    }
});


//Logout all
//-> Remove all tokens
router.post("/users/logoutAll",auth,async (req,res)=>{
try
{
    req.user.tokens = [];
    req.token = "";

    await req.user.save();

    res.status(200).send("Successfully logged out across all sessions!");
}
catch (e)
{
    console.log(e);
    res.status(500).send({error:e.message});

}

});



module.exports = router;