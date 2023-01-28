require('dotenv-defaults').config()

const slackNotify = require('slack-notify');
const slack = slackNotify(process.env.SLACK_WEBHOOK_URL);

const mqttClient  = require('./mqtt')
mqttClient.on('message',function(topic, message, packet){
    slack.send({
        channel: '#goodreads',
        icon_emoji: ':ghost:',
        text: message.toString(),
        unfurl_links: 1,
        username: 'Admin'
      });
	// console.log("message is "+ message);
	// console.log("topic is "+ topic);
    // console.log("packet =" +JSON.stringify(packet));
	// console.log("packet retain =" +packet.retain);
});
mqttClient.subscribe(process.env.MQTT_TOPIC_PREFIX+"slack/send", {qos: 1});
