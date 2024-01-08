async function postDataToFireS(collectionRef,docName,dataToPost)
{
try  //Send the data to Firestore
{
      const docRef = collectionRef.doc(docName);
      await docRef.set(
      dataToPost
      );
}
catch (e)
{
      console.log(e);
      return null;
}
};

module.exports = postDataToFireS;
