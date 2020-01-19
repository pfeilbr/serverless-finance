const AWS = require("aws-sdk");
const dailyfinances = require("./dailyfinances");

const sendSMS = async (phoneNumber, message) => {
  const sns = new AWS.SNS();
  const publishParams = {
    Message: message,
    PhoneNumber: phoneNumber
  };
  const resp = await sns.publish(publishParams).promise();
  return resp;
};

const getSmsNotificationsPhoneNumbers = async () => {
  const ssm = new AWS.SSM();
  const resp = await ssm
    .getParameter({ Name: process.env.SMS_NOTIFICATIONS_PHONE_NUMBERS_KEY })
    .promise();
  console.log(resp);
  const smsNotificationsPhoneNumbers = JSON.parse(resp.Parameter.Value);
  return smsNotificationsPhoneNumbers;
};

const sendMessageToSubscribers = async message => {
  let phoneNumbers = [];

  if (process.env.SMS_NOTIFICATIONS_PHONE_NUMBERS) {
    phoneNumbers = process.env.SMS_NOTIFICATIONS_PHONE_NUMBERS.split(",");
  } else if (process.env.SMS_NOTIFICATIONS_PHONE_NUMBERS_KEY) {
    phoneNumbers = await getSmsNotificationsPhoneNumbers();
  } else {
    throw new Error("no phone numbers to send SMS to");
  }

  const resp = await Promise.all(
    phoneNumbers.map(phoneNumber => sendSMS(phoneNumber, message))
  );
  return resp;
};

const getBalanceDetails = async () => {
  const balance = await dailyfinances.balance();
  const message = `$${balance}.  https://bit.ly/2R9nPal`;
  return {
    balance,
    message
  };
};

const notifySubscribers = async () => {
  const balanceDetails = await getBalanceDetails();
  const resp = await sendMessageToSubscribers(balanceDetails.message);
  return resp;
};

const handler = async event => {
  const balanceDetails = await getBalanceDetails();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        balance: balanceDetails.balance,
        message: balanceDetails.message
      },
      null,
      2
    )
  };
};

module.exports.dailyFinances = handler;
module.exports.sendSMS = sendSMS;
module.exports.sendMessageToSubscribers = sendMessageToSubscribers;
module.exports.getBalanceDetails = getBalanceDetails;
module.exports.notifySubscribers = notifySubscribers;
