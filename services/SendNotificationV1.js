// UPDATED FCM SERVICE USING FIREBASE V1 API
var admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
let firebaseApp = null;

const initializeFirebase = () => {
    if (firebaseApp) return firebaseApp;
    
    try {
        // Option 1: Use service account JSON directly from FIREBASE_SERVICE_ACCOUNT_PATH env variable
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
        
        if (serviceAccountJson) {
            
            try {
                const serviceAccount = JSON.parse(serviceAccountJson);
                firebaseApp = admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
                console.log('🔥 Firebase Admin initialized from FIREBASE_SERVICE_ACCOUNT_PATH env variable');
                return firebaseApp;
            } catch (jsonError) {
                console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_PATH JSON:', jsonError.message);
            }
        }
        
        // Option 2: Fallback to file path (original method)
        // const serviceAccountPath = 'tvtor-a9803-firebase-adminsdk-fbsvc-6066a8a059.json';
        // const serviceAccount = require(`../${serviceAccountPath}`);
        
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        
        console.log('🔥 Firebase Admin initialized from service account file');
        console.log('📁 Service Account Path:', serviceAccountPath);
        return firebaseApp;
        
    } catch (error) {
        console.error('❌ Firebase initialization failed completely:', error.message);
        throw error;
    }
};

// Modern FCM v1 API notification function
const sendNotificationV1 = async (deviceToken, title, body, notdata) => {
    try {
        // Initialize Firebase if not already done
        const app = initializeFirebase();
        
        // Prepare message using v1 API format
        const message = {
            token: deviceToken, // Single device token
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
            },
            android: {
                priority: 'high',
                notification: {
                    sound: 'tvtor_notification_sound',
                    channel_id: 'tvtor_notifications'
                }
            }
        };
        
        console.log('📤 Sending FCM v1 notification...');
        console.log('📱 Device Token:', deviceToken.substring(0, 20) + '...');
        console.log('📋 Title:', title);
        console.log('📝 Body:', body);
        
        // Send using Firebase Admin SDK
        const response = await admin.messaging().send(message);
        
        console.log('✅ FCM v1 notification sent successfully!');
        console.log('📊 Message ID:', response);
        console.log('🎉 Push notification delivered!');
        
        return true;
        
    } catch (error) {
        console.error('❌ FCM v1 notification failed:', error.message);
        
        if (error.code === 'messaging/registration-token-not-registered') {
            console.error('💡 Device token is invalid or expired');
        } else if (error.code === 'messaging/invalid-registration-token') {
            console.error('💡 Device token format is invalid');
        } else if (error.code === 'app/no-app') {
            console.error('💡 Firebase Admin not initialized properly');
        } else {
            console.error('💡 Other FCM error:', error.code);
        }
        
        return false;
    }
};

// Twilio Configuration (unchanged)
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC5a479b676619bfcdf8f065ac7f04ec41';
const authToken = process.env.TWILIO_AUTH_TOKEN || '71895a8d90363b05d7e5e90c2a26c7b7';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+12054309667';

console.log('🔧 Twilio Configuration:');
console.log('  Account SID:', accountSid);
console.log('  Phone Number:', twilioPhoneNumber);
console.log('  Auth Token:', authToken ? authToken.substring(0, 8) + '...' : 'NOT SET');

const client = require('twilio')(accountSid, authToken);

// SMS functions (unchanged)
async function sendSMS(mobile, title, body) {
    try {
        let phoneNumber = mobile;
        if (!phoneNumber.startsWith('+')) {
            phoneNumber = '+92' + phoneNumber;
            console.log('📤 Sending SMS to tutor (Pakistan): ' + phoneNumber);
        } else {
            console.log('📤 Sending SMS to tutor (International): ' + phoneNumber);
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
        let phoneNumber = mobile;
        if (!phoneNumber.startsWith('+')) {
            phoneNumber = '+92' + phoneNumber;
            console.log('📤 Sending SMS to student (Pakistan): ' + phoneNumber);
        } else {
            console.log('📤 Sending SMS to student (International): ' + phoneNumber);
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
    sendNotification: sendNotificationV1, // Use the new v1 function
    sendSMS: sendSMS,
    sendSMStoStudent: sendSMStoStudent,
    initializeFirebase: initializeFirebase
};
