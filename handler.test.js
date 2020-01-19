const fetch = require("isomorphic-fetch");

require("dotenv").config();

const handler = require("./handler");
it("handles", async () => {
  const resp = await handler.dailyFinances();
  expect(resp.body).not.toBeNull();
  const balance = JSON.parse(resp.body).balance;
  expect(balance).not.toBeNull();
  expect(typeof balance).toBe("number");
});

it("sendSMS", async () => {
  let phoneNumber = "";
  if (process.env.SMS_NOTIFICATIONS_PHONE_NUMBERS) {
    phoneNumber = process.env.SMS_NOTIFICATIONS_PHONE_NUMBERS.split(",")[0];
  }

  const message = "Hello world";
  const resp = await handler.sendSMS(phoneNumber, message);
  expect(resp.body).not.toBeNull();
});

it("sendMessageToSubscribers", async () => {
  const message = "notifsendMessageToSubscribersySubscribers test";
  const resp = await handler.sendMessageToSubscribers(message);
  expect(resp.body).not.toBeNull();
});

it("notifySubscribers", async () => {
  const resp = await handler.notifySubscribers();
  expect(resp.body).not.toBeNull();
});
