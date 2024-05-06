
// src/firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json'); // Path ko update karein
// console.log("serviceAccount :", serviceAccount);

const firebaseConfig = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://hassan-nadeem.firebaseio.com" // Apne Firebase URL se update karein
};
// console.log("firebaseConfig :", firebaseConfig);
// console.log("databaseURL :", databaseURL);



admin.initializeApp(firebaseConfig);

const db = admin.firestore();

module.exports = { admin, db };
