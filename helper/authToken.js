// Decoding: Menerjemahkan Token
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
};
