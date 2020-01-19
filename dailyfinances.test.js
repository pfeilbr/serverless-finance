const fetch = require("isomorphic-fetch");

require("dotenv").config();

const dailyfinances = require("./dailyfinances");
it("get balance", async () => {
  const balance = await dailyfinances.balance();
  expect(balance).not.toBeNull();
  expect(typeof balance).toBe("number");
});
