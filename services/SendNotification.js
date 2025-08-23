// HYBRID NOTIFICATION SERVICE - v1 API with Legacy Fallback
const SendNotificationV1 = require('./SendNotificationV1');

// Load environment variables
require('dotenv').config();

// Legacy FCM as fallback
var FCM = require('fcm-node');
var serverKey = process.env.FCM_SERVER_KEY || 'AAAADcqhd6c:APA91bG1ErDbgDJTjoUCrYbltjTz40zo-VyMf5a-jVEIK2Ko1tMNrfvVTlG78KbpNCNncbZu8vXPezpK7Yt6NQdJLQgc1DqVjKxVWSNDeYofVrJ0PQE68BtV1_0R1QCDIMxam6ad455B';
var fcm = new FCM(serverKey);

// PRIMARY: Use Firebase v1 API, fallback to legacy if needed
const sendNotification = async (deviceToken, title, body, notdata) => {
    try {
        // Try v1 API first
        const v1Result = await SendNotificationV1.sendNotification(deviceToken, title, body, notdata);
        if (v1Result) {
            return true;
        }
        throw new Error('v1 API returned false');
        
    } catch (error) {
        // Fallback to legacy FCM
        return new Promise((resolve) => {
            var message = {
                to: deviceToken,
                collapse_key: 'tvtor_notification',
                notification: {
                    title: title,
                    body: body
                },
                data: {
                    click_action: 'FLUTTER_NOTIFICATION_CLICK',
                    notificationId: notdata._id.toString(),
                    studentName: notdata.queryData?.name || '',
                    subject: notdata.queryData?.subject || '',
                    location: notdata.queryData?.location || ''
                }
            };
            
            fcm.send(message, function (err, response) {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }
}

// Twilio Configuration - USE ENVIRONMENT VARIABLES
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC5a479b676619bfcdf8f065ac7f04ec41';
const authToken = process.env.TWILIO_AUTH_TOKEN || '71895a8d90363b05d7e5e90c2a26c7b7'; // UPDATED to correct token
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+12054309667';

// Debug: Log which Twilio credentials are being used
console.log('🔧 Twilio Configuration:');
console.log('  Account SID:', accountSid);
console.log('  Phone Number:', twilioPhoneNumber);
console.log('  Auth Token:', authToken ? authToken.substring(0, 8) + '...' : 'NOT SET');
console.log('  Default Country Code:', process.env.DEFAULT_COUNTRY_CODE || '+92');
console.log('  Tutor Country Code:', process.env.TUTOR_COUNTRY_CODE || '+92');
console.log('  Student Country Code:', process.env.STUDENT_COUNTRY_CODE || '+92');

// Configurable country codes for different regions
const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_COUNTRY_CODE || '+92'; // Pakistan
const TUTOR_COUNTRY_CODE = process.env.TUTOR_COUNTRY_CODE || DEFAULT_COUNTRY_CODE;
const STUDENT_COUNTRY_CODE = process.env.STUDENT_COUNTRY_CODE || DEFAULT_COUNTRY_CODE;

const client = require('twilio')(accountSid, authToken);

async function sendSMS(mobile, title, body) {
    try {
        console.log("📱 DEBUG: SendNotification.sendSMS called");
        console.log("📱 DEBUG: Mobile:", mobile);
        console.log("📱 DEBUG: Title:", title);
        console.log("📱 DEBUG: Body:", body);
        
        // Convert mobile to string if it's a number
        let phoneNumber = typeof mobile === 'number' ? mobile.toString() : mobile;
        
        // Smart phone number formatting using configurable tutor country code
        const tutorCountryNum = TUTOR_COUNTRY_CODE.replace('+', ''); // Remove + for comparison
        
        console.log("📱 DEBUG: Original phone:", phoneNumber);
        console.log("📱 DEBUG: Tutor country code:", TUTOR_COUNTRY_CODE);
        
        // If number starts with country code but no +, add the +
        if (phoneNumber.startsWith(tutorCountryNum) && !phoneNumber.startsWith(TUTOR_COUNTRY_CODE)) {
            phoneNumber = '+' + phoneNumber;
        }
        // If number doesn't start with + and doesn't start with country code, add tutor country code
        else if (!phoneNumber.startsWith('+') && !phoneNumber.startsWith(tutorCountryNum)) {
            phoneNumber = TUTOR_COUNTRY_CODE + phoneNumber;
        }
        
        console.log("📱 DEBUG: Final phone number:", phoneNumber);
        console.log("📱 DEBUG: Using Account SID:", accountSid);
        console.log("📱 DEBUG: Using Auth Token:", authToken.substring(0, 8) + '...');
        console.log("📱 DEBUG: From Phone Number:", twilioPhoneNumber);
        console.log("📱 DEBUG: Attempting Twilio SMS...");
        
        const message = await client.messages.create({
            body: body,
            from: twilioPhoneNumber,
            to: phoneNumber
        });
        
        console.log("✅ DEBUG: SMS sent successfully!");
        console.log("📊 DEBUG: Message SID:", message.sid);
        
        return message.sid;
    } catch (error) {
        console.log("❌ DEBUG: SMS sending failed:", error.message);
        console.log("❌ DEBUG: Error code:", error.code);
        throw error;
    }
}

async function sendSMStoStudent(mobile, title, body) {
    try {
        console.log("📱 DEBUG: SendNotification.sendSMStoStudent called");
        console.log("📱 DEBUG: Mobile:", mobile);
        console.log("📱 DEBUG: Title:", title);
        console.log("📱 DEBUG: Body:", body);
        
        // Convert mobile to string if it's a number
        let phoneNumber = typeof mobile === 'number' ? mobile.toString() : mobile;
        
        // Smart phone number formatting using configurable student country code
        const studentCountryNum = STUDENT_COUNTRY_CODE.replace('+', ''); // Remove + for comparison
        
        console.log("📱 DEBUG: Original phone:", phoneNumber);
        console.log("📱 DEBUG: Student country code:", STUDENT_COUNTRY_CODE);
        
        // If number starts with country code but no +, add the +
        if (phoneNumber.startsWith(studentCountryNum) && !phoneNumber.startsWith(STUDENT_COUNTRY_CODE)) {
            phoneNumber = '+' + phoneNumber;
        }
        // If number doesn't start with + and doesn't start with country code, add student country code
        else if (!phoneNumber.startsWith('+') && !phoneNumber.startsWith(studentCountryNum)) {
            phoneNumber = STUDENT_COUNTRY_CODE + phoneNumber;
        }
        
        console.log("📱 DEBUG: Final phone number:", phoneNumber);
        console.log("📱 DEBUG: Attempting Twilio SMS...");
        
        const message = await client.messages.create({
            body: body,
            from: twilioPhoneNumber,
            to: phoneNumber
        });
        
        console.log("✅ DEBUG: SMS sent successfully!");
        console.log("📊 DEBUG: Message SID:", message.sid);
        
        return message.sid;
    } catch (error) {
        console.log("❌ DEBUG: SMS sending failed:", error.message);
        console.log("❌ DEBUG: Error code:", error.code);
        throw error;
    }
}

module.exports = {
    sendNotification: sendNotification,
    sendSMS: sendSMS,
    sendSMStoStudent: sendSMStoStudent
}      