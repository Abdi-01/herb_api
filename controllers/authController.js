const { db } = require("../database/index");
const Crypto = require("crypto");
const { createToken } = require("../helper/createToken");
const transporter = require("../helper/nodemailer");

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
            message: "Your account has not been verified yet",
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
  addUser: (req, res) => {
    let { username, email, password } = req.body;

    let getQuery = `select * from users where username=${db.escape(
      username
    )} or email = ${db.escape(email)}`;

    db.query(getQuery, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        res.send({
          message: "Username or Email is already exists",
        });
      } else {
        // Hash the password
        password = Crypto.createHmac("sha1", "hash123")
          .update(password)
          .digest("hex");

        // Insert to database
        let insertQuery = `insert into users values (null, ${db.escape(
          username
        )}, ${db.escape(email)},${db.escape(
          password
        )},'user','unverified', null,null,null,null,null,null)`;

        // Post the DATA

        db.query(insertQuery, (err, result) => {
          if (err) {
            res.status(500).send(err);
          }
          if (result.insertId) {
            let getUserQuery = `select * from users where id = ${result.insertId}`;

            db.query(getUserQuery, (err2, result2) => {
              if (err2) {
                console.log(err2);
              }
              // Parse the result data format from mysql
              let dataToString = JSON.stringify(result2);
              let dataResult = JSON.parse(dataToString);
              let { id, username, email, role, user_status } = dataResult[0];
              // Create Token
              let dataToken = { id, username, email, role, user_status };
              let token = createToken(dataToken);

              res.status(200).send({ dataLogin: dataResult, token: token });

              // Email Verify

              // Email Verification Format
              let mail = {
                from: `Admin <herb.iostores@gmail.com>`,
                // Email orang yg ada di database
                to: `${email}`,
                subject: "Herbio Account Verification",
                // Isi Emailnya
                html: `<a href='http://localhost:3000/verify/${token}'>Click here to verify your account</a>`,
              };

              // Sending verification link to email
              transporter.sendMail(mail, (errMail, resMail) => {
                if (errMail) {
                  res.status(500).send({
                    message: "Registration Failed",
                    isSuccess: false,
                    err: errMail,
                  });
                }
                res.status(200).send({
                  message: `Registration Success, now verify your account by check your email to ${email}`,
                  isSuccess: true,
                });
              });
            });
          }
        });
      }
    });
  },
  verification: (req, res) => {
    let { id, username } = req.user;
    let updateQuery = `UPDATE users set user_status='verified' where id = ${id}`;
    db.query(updateQuery, (err, results) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send({
        message: `${username} is successfully verified`,
        isSuccess: true,
      });
    });
  },
  forgotPassword: (req, res) => {
    let { account } = req.query;

    let getUser = `select * from users where username = ${db.escape(
      account
    )} or email = ${db.escape(account)}`;
    db.query(getUser, (err, result) => {
      if (err) {
        res.status(500).send(err);
      }
      if (result.length) {
        let dataToString = JSON.stringify(result);
        let dataResult = JSON.parse(dataToString);
        let { id, username, email, role, user_status } = dataResult[0];
        let dataToken = { id, username, email, role, user_status };
        let token = createToken(dataToken);
        res.status(200).send({ dataLogin: dataResult, token: token });

        // Reset password link
        let mail = {
          from: `Admin <herb.iostores@gmail.com>`,
          // Email orang yg ada di database
          to: `${email}`,
          subject: "Herbio Reset Account Link",
          // Isi Emailnya
          html: `<a href='http://localhost:3000/forgot/verify/${token}'>Click here to reset your password account</a>`,
        };

        // Sending verification link to email
        transporter.sendMail(mail, (errMail, resMail) => {
          if (errMail) {
            res.status(500).send({
              message: "Registration Failed",
              isSuccess: false,
              err: errMail,
            });
          }
          res.status(200).send({});
        });
      } else {
        res.status(200).send({
          message: "Account does not exists",
        });
      }
    });
  },
  resetPassword: (req, res) => {
    let { id } = req.user;
    let { password } = req.body;
    // Hash the password
    password = Crypto.createHmac("sha1", "hash123")
      .update(password)
      .digest("hex");

    let updateQuery = `UPDATE users set password=${db.escape(
      password
    )} where id = ${id}`;
    db.query(updateQuery, (err, results) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send({});
    });
  },
  changePassword: (req, res) => {
    res.send(req.body);
  },
};
