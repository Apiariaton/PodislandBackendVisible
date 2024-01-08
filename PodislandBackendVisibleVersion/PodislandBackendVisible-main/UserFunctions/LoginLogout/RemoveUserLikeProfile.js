const removeDocFromFS = require('../../Firestore/CRUDOperations/removeDocFS');

async function removeUserLikeProfile(likeCollectionRef,userID){
    try
    {
       await removeDocFromFS(likeCollectionRef,userID);
    }
    catch (e)
    {
        console.log(e);
        return false;
    }
        console.log("User record successfully removed from Firestore...")
        return true;
    };
    
    module.exports = removeUserLikeProfile;