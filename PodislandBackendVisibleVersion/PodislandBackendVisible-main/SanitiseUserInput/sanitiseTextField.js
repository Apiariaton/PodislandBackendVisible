const sanitizeHtml = require('sanitize-html');

function sanitiseField(input,filterOptions={allowedAttributes:{}}){
    try {
        let sanitisedInput = sanitizeHtml(input);
        sanitisedInput.replaceAll("&amp", " & ");
        if (sanitisedInput.includes("&gt") || sanitisedInput === "") //Converts empty string to null
        {
        sanitisedInput = null;
        }  
        return sanitisedInput; 
    }
    catch (e)
    {
        console.log(e);
        return null;
    }
};

module.exports = sanitiseField;