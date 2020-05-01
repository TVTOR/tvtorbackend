var FCM = require('fcm-node');
var serverKey = 'AAAABsP6cpA:APA91bFECwaBl8OvwcJPFTAYh_aBl9ntoaUtrPIuSKUo4Uc9Vgf-DpE702wF228VyVVxWPBnhmcIZ_pKjij_qYavmPPUhMFGsHPfVqBZzaLj2zYZJD2-T4zfQUQLZqRe2mYtDBswOu_S'; //put your server key here
var fcm = new FCM(serverKey);

    const  sendNotification = async(deviceToken, title, body)=>{
        var message = {
        to: 'd1LqEJRLSPO26T4h4yKjci:APA91bGKLBYPUo5XJ_F_HZyxCi7_xPLVi8JfVxPVsIPh0WQajyNvy0QWrICafawVvlf7L3zFWbKlmrXwb6OXaF8ka5Gk9qn0of7jpAHzxotuLe94MAsIbBUJrFHctU0zJ_fpvk_UdHD0', // Multiple tokens in an array
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
        fcm.send(message, function(err, response){
        console.log(response);
        if (err) {
        console.log('Error--------------',err);
        console.log("Something has gone wrong!");
        return false;
        } else {
        console.log("Successfully sent with response: ", response);
        return true;
        }
        });
        }



  module.exports = {
      sendNotification: sendNotification
  }      