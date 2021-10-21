const { db } = require("../database/index");
const { uploader } = require("../helper/uploader");
const fs = require("fs");

module.exports = {
  getTransaction: (req, res) => {
    let { id } = req.session;
    let getTransactionQuery = `select * from transactions where user_id = ${db.escape(
      id
    )} and payment_status = "unpaid" or payment_status = "onprocess" `;

    db.query(getTransactionQuery, (err, result) => {
      let dataToString = JSON.stringify(result);
      let dataResult = JSON.parse(dataToString);
      if (err) {
        console.log(err);
      }
      res.status(200).send(dataResult);
    });
  },
  getTransactionHistory: (req, res) => {
    let { id } = req.session;
    let getTransactionQuery = `select * from transactions where user_id = ${db.escape(
      id
    )} and payment_status = "paid"`;

    db.query(getTransactionQuery, (err, result) => {
      let dataToString = JSON.stringify(result);
      let dataResult = JSON.parse(dataToString);
      if (err) {
        console.log(err);
      }
      res.status(200).send(dataResult);
    });
  },

  addTransaction: (req, res) => {
    let { userId, recipent, address, totalPrice, transactionItems } = req.body;

    let addTransactionQuery = `insert into transactions values (null, ${db.escape(
      userId
    )}, ${db.escape(recipent)}, ${db.escape(address)}, ${db.escape(
      totalPrice
    )},"normal",NOW(),null,"unpaid",null,null,null)`;

    db.query(addTransactionQuery, (err, result) => {
      if (err) {
        console.log(err);
      }

      if (result.insertId) {
        let values = transactionItems.map((item) => [
          null,
          result.insertId,
          item.product_id,
          item.quantity,
          item.product_name,
          item.product_desc,
          item.product_img,
          item.netto,
          item.unit,
          item.price_per_unit,
          item.price_per_stock,
          item.brand_id,
          item.category_id,
        ]);
        let addTransDetail =
          "INSERT INTO transaction_details (transactiondetail_id, transaction_id, product_id, quantity, product_name, product_desc, product_img, netto, unit, price_per_unit, price_per_stock, brand_id, category_id) VALUES ?";

        // console.log(addTransDetail);
        db.query(addTransDetail, [values], (err2, res2) => {
          if (err2) {
            console.log(err2);
          }
          console.log(res2);
        });
      }
    });
  },

  getTransDetail: (req, res) => {
    let { id } = req.query;
    let sql = `SELECT * from transaction_details where transaction_id = ${db.escape(
      id
    )}`;

    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      }
      let dataToString = JSON.stringify(result);
      let dataResult = JSON.parse(dataToString);
      // console.log(dataResult);
      res.status(200).send(dataResult);
    });
  },
  uploadPaymentProof: (req, res) => {
    console.log(req.params.transaction_id);
    try {
      let path = "/images/payment-proof";
      const upload = uploader(path, "PRF-").fields([{ name: "file" }]);

      upload(req, res, (error) => {
        if (error) {
          console.log(error);
          res.status(500).send(error);
        }
        console.log(req.files);
        const { file } = req.files;
        const filePath = file ? path + "/" + file[0].filename : null;
        // console.log(filePath);

        let data = JSON.parse(req.body.data);
        data.image = filePath;

        let sql = `update transactions set notes_payment = ${db.escape(
          data.notesPayment
        )}, payment_status = "onprocess", payment_proof = ${db.escape(
          filePath
        )} where transaction_id = ${db.escape(req.params.transaction_id)}`;

        db.query(sql, (err, result) => {
          if (err) {
            console.log(err);
            fs.unlinkSync("./public" + filePath);
            res.status(500).send(err);
          }
          console.log(result);
          res.status(200).send({ message: "upload file success" });
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
};
