const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

const initializePassport = require("../passportConfig");
initializePassport(passport);

const jwt = require("jsonwebtoken");

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
    res.json({ user: req.user });

  })(req, res, next);  
});


// Login user
router.post(
  "/login",
  passport.authenticate("local-login", { session: false }),
  (req, res) => {
    jwt.sign({ user: {email: req.user.email, role: req.user.role} },process.env.JWT_SECRET,{ expiresIn: "1w" },(err, token) => {
        if (err) {
            return res.json({
            message: "Failed to login",
            token: null,
            });
        }
        res.json({
            message: "OK",
            token,
        });
        }
    );
  }
);


module.exports = router;
