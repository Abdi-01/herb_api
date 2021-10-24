const { db } = require('../database/index');
const fs = require('fs');

const { uploader } = require('../helper/uploader');

module.exports = {
  getTransaction: (req, res) => {
    let { id } = req.session;
    let getTransactionQuery = `select * from transactions where user_id = ${db.escape(
      id
    )} and payment_status = "unpaid"`;

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
  // add custom order transaction
  addCustomTransaction: (req, res) => {
    try {
      let path = '/images/transaction';
      // TRS for custom order image
      const upload = uploader(path, 'TRS').fields([{ name: 'file' }]);

      upload(req, res, (error) => {
        if (error) {
          console.log(error);
          res.status(500).send(error);
        }
        // if isnt error
        const { file } = req.files;
        const filepath = file ? path + '/' + file[0].filename : null;

        // parsing the data
        let data = JSON.parse(req.body.data);
        data.prescription_img = filepath;

        let addNewTransactionData = `INSERT INTO transactions VALUES (null, ${db.escape(
          data.userId
        )},  ${db.escape(data.recipent)}, ${db.escape(
          data.address
        )}, null, "custom", ${db.escape(
          data.transaction_date
        )}, null, "unpaid", ${db.escape(filepath)}, ${db.escape(
          data.notes
        )}, null);`;

        db.query(addNewTransactionData, (error, results) => {
          if (error) {
            console.log(error);
            fs.unlinkSync('./public' + filepath);
            res.status(500).send(error);
          }
          res.status(200).send({
            message:
              'Your query has succesfully been sent, please wait and check your notification for our reply!',
          });
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  addTransaction: (req, res) => {
    let {
      userId,
      recipent,
      address,
      totalPrice,
      transactionItems,
      currentDate,
    } = req.body;

    let addTransactionQuery = `insert into transactions values (null, ${db.escape(
      userId
    )}, ${db.escape(recipent)}, ${db.escape(address)}, ${db.escape(
      totalPrice
    )},"normal",${db.escape(currentDate)},null,"unpaid",null,null)`;

    db.query(addTransactionQuery, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result.insertId) {
        for (let j = 0; j < transactionItems.length; j++) {
          const item = transactionItems[j];

          let addTransDetailQuery = `insert into transaction_details values (null, ${db.escape(
            result.insertId
          )}, ${db.escape(item.product_id)}, ${db.escape(
            item.quantity
          )}, ${db.escape(item.product_name)}, ${db.escape(
            item.product_desc
          )}, ${db.escape(item.product_img)}, ${db.escape(
            item.netto
          )}, ${db.escape(item.unit)},${db.escape(
            item.price_per_unit
          )}, ${db.escape(item.price_per_stock)}, ${db.escape(
            item.brand_id
          )}, ${db.escape(item.category_id)})`;

          db.query(addTransDetailQuery, (err2, result2) => {});
          item;
        }
      }
    });
  },
  updateTransactionProof: (req, res) => {
    try {
      let path = '/images/transaction';

      const upload = uploader(path, 'TRF').fields([{ name: 'file' }]);

      upload(req, res, (error) => {
        // if error
        if (error) {
          console.log(error);
          res.status(500).send(error);
        }

        if (req.files) {
          const { file } = req.files;
          const filepath = file ? path + '/' + file[0].filename : null;

          let data = JSON.parse(req.body.data);
          data.product_img = filepath;

          let dataUpdate = [];

          for (let prop in data) {
            dataUpdate.push(`${prop} = ${db.escape(data[prop])}`);
          }

          let updateTransactionDataQuery = `UPDATE transactions SET ${dataUpdate} WHERE transaction_id = ${req.params.transaction_id};`;

          db.query(updateTransactionDataQuery, (err, results) => {
            if (err) {
              console.log(err);
              res.status(500).send(err);
              fs.unlinkSync('./public' + filepath);
            }
            res
              .status(200)
              .send({ message: 'Item has succefully been updated' });
          });
        } else if (!req.files) {
          let data = req.body;
          let dataUpdate = [];

          for (let prop in data) {
            dataUpdate.push(`${prop} = ${db.escape(data[prop])}`);
          }

          let updateTransactionDataQuery = `UPDATE transactions SET ${dataUpdate} WHERE transaction_id = ${req.params.transaction_id};`;

          db.query(updateTransactionDataQuery, (err, results) => {
            if (err) {
              console.log(err);
              res.status(500).send(err);
            }
            res.status(200).send({ message: 'Succesfully updated item' });
          });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(err);
    }
  },
};
