const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp();
const db = admin.firestore();

exports.capitalizeBookData = functions.auth
    .user().onCreate(async (user) => {
      const uid = user.uid;
      const email = user.email;

      const additionalInfo = {
        email: email,
        role: "user",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      db.collection("users").doc(uid).set(additionalInfo);
    });
