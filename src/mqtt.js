const mqtt=require('mqtt');
const mqttClient = mqtt.connect(process.env.MQTT_URL,{clientId:process.env.MQTT_CLIENT_ID})
mqttClient.on("connect",function(){	console.log("Connected to MQTT broker: "+process.env.MQTT_URL);})
mqttClient.on("error",function(error){	console.log("Can't connect to MQTT broker: "+process.env.MQTT_URL);})

module.exports = { mqttClient }
