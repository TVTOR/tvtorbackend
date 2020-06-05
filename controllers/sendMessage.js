var utilServices = require('../services/Util');
const { constants } = require(`${appRoot}/lib/constants`);
var utilServices = require('../services/Util');

// const accountSid = 'AC86d2e01162c347f42949c617716f9cea';
// const authToken = '40c606e2130bc7fa8d92c5c199bf1bd1';
const accountSid = 'AC5a479b676619bfcdf8f065ac7f04ec41';
const authToken = '467b418c1f708f0cc4cb89260e2837e1';
const client = require('twilio')(accountSid, authToken);

const sendMessage = async (req, res) => {
    try {
        client.messages
            .create({
                body: 'Message from tutor manager.',
                from: '+12057514564',
                to: '+19560315560'
            })
            .then(message => console.log(message.sid));
        //   return utilServices.successResponse(res, constants.TUTOR_CREATE, 200, data);
    } catch (error) {
        return utilServices.successResponse(res, constants.DB_ERROR, 500);
    }
}

module.exports = {
    sendMessage: sendMessage
}
