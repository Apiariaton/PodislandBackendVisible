const validateOrder = require("./validateOrder");
const productList = require("../ProductKeyCodes/productList");

function createOrderStringArr(orderItemObjArray) {
  
    

    if (!validateOrder(orderItemObjArray))
    {
        console.log("The order placed could not be fulfilled due to an issue with the number of items or the type of items requested...");
        return null;
    }


    const orderStringArr = orderItemObjArray.reduce((acc,prodObj)=>{
        const sameItemInProductList = productList.find((prod)=>prod["ProductName"] == prodObj["name"]);

        let orderItemCode = "";
        orderItemCode += prodObj.quantity + "|";
        orderItemCode += sameItemInProductList["ProductKeyCode"] + "|"; 
        orderItemCode += sameItemInProductList["UnitPrice"];
        acc.push(orderItemCode);
        return acc;
    },[]);

    return orderStringArr;
};



module.exports = createOrderStringArr;
