const db = require('../DBConnect/initialise');

async function removeDocFromFS(collectionRef,docName){
try 
{
    await collectionRef.doc(docName).delete();
    console.log("User record removed successfully.");
}
catch(e)
{
    console.log(e);
    throw new Error("An error occurred while deleting record...");
}
};

module.exports = removeDocFromFS;