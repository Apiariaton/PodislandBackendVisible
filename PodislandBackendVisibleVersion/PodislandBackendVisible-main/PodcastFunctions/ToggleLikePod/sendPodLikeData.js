const db = require("../../Firestore/DBConnect/initialise");
const dataToThisCollRef = db.collection("podcastLikes");


async function togglePodLike(docName,podName,podLikeCollectionName='podcastLikes')
{
  console.log("docName",docName);
  const likeTableCollRef =  db.collection(podLikeCollectionName);
  const likeTableDocRef = await likeTableCollRef.doc((docName.toString()));
  const relevantLikeEntry = await likeTableDocRef.get();
  const currentLikeValue = Number.parseInt((relevantLikeEntry["_fieldsProto"][docName]["mapValue"]["fields"][podName]["integerValue"]))

  const newLikeValue = currentLikeValue == 0 ? 1 : 0;
  
  const fieldToUpdate = `${(docName.toString())}.${podName}`;
  
  await likeTableDocRef.update({[fieldToUpdate]:newLikeValue});
  
  return (newLikeValue === 0 ? "unliked..." : "liked...");

};

module.exports = togglePodLike;

//togglePodLike(dataToThisCollRef,"653fd38781236ef9503cbf98","pod1");