const db = require("../DBConnect/initialise");

async function producePodcastFSFilterQuery(collectionRef,queryDictionary,selectedOrderField="collectionName",orderDirection="asc",startingPoint=0,resultsPerPage=6)
{
    //As my root query, I can the following 'await collection'
    //Then for each search term within my queryDictionary, I can set the value using a switch statement and an accumulator
    //title, artistName, genres, number_of_episodes
    console.log(queryDictionary);
    const queryTerms = Object.keys(queryDictionary);
    console.log(queryTerms);
    const baseQuery = await collectionRef;
    let searchQuery = queryTerms.reduce((acc,term)=>{
    switch (term){
    case "artistName":
        acc = acc.where("artistName","==",queryDictionary[term]);
        break;
    case "collectionName":
        acc = acc.where("collectionName","==",queryDictionary[term]);
        break; 
    case "genres":
        acc = acc.where("genres","array-contains-any",queryDictionary[term]);
        break; 
    case "trackCountMinMax":
        break;  
    }
    return acc;
    },baseQuery);

    console.log("This is the base query",baseQuery);

    //Implement some kind of data pagination
    if (queryTerms.includes("trackCountMinMax"))
    {
        console.log("Min",queryDictionary["trackCountMinMax"][0]);
        console.log("Max",queryDictionary["trackCountMinMax"][1]);

        searchQuery = searchQuery.where("trackCount",">=",parseInt(queryDictionary["trackCountMinMax"][0])) 
                                 .where("trackCount","<=",parseInt(queryDictionary["trackCountMinMax"][1]))
                                 .orderBy("trackCount",orderDirection);    
    }
    else
    {
        searchQuery = searchQuery.orderBy(selectedOrderField,orderDirection);
    }

    return searchQuery;
};

const podcastCollection = db.collection("podcasts");
const queryDictionary = {
    "genres": ["Science"],
    "trackCountMinMax": [50,500],
};

// async function getResults()
// {
// const FSQuery = await produceFSFilterQuery(podcastCollection,queryDictionary);
// const searchResults = await FSQuery.get();
// searchResults.forEach((doc)=>console.log(doc.data()));
// };

// getResults();

module.exports = producePodcastFSFilterQuery;