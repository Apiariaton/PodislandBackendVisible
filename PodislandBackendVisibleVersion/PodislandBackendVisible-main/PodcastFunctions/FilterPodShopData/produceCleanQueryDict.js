const sanitiseText = require("../../SanitiseUserInput/sanitiseTextField");

function produceCleanQueryDict(cleanedQueryTerms,parameterQuery)
{
    console.log("Cleaned Query terms going into dictionary...");
    const sanitisedQueryDict = cleanedQueryTerms.reduce((acc,term)=>{
        console.log("term of cleanedQueryTerms",term);
        acc[term] = sanitiseText((parameterQuery[term]));
        return acc;
    },{});

    console.log("sanitisedQueryDict",sanitisedQueryDict);
    return sanitisedQueryDict;

};


module.exports = produceCleanQueryDict;