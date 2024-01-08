const {
    initializeApp,
    applicationDefault,
    cert,
  } = require("firebase-admin/app");
  const {
    getFirestore,
    Timestamp,
    FieldValue,
    Filter,
  } = require("firebase-admin/firestore");
  
  const dotenv = require('dotenv');
  const path = require('path');
  
  const envPath = path.resolve(__dirname,'../../config/.env');
  dotenv.config({path:envPath});


  const serviceAccount = JSON.parse(process.env.FIREBASE_INITIALISE);

  
  initializeApp({
    credential: cert(serviceAccount),
  });
  
  const db = getFirestore();

  module.exports = db;