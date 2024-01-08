const getPodAttribute = require("../podDataHandlers/getPodAttribute");
const createPodTable = require("../../Firestore/CRUDOperations/createPodTable");
const postDataToFireS = require("../../Firestore/CRUDOperations/postDataToFireS");

async function addUserLikeProfile(dataFromThisCollRef,dataToThisCollRef,user){
try
{
    const podcastNames = await getPodAttribute(dataFromThisCollRef,"id");
    const neutralLikeProfile = createPodTable(podcastNames,default_value=0);
    postDataToFireS(dataToThisCollRef,user,{user:neutralLikeProfile});
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