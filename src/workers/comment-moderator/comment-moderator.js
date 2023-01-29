/** @format */

require("dotenv-defaults").config();

const mqttClient = require("./mqtt");
mqttClient.on("message", function (topic, message, packet) {
  comment = JSON.parse(message)
  let actOnComment = false;
  if (topic == process.env.MQTT_TOPIC_PREFIX + "comments/created") {
    actOnComment = true;
  }
  if (topic == process.env.MQTT_TOPIC_PREFIX + "comments/updated" && !comment.blocked.is_blocked) {
    actonComment = true;
    console.log("Comment updated");
  }

  console.log(message.toString());
  console.log("Want to act on comment: " + actOnComment);

});

mqttClient.subscribe(
  [
    process.env.MQTT_TOPIC_PREFIX + "comments/created",
    process.env.MQTT_TOPIC_PREFIX + "comments/updated",
  ],
  { qos: 1 }
);
