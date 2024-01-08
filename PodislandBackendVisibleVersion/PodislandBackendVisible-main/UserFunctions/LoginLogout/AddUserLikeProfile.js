const getPodAttribute = require("../../Firestore/CRUDOperations/getPodAttributeAll");
const createPodTable = require("../../Firestore/CRUDOperations/createPodTable");
const postDataToFireS = require("../../Firestore/CRUDOperations/postDataToFireS");

async function addUserLikeProfile(dataFromThisCollRef,dataToThisCollRef,user){
try
{
    const podcastNames = await getPodAttribute(dataFromThisCollRef,"id");
    const neutralLikeProfile = createPodTable(podcastNames,default_value=0);
    const docName = (user._id).toString();
    console.log("Document name:",docName);
    postDataToFireS(dataToThisCollRef,docName,{[user._id]:neutralLikeProfile});
}
catch (e)
{
    console.log(e);
    return false;
}

    console.log("Successfully created new user like profile...");
    return true;
};

module.exports = addUserLikeProfile;