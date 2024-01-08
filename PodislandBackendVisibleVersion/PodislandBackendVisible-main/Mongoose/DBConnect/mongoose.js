const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');


async function main()
{


const envPath = path.resolve(__dirname,'../../config/.env');
dotenv.config({path:envPath});

try
{
const connection = await mongoose.connect(
    process.env.MONGODB_URL
);
}
catch (e)
{
    console.log(e);
    throw new Error("Error connecting to MongoDB database...");
}

};

main();