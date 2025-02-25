const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const sendNotification = require("./firebase-messaging");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error) {
    console.error("🔥 Firebase Initialization Error:", error.message);
  }
}

const db = getFirestore();

// ✅ Simple GET route for testing
app.get("/", (req, res) => {
  res.send("✅ Server is running! Use /sendMessage to send notifications.");
});

// ✅ API to send emergency messages
app.post("/sendMessage", async (req, res) => {
  try {
    const { fullName, message } = req.body;
    if (!fullName || !message) {
      return res.status(400).json({ error: "Missing fullName or message" });
    }

    const rescuersSnapshot = await db.collection("rescuers").get();
    const rescuerTokens = rescuersSnapshot.docs
      .map((doc) => doc.data().token)
      .filter((token) => token);

    if (rescuerTokens.length === 0) {
      return res.status(400).json({ error: "No rescuers available" });
    }

    await sendNotification(
      rescuerTokens,
      "🚨 Emergency Alert",
      `${fullName} needs assistance: ${message}`
    );

    res.status(200).json({ message: "Notification sent to rescuers" });
  } catch (error) {
    console.error("🔥 Error sending message:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// ✅ Use Render's port
const port = process.env.PORT || 10000;
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
});
