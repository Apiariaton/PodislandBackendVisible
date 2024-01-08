const sanitiseField = require('./sanitiseTextField'); 
const bowdleriseField = require('./bowdleriseTextField');

class SanitiseInput {

    async cleanText(input){
        try {
        let sanitisedField = sanitiseField(input);
        if (sanitisedField !== null)
        {
            let safeField = await bowdleriseField(sanitisedField);
            return safeField;
        }
        return null;
        }
        catch (e)
        {
            console.log(e);
            return null;
        }
    }

};



module.exports = SanitiseInput;