const admin = require("firebase-admin");
const functions = require("firebase-functions");

const email = require("./email");

admin.initializeApp();
const db = admin.firestore();

exports.onUserCreated = functions.auth
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

exports.onUserFirestoreDeleted = functions.firestore
    .document("users/{userId}")
    .onDelete(async (snap, context) => {
      const userId = context.params.userId;
      await admin.auth().deleteUser(userId);
    });

exports.onBookingCreated = functions.firestore
    .document("bookings/{bookingId}")
    .onCreate((snap, context) => {
      const bookingDetails = snap.data();
      console.log(bookingDetails);
      email.sendBookingEmail(bookingDetails);
    });

exports.sendMessage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("permission-denied", "You must be logged in.");
  }

  // Check if the user is an admin
  const uid = context.auth.uid;
  const userDoc = await admin.firestore().collection("users").doc(uid).get();
  if (!userDoc.exists || userDoc.data().role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Only admins can send emails.");
  }

  email.sendMail(data);
});
