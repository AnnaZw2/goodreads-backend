require('dotenv-defaults').config()

const mqttClient = require('./mqtt')
mqttClient.subscribe(process.env.MQTT_TOPIC_PREFIX + "user/created", { qos: 1 });

mqttClient.on('message', function (topic, message, packet) {
    // do some stuff with the message
    console.log("Received message: " + message);
    const msg = JSON.parse(message);
    if (msg.username == undefined || msg.username == null) {
        msg.username = "not set";
    }
    mqttClient.publish(process.env.MQTT_TOPIC_PREFIX + "slack/send", `Account created: username: ${msg.username}, email: ${msg.email}, role: ${msg.role}`, { qos: 1 });
   
});


