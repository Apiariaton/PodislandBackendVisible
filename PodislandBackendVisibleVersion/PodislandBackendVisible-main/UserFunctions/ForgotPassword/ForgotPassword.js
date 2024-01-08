const express = require('express');
const router = new express.Router();
const auth = require("../../Middleware/Authentication/auth");
const sendClientEmail = require("../LoginLogout/SendClientEmail");
const {passwordIsForgottenEmail} = require("../../ClientEmailTemplates/emailTemplates");
const User = require("../../Mongoose/Models/User");
const bcrypt = require("bcryptjs");

//How could I implement a forgot password route?
// I could do the following:

// The user clicks on a button to reset their password.
// The user enters a new password from their email, which takes them to a separate page.
// From this page, the user can enter a new value for their password.
// Upon clicking the reset password button, the password is reset and data is sent to the update password route
// which requires authentication, which includes answering a secret question.
// If the answer to the secret question is correct, the password is reset.
// Otherwise, the user gets another go at resetting their password.

//There will be one route which sends the email to reset the password.

//There will be another route which enables the user to reset their password, if enhanced authentication is provided.
//The account type will be checked, such that Google Users will not be permitted to reset their account.

//The route to reset password will not be available to users whose account is a Google Account.


router.post("/users/me/reset/password",auth,async (req,res)=>{
try {

    //Add a new field within user that is 'Permit Password Change'
    console.log("Forgotten password route was called...");
    const user = req.user;
    const selectedEmail = req.body.selectedEmail;

    const clientAndBusinessEmails = passwordIsForgottenEmail(user.firstName);
    await sendClientEmail(clientAndBusinessEmails,{name:user.firstName,email:selectedEmail});  

    await User.findOneAndUpdate(user,{"passwordChangeIsPermitted":true});
    res.status(200).send({responseMessage:"Password reset email sent: please check inbox and follow instructions to change password..."});
}
catch (e)
{
    console.log(e);
    res.status(500).send({error:e.message});
}
});

//Need to pass user inputs via security class to minimise attack risk
//Routes: user - create / auth / place order / cancel order / get all orders

router.post("/users/me/change/password",async (req,res)=>{
try {
    
    const {email,newPassword} = req.body;
    
    const user = (await User.find({"email":email}))[0];
    // console.log();

    if (user.passwordChangeIsPermitted == false)
    {
        throw new Error("Please ensure you reset your password via the dedicated password reset page provided.");
    }

    const hashedPassword = await bcrypt.hash(newPassword,8);

    user.password = hashedPassword;
    user.passwordChangeIsPermitted = false;
    await user.save();
    
    res.status(200).send("Successfully changed user password");
}
catch (e)
{
    console.log(e);
    res.status(500).send({e:e.message});
}
});


module.exports = router;