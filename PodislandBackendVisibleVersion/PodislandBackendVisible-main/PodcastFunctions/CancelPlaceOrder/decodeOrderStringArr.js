const productList = require("../ProductKeyCodes/productList");


function decodeOrderStringArr(orderString){


    const decodedOrder = orderString.reduce((acc,orderStr)=>{

        const orderAttributes = orderStr.split("|");
        const relevantProduct = (productList.filter((prodObj)=>prodObj["ProductKeyCode"] === orderAttributes[1]))[0];
        
        const productName = relevantProduct["ProductName"];

        const productQuantity = orderAttributes[0];
        const productUnitPrice = orderAttributes[2];

        acc.push({
            quantity: productQuantity,
            name: productName,
            price: productUnitPrice,
    }); return acc;},[]);


    return decodedOrder;
};


console.log(decodeOrderStringArr(["1|GDB|24.99","1|MUG|8.99"]));



module.exports = decodeOrderStringArr;