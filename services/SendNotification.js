// HYBRID NOTIFICATION SERVICE - v1 API with Legacy Fallback
const SendNotificationV1 = require('./SendNotificationV1');

// Load environment variables
require('dotenv').config();

// Legacy FCM as fallback
var FCM = require('fcm-node');
var serverKey = process.env.FCM_SERVER_KEY || 'AAAADcqhd6c:APA91bG1ErDbgDJTjoUCrYbltjTz40zo-VyMf5a-jVEIK2Ko1tMNrfvVTlG78KbpNCNncbZu8vXPezpK7Yt6NQdJLQgc1DqVjKxVWSNDeYofVrJ0PQE68BtV1_0R1QCDIMxam6ad455B';
var fcm = new FCM(serverKey);

console.log('🔥 Hybrid FCM Configuration:');
console.log('  Firebase v1 API: Primary');
console.log('  Legacy FCM Key:', serverKey ? serverKey.substring(0, 20) + '...' : 'NOT SET');
console.log('  Service Account:', process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'tvtor-a9803-firebase-adminsdk-fbsvc-6066a8a059.json');

// PRIMARY: Use Firebase v1 API, fallback to legacy if needed
const sendNotification = async (deviceToken, title, body, notdata) => {
    console.log('� Attempting FCM notification...');
    console.log('📱 Method: Firebase v1 API (Primary)');
    
    try {
        // Try v1 API first
        const v1Result = await SendNotificationV1.sendNotification(deviceToken, title, body, notdata);
        if (v1Result) {
            console.log('✅ Firebase v1 API notification successful!');
            return true;
        }
        throw new Error('v1 API returned false');
        
    } catch (error) {
        console.log('⚠️ Firebase v1 API failed, trying legacy fallback...');
        console.log('   Error:', error.message);
        
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
                    console.log('❌ Legacy FCM also failed:', err.message);
                    resolve(false);
                } else {
                    console.log('✅ Legacy FCM fallback successful!');
                    console.log('📊 Response:', response);
                    resolve(true);
                }
            });
        });
    }
}

// Twilio Configuration - USE ENVIRONMENT VARIABLES
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC5a479b676619bfcdf8f065ac7f04ec41';
const authToken = process.env.TWILIO_AUTH_TOKEN || '388fd4964d75424249c77555b6228aea';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+12054309667';

// Configurable country codes for different regions
const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_COUNTRY_CODE || '+92'; // Pakistan
const TUTOR_COUNTRY_CODE = process.env.TUTOR_COUNTRY_CODE || DEFAULT_COUNTRY_CODE;
const STUDENT_COUNTRY_CODE = process.env.STUDENT_COUNTRY_CODE || DEFAULT_COUNTRY_CODE;

console.log('🔧 Twilio Configuration:');
console.log('  Account SID:', accountSid);
console.log('  Phone Number:', twilioPhoneNumber);
console.log('  Auth Token:', authToken ? authToken.substring(0, 8) + '...' : 'NOT SET');
console.log('  Default Country Code:', DEFAULT_COUNTRY_CODE);
console.log('  Tutor Country Code:', TUTOR_COUNTRY_CODE);
console.log('  Student Country Code:', STUDENT_COUNTRY_CODE);

const client = require('twilio')(accountSid, authToken);

async function sendSMS(mobile, title, body) {
    try {
        // Convert mobile to string if it's a number
        let phoneNumber = typeof mobile === 'number' ? mobile.toString() : mobile;
        
        // Smart phone number formatting using configurable tutor country code
        const tutorCountryNum = TUTOR_COUNTRY_CODE.replace('+', ''); // Remove + for comparison
        
        // If number starts with country code but no +, add the +
        if (phoneNumber.startsWith(tutorCountryNum) && !phoneNumber.startsWith(TUTOR_COUNTRY_CODE)) {
            phoneNumber = '+' + phoneNumber;
            console.log('📤 Sending SMS to tutor (formatted):', phoneNumber);
        }
        // If number doesn't start with + and doesn't start with country code, add tutor country code
        else if (!phoneNumber.startsWith('+') && !phoneNumber.startsWith(tutorCountryNum)) {
            phoneNumber = TUTOR_COUNTRY_CODE + phoneNumber;
            console.log('📤 Sending SMS to tutor (local):', phoneNumber, 'using prefix:', TUTOR_COUNTRY_CODE);
        } else {
            console.log('📤 Sending SMS to tutor (international):', phoneNumber);
        }
        
        const message = await client.messages.create({
            body: body,
            from: twilioPhoneNumber,
            to: phoneNumber
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
        // Convert mobile to string if it's a number
        let phoneNumber = typeof mobile === 'number' ? mobile.toString() : mobile;
        
        // Smart phone number formatting using configurable student country code
        const studentCountryNum = STUDENT_COUNTRY_CODE.replace('+', ''); // Remove + for comparison
        
        // If number starts with country code but no +, add the +
        if (phoneNumber.startsWith(studentCountryNum) && !phoneNumber.startsWith(STUDENT_COUNTRY_CODE)) {
            phoneNumber = '+' + phoneNumber;
            console.log('📤 Sending SMS to student (formatted):', phoneNumber);
        }
        // If number doesn't start with + and doesn't start with country code, add student country code
        else if (!phoneNumber.startsWith('+') && !phoneNumber.startsWith(studentCountryNum)) {
            phoneNumber = STUDENT_COUNTRY_CODE + phoneNumber;
            console.log('📤 Sending SMS to student (local):', phoneNumber, 'using prefix:', STUDENT_COUNTRY_CODE);
        } else {
            console.log('📤 Sending SMS to student (international):', phoneNumber);
        }
        
        const message = await client.messages.create({
            body: body,
            from: twilioPhoneNumber,
            to: phoneNumber
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