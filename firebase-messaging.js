const admin = require("firebase-admin");

// Initialize Firebase Admin SDK with service account from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to send push notifications
function sendNotification(tokens, title, body) {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    tokens: Array.isArray(tokens) ? tokens : [tokens], // Ensure it's an array
  };

  return admin
    .messaging()
    .sendEachForMulticast(message) // Use sendEachForMulticast for multiple tokens
    .then((response) => {
      console.log("✅ Notification sent successfully:", response);
      return response;
    })
    .catch((error) => {
      console.error("❌ Error sending notification:", error);
      throw error; // Allow the caller to handle the error
    });
}

module.exports = sendNotification;
