const admin = require("firebase-admin");

// ✅ Function to send push notifications
async function sendNotification(tokens, title, body) {
  if (!tokens || tokens.length === 0) {
    throw new Error("❌ No valid FCM tokens provided.");
  }

  const message = {
    notification: { title, body },
    tokens: Array.isArray(tokens) ? tokens : [tokens], // Ensure tokens is an array
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("✅ Notification sent successfully:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    throw error;
  }
}

module.exports = sendNotification;
