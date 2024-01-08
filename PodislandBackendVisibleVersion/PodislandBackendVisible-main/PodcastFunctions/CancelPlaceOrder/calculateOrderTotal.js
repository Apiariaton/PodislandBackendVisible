function calculateOrderTotal(orderString) {
  
  
    const orderTotal = orderString.reduce((acc,orderStr) => {
    const quantityAndPrice = orderStr.split("|");
    const total =
      Number.parseFloat(quantityAndPrice[0]) *
      Number.parseFloat(quantityAndPrice[2]);
    
      acc += total;
    return acc;
  }, 0);

  return orderTotal;
}


// console.log(calculateOrderTotal(["3|GDB|24.99","3|MUG|8.99"]));

module.exports = calculateOrderTotal;
