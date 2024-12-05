const { v4: uuidv4 } = require('uuid')
const mqtt=require('mqtt');
const clientId = process.env.MQTT_CLIENT_ID+"-"+uuidv4().toString();
const mqttClient = mqtt.connect(process.env.MQTT_URL,{clientId: clientId});
mqttClient.on("connect",function(){	console.log(`Connected to MQTT broker: ${process.env.MQTT_URL}, client: ${clientId}`);})
mqttClient.on("error",function(error){	console.log("Can't connect to MQTT broker: "+process.env.MQTT_URL);})

module.exports = mqttClient
