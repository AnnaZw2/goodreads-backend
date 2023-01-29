/** @format */

const mqttClient = require("./mqtt");
const Comment = require("./models/comment");

mqttClient.on("message", async function (topic, message) {
  let dbComment;
  const msgComment = JSON.parse(message);
  try {
    dbComment = await Comment.find({_id:msgComment._id});
    if (dbComment == null) {
        console.log("Comment not found: " + msgComment._id);
        return
      }
  } catch (err) {
    console.log(`Comment not found: ${msgComment._id}, error: ${err.message}`);
  }

  // magic :)
  let myComment = dbComment[0];
  myComment.updated_at = Date.now();
  myComment.blocked = msgComment.blocked

  try {
    const updatedComment = await myComment.save();
    mqttClient.publish(
      process.env.MQTT_TOPIC_PREFIX + "comments/updated",
      JSON.stringify(updatedComment)
    );
  } catch (err) {
    console.log(
      `Comment not updated: ${msgComment._id}, error: ${err.message}`
    );
  }
});

mqttClient.subscribe(process.env.MQTT_TOPIC_PREFIX + "comments/blocked", {
  qos: 1,
});


module.exports = mqttClient;
  