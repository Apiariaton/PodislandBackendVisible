const express = require('express');
const router = new express.Router();
const auth = require("../../Middleware/Authentication/auth");
const screen = require("../../Middleware/Sanitisation/screen");

const Order = require('../../Mongoose/Models/Order');

const {orderIsPlacedEmail} = require("../../ClientEmailTemplates/emailTemplates"); 
const sendClientEmail = require("../../UserFunctions/LoginLogout/SendClientEmail");

const createOrderStringArr = require("./createOrderStringArr");
const validateOrder = require("./validateOrder");
const calculateOrderTotal = require("./calculateOrderTotal");

const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(__dirname,'../../config/.env');
dotenv.config({path:envPath});


const stripe = require('stripe')(process.env.STRIPE_PRIVATE_API_KEY);
const differenceInHours = require('date-fns/differenceInHours');
//Stripe Payment Setup: https://stripe.com/docs/payments/quickstart?lang=node&client=react

//Three routes:
// Create Order
// Cancel Order
// Get All Orders

//Create Order
//Pre-conditions

//The router should reject cases:
//-> Excess items / too few items for an item within an order
//-> Item does not exist within the order catalogue
//-> The order details have not been properly filled out
//-> The order details are incomplete
//-> The user is not logged in

//The router should accept cases where 
//the user is logged in; the order body is complete; the order items are correct
//the order items fall within the limit which is acceptable.

//-> the Order will only be saved upon successful 'payment' via Stripe
//-> following payment, the order will be saved
router.post("/shop/place/order", auth, async (req, res) => {
  try {
    // console.log
    // console.log(req.body.order);
    const rawCustomerOrderData = req.body.order;

    if (rawCustomerOrderData.status !== "pending") {
      throw new Error(
        "An order that is complete, in progress or cancelled may not be placed once more"
      );
    }

    const customerOrderItems = rawCustomerOrderData.orderItems;

    if (!validateOrder(customerOrderItems)) {
      throw new Error(
        "The order contains one or more product which we do not sell \n or \n the quantity of one or more products falls outside the min/max order limit..."
      );
    }

    
    console.log("customerOrderItems",customerOrderItems);
    //orderItemObjArray is an array of the items which have been ordered
    //e.g. [{name:,quantity:,price:}]
    const user = req.user;
    const orderedItems = createOrderStringArr(customerOrderItems);
    let orderStatus = "pending";
    const totalOrderPriceGBP = calculateOrderTotal(orderedItems);
    const orderPlacementDate = new Date();
    const customerEmail = user.email;
    const customerID = user._id;
    const addresseePostAddress = rawCustomerOrderData.addresseePostAddress;
    const addresseeName = rawCustomerOrderData.addresseeName;
    let orderPaymentIsSuccess = false;

    const orderBody = {
      orderedItems,
      orderStatus,
      totalOrderPriceGBP,
      orderPlacementDate,
      customerEmail,
      customerID,
      addresseePostAddress,
      addresseeName,
      orderPaymentIsSuccess,
    };

    //Create new order document
    const order = await new Order(orderBody);
    await order.save();


    //Prompt user payment - Stripe accepts sums in pennies only for GGP
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round((totalOrderPriceGBP * 100)), 
        currency: "gbp",
        automatic_payment_methods: {
            enabled: true,
        },
    });


   


    //Need to implement a separate order success path
    //Upon successful completion, order status changes
    await order.save();

    //Uncomment to send email
    const name = user.firstName;
    const clientAndBusinessEmails = orderIsPlacedEmail(name,orderedItems,totalOrderPriceGBP,addresseeName,addresseePostAddress);
    let orderValueConfirmation = clientAndBusinessEmails.orderEmailCustomVariables.orderValueConfirmation;
    let orderConfirmationText = clientAndBusinessEmails.orderEmailCustomVariables.orderConfirmationText;
    let orderAddresseeConfirmation = clientAndBusinessEmails.orderEmailCustomVariables.orderAddresseeConfirmation;
    let customerName = name;

    console.log("orderValueConfirmation",orderValueConfirmation);
    console.log("orderConfirmationText",orderConfirmationText);
    console.log("orderAddresseeConfirmation",orderAddresseeConfirmation);
    await sendClientEmail(clientAndBusinessEmails,{name: name,email:customerEmail},{customerName,orderValueConfirmation,orderConfirmationText,orderAddresseeConfirmation});

    //Not only should I send the clientSecret, I should also send the order id, such that successful payment can be used to update the status of the order to "In Progress" which implies that payment has been made.

    res.send({
        clientSecret: paymentIntent.client_secret,
        orderID: order.id,
    });

    //This secret is sent to the client. It is stored within the options object of the application.
    //An Element is loaded using the stripePromise, constructing with the Stripe public api key and the options prop with the value above.
    //https://stripe.com/docs/stripe-js/react?locale=en-GB
    //The client then goes to the checkout


  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
});


//Update Order Status following payment via Stripe
router.post("/shop/order/status/",auth,screen,async (req,res)=>{
try
{

if (!req.body.orderID || !req.body.orderStatus)
{
  res.status(500).send("An order ID and an order status must be provided to update the order status.");
}  

//Prevent a user from changing the status of another person's order
const relevantOrder = await Order.findById(req.body.orderID);
if (relevantOrder.customerID != req.user.id || !relevantOrder)
{
res.status(500).send("None of your orders matched the order ID provided...")
}

const reqOrderID = req.body.orderID;
const reqOrderStatus = req.body.orderStatus;

//Update payment and orderStatus according to Stripe response
switch(reqOrderStatus)
{
  case "in progress":
    await Order.findByIdAndUpdate(reqOrderID,{orderStatus:"in progress",orderPaymentIsSuccess:true});
    res.status(200).send({orderUpdate:"Order has been added to our order log"});
    break;
  case "payment failed":
    await Order.findByIdAndUpdate(reqOrderID,{orderStatus:"payment failed",orderPaymentIsSuccess:false});
    res.status(200).send({orderUpdate:"Payment failed..."});
    break;  
  case "payment processing":
    await Order.findByIdAndUpdate(reqOrderID,{orderStatus:"payment processing",orderPaymentIsSuccess:false});
    res.status(200).send({orderUpdate:"Your payment is being processed..."});
    break;  
  default:
    await Order.findByIdAndUpdate(reqOrderID,{orderStatus:"unknown stripe error",orderPaymentIsSuccess:false});
    res.status(200).send({orderUpdate:"An unknown Stripe error occurred..."});
    break; 
}
}
catch (e)
{
  console.log(e);
  throw new Error({error:e.message});
}
});




//Cancel Order
//-> The order will be retrieved by ID and its status will be checked (whether complete/cancelled/in progress)
//-> If in progress
//-> The current UK date will be compared against the order placement date
//-> If it is within two days, an email will be sent to the business and the customer, confirming the need to refund and cancel an order
//-> The order status for the given ID will be updated from in progress to cancelled
router.post('/past-orders/cancel/order',auth,async (req,res)=>{
try { 
    const orderIDToCancel = req.body.orderID;
    console.log("orderIDToCancel",orderIDToCancel);
    const selectedOrder = await Order.findById(orderIDToCancel);
    const selectedOrderCustomerID =selectedOrder.customerID.toString();

    if (!selectedOrder || (selectedOrder.customerID != req.user.id))
    {
        throw new Error("No order was found with this ID within your order history...");
    }

    const orderStatusesToReject = ["cancelled","complete"]; 

    if (orderStatusesToReject.includes(selectedOrder.status))
    {
        throw new Error("An order may not be cancelled if it has already been cancelled or completed...");
    }
    
    const orderPlacementDate = selectedOrder.orderPlacementDate;
    const orderCancellationDate = new Date();
    const hoursOrderActive = differenceInHours(orderPlacementDate,orderCancellationDate);
    
    if (hoursOrderActive > 48)
    {
        throw new Error("An order cannot be cancelled if the cancellation is made more than 48 hours after the order placement date.");
    }

    console.log("Cancellation permitted.");
    await Order.findOneAndUpdate(selectedOrder,{"orderStatus":"cancelled"});
    await selectedOrder.save();

    res.status(200).send("Your order was successfully cancelled.");
}
catch (e)
{
    console.log(e);
    res.status(500).send({error:e.message});
}


});


router.get("/past-orders/",auth,async (req,res)=>{
console.log("Past orders route reached...");
try
{
    const userID = req.user.id;

    const listOfPastOrders = await Order.find({customerID:userID});
    
    if (!listOfPastOrders)
    {
        res.status(404).send("No orders have been placed...");
    } 

    res.status(200).send(listOfPastOrders);
}
catch (e)
{
    console.log(e);
    res.status(500).send({e:e.message});
}

});



//Get All Orders
//For the given User ID, all orders will be produced

module.exports = router;
