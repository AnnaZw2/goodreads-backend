const { request, settings } = require('pactum');
const { Before } = require('@cucumber/cucumber');


require(`dotenv-defaults`).config({
  path: './.env',
  encoding: 'utf8',
  defaults: './.env.defaults' 
})

Before(() => {
  settings.setReporterAutoRun(false);
  request.setBaseUrl(process.env.BASE_URL);
  request.setBearerToken(process.env.JWT_TOKEN_USER_VALID);
});