async function getPodAttribute(collectionRef,attribute)
{
try { //Obtain a particular attribute for all podcasts
  const podcasts = await collectionRef.get(); 
  const podcastAttribute = [];
  podcasts.forEach((podcast)=>podcastAttribute.push(podcast[attribute]));
  console.log("podcastAttribute:",podcastAttribute);
  return podcastAttribute;
}
catch (e)
{
  console.log(e);
  return null;
}
}

module.exports = getPodAttribute;