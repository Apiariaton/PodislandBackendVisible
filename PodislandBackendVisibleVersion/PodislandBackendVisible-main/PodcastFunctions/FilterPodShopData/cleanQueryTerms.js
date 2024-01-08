const sanitiseText = require("../../SanitiseUserInput/sanitiseTextField");

function cleanQueryTerms(queryTerms)
{
    const sanitisedQueryTerms = queryTerms.reduce((acc, term) => {
        acc.push(sanitiseText(term));
        return acc;
      }, []);

    return sanitisedQueryTerms;

};

module.exports = cleanQueryTerms;