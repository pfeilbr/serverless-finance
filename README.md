# serverless-finances

send balance in google sheets to SMS notification phone numbers. runs daily.  SMS numbers stored in SSM parameter store.

access to google sheets doc is via [Google APIs Node.js Client](https://github.com/googleapis/google-api-nodejs-client).  OAuth is used to authenticate and the first time requires user interaction.  `credentials.json` contains the OAuth details and `token.json` contains `access_token`, `refresh_token`, etc.

To update functon with `token.json`, run locally which will generate `token.json`, then deploy.

## Running

```sh
# install deps
npm install

# copy `.env.sample` and update
cp .env.sample .env

# run tests in watch mode
npm run test -- --watch

# run tests
npm run test

# deploy
npm run deploy

# manual run of `notifySubscribers` function
SLS_DEBUG=* ./node_modules/.bin/serverless invoke --function notifySubscribers
```

## TODO

* store and maintain `token.json` contents in secrets manager