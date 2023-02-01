/** @format */

const moderatorRules = [
  {
    search: /fuck|shit/i,
    block: true,
    reason: "Comment contains forbidden words",
  },
  {
    search: /free/i,
    block: true,
    reason: "Comment is spam"
  }
];

require("dotenv-defaults").config();
const mqttClient = require("./mqtt");

mqttClient.on("message", function (topic, message, packet) {
  let comment = JSON.parse(message);
  let actOnComment = false;
  if (topic == process.env.MQTT_TOPIC_PREFIX + "comments/created") {
    actOnComment = true;
  }
  if (
    topic == process.env.MQTT_TOPIC_PREFIX + "comments/updated" &&
    !comment.blocked.is_blocked
  ) {
    actonComment = true;
  }

  console.log(message.toString());
  console.log("Want to act on comment: " + actOnComment);

  if (actOnComment) {
    for (i = 0; i < moderatorRules.length; i++) {
      if (comment.content.search(moderatorRules[i].search) > -1) {
        comment.blocked.is_blocked = moderatorRules[i].block;
        comment.blocked.reason = moderatorRules[i].reason;
        comment.blocked.by = "auto-moderator";
        comment.blocked.at = Date.now();
        mqttClient.publish(
          process.env.MQTT_TOPIC_PREFIX + "comments/blocked",
          JSON.stringify(comment)
        );

        if (moderatorRules[i].block) {
          mqttClient.publish(
            process.env.MQTT_TOPIC_PREFIX + "slack/send",
            `Comment was blocked by ${comment.blocked.by}, reason: ${comment.blocked.reason}, \ncontent: \`\`\`${comment.content}\`\`\` `,
            { qos: 1 }
          );
        }

        break; // Stop checking rules
      }
    }
  }
});

mqttClient.subscribe(
  [
    process.env.MQTT_TOPIC_PREFIX + "comments/created",
    process.env.MQTT_TOPIC_PREFIX + "comments/updated",
  ],
  { qos: 1 } // Qos 0 - at most once delivery, Qos 1 - at least once delivery, Qos 2 - exactly once delivery
);
