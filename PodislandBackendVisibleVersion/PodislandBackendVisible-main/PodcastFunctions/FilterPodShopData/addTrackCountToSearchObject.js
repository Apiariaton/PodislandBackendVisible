
function addTrackCountToSearchObject(podcastSearchObject,cleanQueryFields){

let trackCountMinMax = [0, 1000];    
console.log("These are the clean query fields",cleanQueryFields);
console.log("podcastSearchObject",podcastSearchObject);
if (cleanQueryFields.includes("minNumberOfEpisodes") && Number.isInteger(podcastSearchObject["minNumberOfEpisodes"]))
{
    
    trackCountMinMax[0] = podcastSearchObject[cleanQueryFields[0]];
}
if (cleanQueryFields.includes("maxNumberOfEpisodes") && Number.isInteger(podcastSearchObject["maxNumberOfEpisodes"]))
{
    trackCountMinMax[1] = podcastSearchObject[cleanQueryFields[1]];
}
podcastSearchObject["trackCountMinMax"] = trackCountMinMax;

console.log("PSO after processing", podcastSearchObject);
return podcastSearchObject;
};

module.exports = addTrackCountToSearchObject;