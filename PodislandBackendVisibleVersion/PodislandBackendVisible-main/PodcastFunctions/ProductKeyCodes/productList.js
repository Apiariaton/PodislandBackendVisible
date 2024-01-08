const db = require("../../Firestore/DBConnect/initialise");

const productList = [
    {
      "ProductName": "Podisland T-Shirt",
      "UnitPrice": 15.99,
      "QuantityLimitPerOrder": 10,
      "ProductKeyCode": "TSH",
      "Keywords": ["T-Shirt","Clothing","Home"]
    },
    {
      "ProductName": "Podisland Mug",
      "UnitPrice": 8.99,
      "QuantityLimitPerOrder": 20,
      "ProductKeyCode": "MUG",
      "Keywords": ["Mug","Cup","Kitchen","Home"]
    },
    {
      "ProductName": "Podlife: The Illustrated Podcast Guide",
      "UnitPrice": 24.99,
      "QuantityLimitPerOrder": 5,
      "ProductKeyCode": "GDB",
      "Keywords": ["Book","Guidebook","Study"]
    }
  ];



  module.exports = productList;