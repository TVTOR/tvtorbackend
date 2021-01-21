var FCM = require('fcm-node');
var serverKey = 'AAAADcqhd6c:APA91bG1ErDbgDJTjoUCrYbltjTz40zo-VyMf5a-jVEIK2Ko1tMNrfvVTlG78KbpNCNncbZu8vXPezpK7Yt6NQdJLQgc1DqVjKxVWSNDeYofVrJ0PQE68BtV1_0R1QCDIMxam6ad455B'; //put your server key here
var fcm = new FCM(serverKey);

const accountSid = 'AC5a479b676619bfcdf8f065ac7f04ec41';
const authToken = '467b418c1f708f0cc4cb89260e2837e1';
const client = require('twilio')(accountSid, authToken);

const sendNotification = async (deviceToken, title, body, notdata) => {
    console.log('=====sendNotification===========', deviceToken)
        var message = {
            to: deviceToken,
            collapse_key: 'your_collapse_key',
            notification: {
                title: title,
                body: body
            },
            data: {
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
                notificationId: notdata._id
            }
        };
    console.log(message);
    // Send Notification
    fcm.send(message, function (err, response) {
        console.log(response);
        if (err) {
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
            from: '+12054309667',
            to: '+39' + mobile
        })
        .then((message) => {
            console.log(message.sid)
            return true
        });
}

async function sendSMStoStudent(mobile, title, body) {
    client.messages
        .create({
            body: body,
            title: 'This student assign for tutor',
            // from: '+12057514564',
            from: '+12054309667',
            to: '+39' + mobile
        })
        .then((message) => {
            console.log(message.sid)
            return true
        });
}

module.exports = {
    sendNotification: sendNotification,
    sendSMS: sendSMS,
    sendSMStoStudent: sendSMStoStudent
}      