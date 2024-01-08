const express = require("express");
const router = new express.Router();
const auth = require("../../Middleware/Authentication/auth");

const cleanSearchFields = require("./cleanQueryTerms");
const produceSearchObject = require("./produceCleanQueryDict");
const unifyMultiParams = require("./unifyMultiParamsIntoArr");
const addTrackCountToSearchObject = require("./addTrackCountToSearchObject");

const db = require("../../Firestore/DBConnect/initialise");
const producePodcastFSFilterQuery = require("../../Firestore/CRUDOperations/producePodcastFSFilterQuery");
const getDocsFromResponse = require("../../Firestore/CRUDOperations/getDocsFromResponse");
const addPriceRangeToQuery = require("./addPriceRangeToQuery");
const produceShopFSFilterQuery = require("../../Firestore/CRUDOperations/produceShopFSFilterQuery");
//  Params   
//  ?collectionName=
//  &artistName=
//  &genre1= &genre 2 &genre 3 -> genres
//  &minNumberOfEpisodes
//  &maxNumberOfEpisodes
router.get("/podcasts/filter", auth, async (req, res) => {
  try {

    //Return message to narrow down search query
    if (!req.query) 
    {
      res.status(200).send("Enter your query...");
    }

    const parameterQuery = req.query;
    console.log("These are the parameter queries:",parameterQuery);
    
    //Remove any hostile code from URL query parameters
    const cleanQueryFields = cleanSearchFields(Object.keys(req.query));
    let podcastSearchObject = produceSearchObject(cleanQueryFields,parameterQuery); 
    
    console.log("podcastSearchObject",podcastSearchObject);
    
    let genres = unifyMultiParams(podcastSearchObject,"genre"); 
    if (genres.length > 0)
    {
        podcastSearchObject["genres"] = genres;
    }

    //Specify relevant collection from which to retrieve podcasts
    const podcastCollection = db.collection("podcasts");


    
    //Create and execute query if no min or max number of episodes specified as filter
    if (!cleanQueryFields.includes("minNumberOfEpisodes") && !cleanQueryFields.includes("maxNumberOfEpisodes"))
    {
        const filteredFSPodcastQuery = await producePodcastFSFilterQuery(podcastCollection,podcastSearchObject); 
        const matchingPodcasts = await getDocsFromResponse(filteredFSPodcastQuery);

        res.status(200).send({matchingPodcasts});
    }

    //Add min and/or max number of episodes filter if specified, then create and execute query
    else {
        podcastSearchObject = addTrackCountToSearchObject(podcastSearchObject,cleanQueryFields);
        const filteredFSPodcastQuery = await producePodcastFSFilterQuery(podcastCollection,podcastSearchObject); 
        const matchingPodcasts = await getDocsFromResponse(filteredFSPodcastQuery);

        res.status(200).send({matchingPodcasts});
    
    }

    } 
    catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


// Shop router
// Params
// Item price
// Item title
// Item category / keywords
// Again this will be querying the Cloudstore database
router.get("/shop/filter",auth, async (req,res)=>{
try
{
    if (!req.query)
    {
        res.status(200).send("Please enter your query");
    }

    const parameterQuery = req.query;

    //Remove any hostile code from URL query parameters
    const cleanQueryFields = cleanSearchFields(Object.keys(req.query));
    let podcastSearchObject = produceSearchObject(cleanQueryFields,parameterQuery); 
    
    
    let keywords = unifyMultiParams(podcastSearchObject,"keyword"); 
    if (keywords.length > 0)
    {
        podcastSearchObject["Keywords"] = keywords;
    }

    //Specify relevant collection from which to retrieve podcasts
    const podcastCollection = db.collection("podislandShop");


    
    //Create and execute query if no min or max item price specified as filter
    if (!cleanQueryFields.includes("minPrice") && !cleanQueryFields.includes("maxPrice"))
    {
        const filteredFSPodcastQuery = await produceShopFSFilterQuery(podcastCollection,podcastSearchObject); 
        const matchingPodcasts = await getDocsFromResponse(filteredFSPodcastQuery);

        res.status(200).send({matchingPodcasts});
    }

    //Add min and/or max item price filter if specified, then create and execute query
    else {
        podcastSearchObject = addPriceRangeToQuery(podcastSearchObject);
        const filteredFSPodcastQuery = await produceShopFSFilterQuery(podcastCollection,podcastSearchObject); 
        const matchingPodcasts = await getDocsFromResponse(filteredFSPodcastQuery);

        res.status(200).send({matchingPodcasts});
    
    }











}
catch (e)
{
    console.log(e); 
    res.status(500).send({e:e.message});
}


});

module.exports = router;
