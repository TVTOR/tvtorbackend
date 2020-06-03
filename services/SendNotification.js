var FCM = require('fcm-node');
var serverKey = 'AAAADcqhd6c:APA91bG1ErDbgDJTjoUCrYbltjTz40zo-VyMf5a-jVEIK2Ko1tMNrfvVTlG78KbpNCNncbZu8vXPezpK7Yt6NQdJLQgc1DqVjKxVWSNDeYofVrJ0PQE68BtV1_0R1QCDIMxam6ad455B'; //put your server key here
var fcm = new FCM(serverKey);


const accountSid = 'AC86d2e01162c347f42949c617716f9cea';
const authToken = '40c606e2130bc7fa8d92c5c199bf1bd1';
const client = require('twilio')(accountSid, authToken);


const sendNotification = async (deviceToken, title, body) => {
    console.log('------------deviceToken--------------', deviceToken);
    var message = {
        // to: 'dxFrJGtXRoiQzoXYsJ8QZg:APA91bF7qJxRlVbKxvb84J0GFgbDDpNRgtJj4uBllJMEFBZdV7lRvHzY_XaBa-uE-ij_52vVh9A4vyhXRvoctTe4cymZXya05a69vvfVkDuDU1yLOtchn7zySo0y_4aPwbMuRqUo1S8K', // Multiple tokens in an array
        to: deviceToken,
        collapse_key: 'your_collapse_key',
        notification: {
            title: title,
            body: body
        },
        data: {
            my_key: 'my value',
            my_another_key: 'my another value'
        }
    };
    console.log(message);
    // Send Notification
    fcm.send(message, function (err, response) {
        console.log(response);
        if (err) {
            console.log('Error--------------', err);
            console.log("Something has gone wrong!");
            return false;
        } else {
            console.log("Successfully sent with response: ", response);
            return true;
        }
    });
}

async function sendSMS(mobile, title, body) {
    client.messages
        .create({
            body: body,
            title: 'This student assign for tutor',
            from: '+12057514564',
            to: '+91' + mobile
        })
        .then((message) => {
            console.log(message.sid)
            return true
        });
}



module.exports = {
    sendNotification: sendNotification,
    sendSMS: sendSMS
}      