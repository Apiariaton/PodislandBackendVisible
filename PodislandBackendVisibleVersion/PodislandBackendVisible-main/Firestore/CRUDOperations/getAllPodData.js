const db = require("../DBConnect/initialise");

async function getAllPodData(collectionRef,docName)
{
const results = await collectionRef.get(docName);

results.forEach(
(doc)=>{console.log(doc.id,":",doc.data())}
);

return results;
};

const collectionRef = db.collection("podcasts");

async function getAllDocs(){
    const snapshot = await collectionRef.get();
    snapshot.forEach(doc => {
        console.log(doc.data());
      });
};

getAllDocs();

module.exports = getAllPodData;