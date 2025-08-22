var FCM = require('fcm-node');

// Load environment variables
require('dotenv').config();

// FCM Configuration
var serverKey = 'AAAADcqhd6c:APA91bG1ErDbgDJTjoUCrYbltjTz40zo-VyMf5a-jVEIK2Ko1tMNrfvVTlG78KbpNCNncbZu8vXPezpK7Yt6NQdJLQgc1DqVjKxVWSNDeYofVrJ0PQE68BtV1_0R1QCDIMxam6ad455B';
var fcm = new FCM(serverKey);

// Twilio Configuration - USE ENVIRONMENT VARIABLES
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC5a479b676619bfcdf8f065ac7f04ec41';
const authToken = process.env.TWILIO_AUTH_TOKEN || '467b418c1f708f0cc4cb89260e2837e1';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+12054309667';

console.log('🔧 Twilio Configuration:');
console.log('  Account SID:', accountSid);
console.log('  Phone Number:', twilioPhoneNumber);
console.log('  Auth Token:', authToken ? authToken.substring(0, 8) + '...' : 'NOT SET');

const client = require('twilio')(accountSid, authToken);

const sendNotification = async (deviceToken, title, body, notdata) => {
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
    // Send Notification
    fcm.send(message, function (err, response) {
        console.log('notification response in fcm send method', response);
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
    try {
        console.log('📤 Sending SMS to tutor (India): +91' + mobile);
        const message = await client.messages.create({
            body: body,
            from: twilioPhoneNumber,
            to: '+91' + mobile
        });
        console.log('✅ SMS sent to tutor - SID:', message.sid);
        console.log('📊 Status:', message.status);
        return message.sid;
    } catch (error) {
        console.error('❌ SMS to tutor failed:', error.message);
        console.error('   Error code:', error.code);
        throw error;
    }
}

async function sendSMStoStudent(mobile, title, body) {
    try {
        console.log('📤 Sending SMS to student (Italy): +39' + mobile);
        const message = await client.messages.create({
            body: body,
            from: twilioPhoneNumber,
            to: '+39' + mobile
        });
        console.log('✅ SMS sent to student - SID:', message.sid);
        console.log('📊 Status:', message.status);
        return message.sid;
    } catch (error) {
        console.error('❌ SMS to student failed:', error.message);
        console.error('   Error code:', error.code);
        throw error;
    }
}

module.exports = {
    sendNotification: sendNotification,
    sendSMS: sendSMS,
    sendSMStoStudent: sendSMStoStudent
}      