const express = require('express');

//Security
const helmet = require('helmet'); 
const expressRateLimit = require("express-rate-limit"); 
const {milliseconds,hours,minutes,seconds} = require('time-convert');

const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize'); //Sanitise unwanted Mongo expressions

const cors = require("cors");

//Sub-routers
const podcastFunctionsRouter = require("./PodcastFunctions/podcastFunctionsRouter");
const userFunctionsRouter = require("./UserFunctions/userFunctionsRouter");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

//Set Cross-Origin Resource policy; only allow requests from certain url
//origin: [] for multiple address

const corsOptions = {
    origin: /https:\/\/podisland\.netlify\.app/,
};
///http:\/\/localhost:5173[A-Za-z\/]/

app.use(cors(corsOptions));


// // //Specify that it is safe to transmit data to the requester , by setting 'Access-Control-Allow-Origin' header.
// app.use((req,res,next)=>
// {
//     res.header('Access-Control-Allow-Origin', process.env.FRONT_END_URL);
//     // console.log("Request body",req.body);
//     next();
// });


//Guard against header attacks
app.use(helmet());


//Guard against Mongo injection attacks
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(mongoSanitize());


//Limit no. API requests


//Apply a limit to specific route with app.use('/routename',limiter);

//app.use(limiter);

const limiter = expressRateLimit.rateLimit({
    windowMs: (milliseconds.from(hours,minutes,seconds)(1,0,0)), //Time in milliseconds | 3600000-> 1 hour 
    limit: 100, // 100 API requests per hour
});






app.use(userFunctionsRouter);
app.use(podcastFunctionsRouter);

app.listen(PORT,()=>{`Server running on port ${PORT}`});