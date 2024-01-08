const productList = require("../ProductKeyCodes/productList");

function validateOrder(orderBody) {

  const productNames = productList.reduce((acc, prodObj) => {
    acc.push(prodObj["ProductName"]);
    return acc;
  }, []);

  const orderProductNames = orderBody.reduce((acc, prodObj) => {
    acc.push(prodObj.name);
    return acc;
  }, []);

  const orderPNSubsetPN = (orderProductNames, productNames) => {
    return orderProductNames.every((el) => {
      return productNames.includes(el);
    });
  };

  if (!orderPNSubsetPN(orderProductNames, productNames)) {
    console.log("The order contains at least product which is not sold...");
    return null;
  }


  const orderQuantityDictionary = orderBody.reduce((acc, orderItem) => {
    acc[[orderItem["name"]]] = orderItem["quantity"]; return acc;
  }, {});
  const orderItemNames = Object.keys(orderQuantityDictionary);


  const orderWithinMaxQuantityLimits = orderItemNames.every((prodName) => {
    
    let sameProductWithinProductList = productList.find((product)=>product["ProductName"] === prodName);
    
    return (
      0 < orderQuantityDictionary[prodName] && 
      orderQuantityDictionary[prodName] <= sameProductWithinProductList["QuantityLimitPerOrder"]   
    );
  });
  

  if (!orderWithinMaxQuantityLimits)
  {
    console.log("The quantity of at least one item ordered exceeds or falls below the order limit...");
    return null;
  }

  return orderBody;

}

module.exports = validateOrder;
