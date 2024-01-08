function addPriceRangeToQuery(cleanQueryFields,podcastSearchObject){

    const priceRangeMinMax = [0, 1000];    
    if (cleanQueryFields.includes("minPrice"))
    {
        priceRangeMinMax[0] = podcastSearchObject["minPrice"];
        delete  podcastSearchObject.minPrice;
    }
    if (cleanQueryFields.includes("maxPrice"))
    {
        priceRangeMinMax[1] = podcastSearchObject["maxPrice"];
        delete  podcastSearchObject.maxPrice;
    }
    podcastSearchObject["priceRangeMinMax"] = priceRangeMinMax;
    
    return podcastSearchObject;
    };
    
module.exports = addPriceRangeToQuery;