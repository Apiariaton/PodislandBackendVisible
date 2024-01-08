const {google} = require('googleapis');
const DISCOVERY_URL = 'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

const envPath = path.resolve(__dirname,'../config/.env')
dotenv.config({path:envPath});

const API_KEY = process.env.PERSPECTIVE_API_KEY;


async function screenToxicContent(input,maximumToxicity=0.3)
{
    try
    {
    const client = await google.discoverAPI(DISCOVERY_URL);

    const analyzeRequest = {
            comment: {
            text : input,
        },
        requestedAttributes: {
            TOXICITY: {},
        },
    };

    const response = await client.comments.analyze(
        {
            key: API_KEY,
            resource: analyzeRequest,
        });

    console.log(response.data["attributeScores"]["TOXICITY"]["summaryScore"]["value"]);

    if (response.data["attributeScores"]["TOXICITY"]["summaryScore"]["value"] >= maximumToxicity)
    {
        console.log("Content was found to be too toxic; it is thus being rejected.")
        return null;
    }

    return input;
    }
    catch (e)
    {
        console.log(e);
        return null;

    }
};




async function bowdlerise(input)
{
    try {
        const inputIsSafe = await screenToxicContent(input);
        if (!inputIsSafe)
            return null;
        return input;
    }

    catch (e)
    {
        console.log(e);
        return null;
    }
};
async function runFn()
{
const result = await bowdlerise("Shit Storm")
console.log(result);
}

runFn();

module.exports = bowdlerise;