const express = require('express');
const router = new express.Router();
const togglePodLike = require('./sendPodLikeData');
const podIDList = require("../../Firestore/DBConnect/allPodcasts/podIDlist");
const auth = require("../../Middleware/Authentication/auth");

router.post("/podcasts/:id",auth,async (req,res)=>{
    try {
        const userID = req.user._id;
        const relevantPodcast = req.params.id;
        console.log(relevantPodcast);
        if (!podIDList.includes(relevantPodcast))
        {
            throw new Error("No podcast exists with this ID!");
        }
        const newLikeValue = await togglePodLike(userID,relevantPodcast);
        res.status(200).send(`Podcast successfully ${newLikeValue}`);

    }
    catch (e)
    {
        console.log(e);
        res.status(500).send({error:e.message});
    }

});



module.exports = router;