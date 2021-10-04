const { db } = require("../database/index");
const Crypto = require("crypto");
const { createToken } = require("../helper/createToken");

module.exports = {
  getUser: (req, res) => {
    let { account, password } = req.query;

    // Hash the password
    password = Crypto.createHmac("sha1", "hash123")
      .update(password)
      .digest("hex");

    //GET Query
    let getUserQuery = `select * from users where (email = ${db.escape(
      account
    )} or username = ${db.escape(account)}) and password = ${db.escape(
      password
    )}`;

    // Getting data on database
    db.query(getUserQuery, (err, result) => {
      if (err) {
        res.status(404).send({
          message: err,
        });
      }
      let dataToString = JSON.stringify(result);
      let dataResult = JSON.parse(dataToString);
      if (dataResult.length) {
        if (dataResult[0].user_status != "verified") {
          res.status(200).send({
            message:
              "Your account has not been verified yet, please verify by open your email to get verification link",
          });
        } else {
          let { id, username, email, role, user_status } = dataResult[0];
          let dataToken = {
            id,
            username,
            email,
            role,
            user_status,
          };
          let token = createToken(dataToken);
          res.status(200).send({ dataLogin: dataResult, token: token });
        }
      } else {
        res.status(200).send({
          message: "Incorrect username or password",
        });
      }
    });
  },
  getSession: (req, res) => {
    //GET Query
    let getUserQuery = `select * from users where id = ${db.escape(
      req.session.id
    )}`;

    db.query(getUserQuery, (err, result) => {
      if (err) {
        res.status(404).send({
          message: err,
        });
      }
      let dataToString = JSON.stringify(result);
      let dataResult = JSON.parse(dataToString);
      res.status(200).send(dataResult[0]);
    });
  },
};
