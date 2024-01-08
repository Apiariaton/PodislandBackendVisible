const decodeOrderStringArr = require("../PodcastFunctions/CancelPlaceOrder/decodeOrderStringArr");

const accountIsDeletedEmail = (name) => {
  return {
    clientEmail: {
      subject: "Sorry to see you go...",
      templateID: 5279857,
    },

    businessEmail: {
      subject: `Customer removed their account: ${name}`,
      textPart: `${name} deleted their account`,
      htmlPart: `<h1> ${name} deleted their account. </h1>`,
    },
  };
};

const accountIsCreatedEmail = (name) => {
  return { clientEmail :
    {
    subject: "Welcome to Podisland! Thanks for signing up.",
    // textPart: `Welcome! Hi ${name}, 
    //     Thanks for signing up: we hope you enjoy Podisland.
    //     Best wishes,
    //     Mark Podislandeer
    //     `,
    templateID:5279977
    },
  businessEmail : {
    subject: `New Customer: ${name}`,
    textPart: "You have a new customer!",
    htmlPart: "<h1> You have a new customer!</h1>",
  }
};  
};


const orderIsPlacedEmail = (name,orderStringArray,totalPrice,addresseeName,addresseePostAddress) =>
{

    //Parse orderStringArray
    const orderObject = decodeOrderStringArr(orderStringArray);
    

    const orderConfirmationText = orderObject.reduce(
    (acc,itemObj)=>{
    //Only pluralise item name if quantity > 1 and name is generic item, rather than specialised title
    let plural = itemObj.quantity > 1 && itemObj.name.trim().split(/\s+/).length < 3 ? "s" : "";
    
    //Describe order line by line
    acc += `-${itemObj.quantity} x ${itemObj.name + plural} at £${itemObj.price} each \n`
    
    return acc;
    },"");

    const orderValueConfirmation = `${totalPrice}`;

    const orderAddresseeConfirmation = `This order is due to be sent to ${addresseeName}, residing at ${addresseePostAddress}.`;

    const customerName = `${name}`;

    return { clientEmail :
        {
        subject: "Pods up! Thank you for your order.",
        templateID: 5281374
        // textPart: `Hi ${customerName}, 
        //     Thanks for your order!
            
        //     We can confirm you have ordered the following \n:

        //     ${orderConfirmationText}

        //     Total: ${orderValueConfirmation} \n \n

        //     ${orderAddresseeConfirmation}

        //     Best wishes,
        //     Mark Podislandeer
            // `,
        },
      businessEmail : {
        subject: `New Order from ${customerName}`,
        textPart: `New order:
        
        ${customerName} has ordered the following \n:

            ${orderConfirmationText}

            Total: ${orderValueConfirmation} \n \n

            ${orderAddresseeConfirmation}

        `,
        htmlPart: "<h1> You have a new customer order!</h1>",
      },
      orderEmailCustomVariables : {
        orderConfirmationText,
        orderValueConfirmation,
        orderAddresseeConfirmation
      },
    };
};


const passwordIsForgottenEmail = (name) => {
  return {
    clientEmail: {
      subject: "Password reset email",
      templateID: 5280003
      // textPart: `Hi ${name}, 
      //   Thank you for confirming that you would you like your password 
      //   to be reset.

      //   To reset your password, please click the link below:

      //   ""

      //   If this was not you, please contact the team on thepodisland@gmail.com.

      //   All best wishes,

      //   Podisland
      //   `,
    },

    businessEmail: {
      subject: `Customer requested password change: ${name}`,
      textPart: `${name} requested account password change`,
      htmlPart: `<h1> ${name} requested account password change. </h1>`,
    },
  };
};




module.exports = {
  accountIsCreatedEmail: accountIsCreatedEmail,
  accountIsDeletedEmail: accountIsDeletedEmail,
  orderIsPlacedEmail: orderIsPlacedEmail,
  passwordIsForgottenEmail: passwordIsForgottenEmail
};
