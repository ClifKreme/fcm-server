const sendNotification = require('./firebase-messaging');

// Your rescuer's token
const rescuerToken = process.argv[2];  // Token passed as command line argument

// Message details
const messageTitle = process.argv[3] || 'Urgent Help Needed!';  // Title from command line or default
const messageBody = process.argv[4] || 'Help needed urgently in your area! Please respond ASAP!';  // Body from command line or default

// Call the sendNotification function
sendNotification(rescuerToken, messageTitle, messageBody);
