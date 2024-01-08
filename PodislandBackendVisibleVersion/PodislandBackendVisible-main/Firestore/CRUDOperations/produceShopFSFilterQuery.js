const db = require("../DBConnect/initialise");

async function produceShopFSFilterQuery(collectionRef,queryDictionary,selectedOrderField="ProductName",orderDirection="asc",startingPoint=0,resultsPerPage=6)
{
    //As my root query, I can the following 'await collection'
    //Then for each search term within my queryDictionary, I can set the value using a switch statement and an accumulator
    //title, artistName, genres, number_of_episodes
    const queryTerms = Object.keys(queryDictionary);
    const baseQuery = await collectionRef;
    let searchQuery = queryTerms.reduce((acc,term)=>{
    switch (term){
    case "ProductName":
        acc = acc.where("ProductName","==",queryDictionary[term]);
        break;
    case "ProductKeyCode":
        acc = acc.where("ProductKeyCode","==",queryDictionary[term]);
        break; 
    case "Keywords":
        acc = acc.where("Keywords","array-contains-any",queryDictionary[term]);
        break;   
    case "priceRangeMinMax":
        acc = acc.where("UnitPrice",">=",(queryDictionary[term][0]))
                 .where("UnitPrice","<=",(queryDictionary[term][1]));
        break;
    }
    return acc;
    },baseQuery);

    //Implement some kind of data pagination
    if (queryTerms.includes("priceRangeMinMax"))
    {
        searchQuery = searchQuery.orderBy("UnitPrice",orderDirection);
    }
    searchQuery = searchQuery.orderBy(selectedOrderField,orderDirection);

    return searchQuery;
};

// const podcastCollection = db.collection("podislandShop");
// const queryDictionary = {
//     "Keywords":["Home"],
// };

// async function getResults()
// {
// const FSQuery = await produceShopFSFilterQuery(podcastCollection,queryDictionary);
// const searchResults = await FSQuery.get();
// searchResults.forEach((doc)=>console.log(doc.data()));
// };

// getResults();

module.exports = produceShopFSFilterQuery;