const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

const { initialize:initializePassport, isAdmin:isAdmin}  = require("../passportConfig");
initializePassport(passport);

const jwt = require("jsonwebtoken");
const mqttClient = require("../mqtt");

// Create user
router.post(
  "/signup",function(req,res, next) {
  passport.authenticate("local-signup", { session: false }, function (err, user, info) {
    if (err) { return next(err); }
    if (!user) {
        res.status(401);
        res.end(info.message);
        return
    }
    mqttClient.publish(process.env.MQTT_TOPIC_PREFIX+"user/created", JSON.stringify({email: user.email, role: user.role, username: user.username}),{qos: 1});
    res.json({ user: res.user });

  })(req, res, next);  
});


// Login user
router.post(
  "/login",
  passport.authenticate("local-login", { session: false }),
  (req, res) => {
    jwt.sign({ user: {email: req.user.email, role: req.user.role} },process.env.JWT_SECRET,{ expiresIn: "1w" },(err, token) => {
        if (err) {
            mqttClient.publish(process.env.MQTT_TOPIC_PREFIX+"user/login", JSON.stringify({email: req.user.email, role: req.user.role, success: false}));
            return res.json({
            message: "Failed to login",
            token: null,
            });
        }
        mqttClient.publish(process.env.MQTT_TOPIC_PREFIX+"user/login", JSON.stringify({email: req.user.email, role: req.user.role, success: true}));
        res.json({
            message: "OK",
            token,
        });
        }
    );
  }
);

// User verification
router.get("/verification", passport.authenticate("jwt", { session: false }), async (req, res) => {
  res.json({message: "OK"});
});


module.exports = router;
