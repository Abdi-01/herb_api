const jwt = require("jsonwebtoken");

module.exports = {
  authorize: (req, res, next) => {
    const token = req.query.token;

    jwt.verify(token, "gunsman", (err, session) => {
      if (err) return res.sendStatus(403);
      req.session = session;
      next();
    });
  },
  auth: (req, res, next) => {
    jwt.verify(req.token, "gunsman", (err, decode) => {
      if (err) {
        return res.status(401).send("User is not Authenticated");
      }
      req.user = decode;
      next();
    });
  },
};
