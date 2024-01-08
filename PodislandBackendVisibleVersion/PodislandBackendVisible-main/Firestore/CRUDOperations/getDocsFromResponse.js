async function getDocsFromResponse(FSQuery){
    let results = await FSQuery.get();
    let docArray = [];
    results.forEach((doc)=>{docArray.push(doc.data());});
    return docArray;
};

module.exports = getDocsFromResponse;