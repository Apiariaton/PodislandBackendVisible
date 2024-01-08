const mongoose = require('mongoose');
const validator = require('validator');
require("../DBConnect/mongoose");
const User = require("./User");


const orderSchema = new mongoose.Schema({

    //Each item is represented by a code |5|PTS|12.00| where 5 is quantity, PTS is product code and 12.00 is price in pounds / unit
    orderedItems: {
        type: mongoose.Schema.Types.Array,
        of: String,
    },

    orderStatus: {
        type: String,
        required: true,
        validate(value){
        const orderStatuses = ["payment processing","unknown stripe error","payment failed","pending","in progress","cancelled","complete"];  
        if (!orderStatuses.includes(value))
        {
            throw new Error("Order status must be one of: pending, in progress, cancelled or complete.");
        }
        }
    },

    totalOrderPriceGBP: {
        type: Number,
        required: true,
        validator(value){
        if (value <= 0)
        {
            throw new Error("Value of the order must be greater than £0");
        }
        }
    },

    orderPlacementDate : {
        type: Date,
        required: true,
    },

    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },

    customerEmail: {
        type: String,
        required: true,
        validate(value){
        if (!validator.isEmail(value))
        {
            throw new Error("Please provide a valid email...");
        }
    }
    },

    addresseePostAddress: {
        type: String,
        required: true,
        validate(value){
        if (validator.isEmpty(value,{ ignore_whitespace: true }))
        {
            throw new Error("Please provide a valid post address...");
        }
        },
    },

    addresseeName: {
        type: String,
        required: true,
        validate(value){
        if (validator.isEmpty(value) || !validator.isAlpha(value,'en-GB',{ignore:" -'"}))
        {
            throw new Error("Please provide a valid addressee name...");
        }
        },
    },

    orderPaymentIsSuccess: {
        type: Boolean,
        required: true
    },

},
{
    timestamps: true,
});

const Order = mongoose.model('Order',orderSchema);

module.exports = Order;
