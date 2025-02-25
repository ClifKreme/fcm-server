const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

// ✅ Import the Firebase messaging function
const sendNotification = require("./firebase-messaging");

const app = express();
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json());

// ✅ Initialize Firebase Admin SDK using environment variable
if (!admin.apps.length) {
  try {
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG); // Read from Render Environment Variable
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
    console.log("🔥 Firebase initialized successfully.");
  } catch (error) {
    console.error("❌ Firebase Initialization Error:", error.message);
  }
}

const db = getFirestore();

// ✅ API to send emergency messages
app.post("/sendMessage", async (req, res) => {
  try {
    const { fullName, message } = req.body; // ✅ Use fullName instead of userId

    if (!fullName || !message) {
      return res.status(400).json({ error: "Missing fullName or message" });
    }

    // ✅ Fetch all rescuers' FCM tokens from Firestore
    const rescuersSnapshot = await db.collection("rescuers").get();
    const rescuerTokens = rescuersSnapshot.docs
      .map((doc) => doc.data().token)
      .filter((token) => token);

    if (rescuerTokens.length === 0) {
      return res.status(400).json({ error: "No rescuers available" });
    }

    // ✅ Send notification to all rescuers
    await sendNotification(rescuerTokens, "🚨 Emergency Alert", `${fullName} needs assistance: ${message}`);

    res.status(200).json({ message: "Notification sent to rescuers" });
  } catch (error) {
    console.error("🔥 Error sending message:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// ✅ Start the server (Allow External Access)
const port = process.env.PORT || 4000;
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
});
