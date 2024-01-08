const Mailjet = require('node-mailjet');
const dotenv = require('dotenv');
const path = require('path');
const {accountIsCreatedEmail,accountIsDeletedEmail} = require('../../ClientEmailTemplates/emailTemplates');


const envPath = path.resolve(__dirname,'../../config/.env')
dotenv.config({path:envPath});

console.log(process.env.MJ_APIKEY_PRIVATE,process.env.MJ_APIKEY_PUBLIC);

const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE,
    {
        config:{},
        options:{}
    }
);



async function sendEmail(clientAndBusinessEmails,receiver,customEmailTextVariables={customerName:"",orderValueConfirmation:"",orderConfirmationText:"",orderAddresseeConfirmation:""},sender={email:"thepodisland@gmail.com",name:"Podisland"}){

    const {clientEmail, businessEmail} = clientAndBusinessEmails;
    const {customerName,orderValueConfirmation,orderConfirmationText,orderAddresseeConfirmation} = customEmailTextVariables;

    const request = await mailjet.post('send',{version: 'v3.1'})
                           .request({
    Messages: [
    {
        From: {
            Email: sender.email,  
            Name: sender.name,
        },
        To: [{
            Email: receiver.email,
            Name: receiver.name,
        }],
        Variables: {
            "customerName":customerName,
            "orderValueConfirmation":orderValueConfirmation,
            "orderConfirmationText":orderConfirmationText,
            "orderAddresseeConfirmation":orderAddresseeConfirmation
            },
            TemplateID: clientEmail["templateID"],
            TemplateLanguage: true,
            Subject: clientEmail["subject"],
    },
    {
        From: {
            Email: "thepodisland@gmail.com",  
            Name: "Podisland"
        },
        To: [{
            Email: "thepodisland@gmail.com",
            Name: "William"
        }],
        Subject: businessEmail["subject"],
        TextPart: businessEmail["textPart"],
        HTMLPart: businessEmail["htmlPart"],
    }
    ],
    
  
        
        //htmlPart: clientEmail["htmlPart"],
    TemplateErrorReporting: {
        Email:"wholder321@gmail.com",
        Name:"William",
    }
                           });
    // console.log(request);

};


// const customerAndBusinessEmails = accountIsCreatedEmail("Peter");
// const clientEmail = customerAndBusinessEmails["clientEmail"];
// const businessEmail = customerAndBusinessEmails["businessEmail"];
// console.log(clientEmail, businessEmail);


// async function sendTailoredEmail(clientAndBusinessEmailsObj){
//     await sendEmail(clientAndBusinessEmailsObj,receiver={name:"Will",email:"wholder321@gmail.com"});
// };

// sendTailoredEmail({clientEmail:clientEmail,businessEmail:businessEmail});




module.exports = sendEmail;