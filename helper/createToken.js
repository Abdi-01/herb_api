const jwt = require("jsonwebtoken");

module.exports = {
  createToken: (data) => {
    return jwt.sign(data, "gunsman", {
      expiresIn: "12h",
    });
  },
};
