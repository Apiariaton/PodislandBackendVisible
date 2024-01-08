const {initializeApp,applicationDefault,cert,} = require("firebase-admin/app");
const { getFirestore,Timestamp,FieldValue,Filter,} = require("firebase-admin/firestore");
const serviceAccount = require("../../CloudFirestoreSetUpPodcastData/coreData/json-key-to-access-cloud-firestore/podisland-b1b5c-8c532e5fba02.json");
const addUserLikeProfile = require("../../UserFunctions/LoginLogout/addUserLikeProfile");
const togglePodLike = require("../../CloudFirestoreSetUpPodcastData/userFunctions/togglePodLike");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const dataFromThisCollRef = db.collection("podcasts");
const dataToThisCollRef = db.collection("podcastLikes");

//addUserLikeProfile(dataFromThisCollRef,dataToThisCollRef,"Bryan");
togglePodLike(dataToThisCollRef,"Bryan","pod1");