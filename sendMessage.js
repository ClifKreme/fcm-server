const sendNotification = require("./firebase-messaging");

const rescuerToken = process.argv[2]; // Token passed as command-line argument
const messageTitle = process.argv[3] || "Urgent Help Needed!";
const messageBody = process.argv[4] || "Help needed urgently in your area! Please respond ASAP!";

if (!rescuerToken) {
  console.error("❌ Error: Rescuer token is required.");
  process.exit(1);
}

// Send the notification
sendNotification(rescuerToken, messageTitle, messageBody)
  .then(() => console.log("✅ Notification sent successfully!"))
  .catch((error) => console.error("❌ Error sending notification:", error.message));
