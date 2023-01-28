require('dotenv-defaults').config()


const mqttClient  = require('./mqtt')
mqttClient.on('message',function(topic, message, packet){
// do some stuff with the message
console.log("topic is "+ topic);
console.log("message is "+ message);
const msg = JSON.parse(message);
console.log("msg is "+ msg);
mqttClient.publish(process.env.MQTT_TOPIC_PREFIX+"slack/send", `account created. Username: ${msg.username}, email: ${msg.email}, role: ${msg.role}`, {qos: 1});
});

mqttClient.subscribe(process.env.MQTT_TOPIC_PREFIX+"user/created", {qos: 1});

