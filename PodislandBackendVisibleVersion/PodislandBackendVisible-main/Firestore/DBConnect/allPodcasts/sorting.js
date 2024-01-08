const podData = require("./data.js");


const sortedArrayByPNameAscending = podData.sort((a, b) => a.collectionName.localeCompare(b.collectionName));
// const sortedArrayByPNameDescending = podData.sort((a, b) => b.collectionName.localeCompare(a.collectionName));
// const sortedArrayByANameAscending = podData.sort((a, b) => a.artistName.localeCompare(b.artistName));
// const sortedArrayByANameDescending = podData.sort((a, b) => b.artistName.localeCompare(a.artistName));

console.log(sortedArrayByANameDescending);