const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  const token = bearerHeader && bearerHeader.split(" ")[1];
  console.log("token", token);
  console.log("bearerHeader", bearerHeader);

  if (token == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const publicKEY = `-----BEGIN PUBLIC KEY-----
${process.env.JWT_PUBLIC_KEY}
-----END PUBLIC KEY-----`;
  console.log("publicKEY", publicKEY);
  const decodeToken = jwt.verify(token, publicKEY, { algorithm: ["RS256"] });
  console.log("decodedToken", decodeToken);


  req.user = decodeToken;
  next();
};
