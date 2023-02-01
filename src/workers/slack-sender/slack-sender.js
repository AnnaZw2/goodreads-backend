require('dotenv-defaults').config()

const slackNotify = require('slack-notify');
const slack = slackNotify(process.env.SLACK_WEBHOOK_URL);
const mqttClient = require('./mqtt')

mqttClient.subscribe(process.env.MQTT_TOPIC_PREFIX + "slack/send", { qos: 1 });

mqttClient.on('message', function (topic, message, packet) {

  slack.send({
    text: message.toString(),

  });
});
