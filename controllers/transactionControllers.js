const { db } = require('../database/index');

const { uploader } = require('../helper/uploader');

const fs = require('fs');

module.exports = {
  //  asking for a specific data
  getTransactionData: (req, res) => {
    let getTransactionDataQuery = `SELECT * FROM transaction_details td 
    INNER JOIN transactions t ON td.transaction_id = t.transaction_id
    INNER JOIN users u ON t.user_id = u.id WHERE transactiondetail_id = ${req.params.transactiondetail_id}`;

    db.query(getTransactionDataQuery, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  },
  // get all transaction data
  getAllTransactionData: (req, res) => {
    let getAllTransactionDataQuery = `SELECT * FROM transaction_details td 
    INNER JOIN transactions t ON td.transaction_id = t.transaction_id
    INNER JOIN users u ON t.user_id = u.id;`;

    db.query(getAllTransactionDataQuery, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  },
  // add new CUSTOM ORDER transaction Data
  // addNewTransactionData: (req, res) => {
  //   try {
  //     let path = '/images/transaction';

  //     const upload = uploader(path, 'TRS').fields([{ name: 'file' }]);

  //     upload(req, res, (error) => {
  //       if (error) {
  //         console.log(error);
  //         res.status(500).send(error);
  //       }
  //       // if isnt error
  //       const { file } = req.files;
  //       const filepath = file ? path + '/' + file[0].filename : null;

  //       // parsing the data
  //       let data = JSON.parse(req.body.data);
  //       data.product_img = filepath;

  //       let addNewTransactionData = `INSERT INTO transaction_details VALUES (null,
  //       ${db.escape(data.product_name)}, ${db.escape(data.product_desc)},
  //       ${db.escape(filepath)}, ${db.escape(data.stock)},
  //       ${db.escape(data.netto)},
  //       ${db.escape(data.netto_total)}, ${db.escape(data.unit)},
  //       ${db.escape(data.price_per_unit)},
  //       ${db.escape(data.price_per_stock)},
  //       ${db.escape(data.brand_id)},
  //       ${db.escape(data.category_id)},
  //       ${db.escape(data.notes)});`;

  //       db.query(addNewTransactionData, (error, results) => {
  //         if (error) {
  //           console.log(error);
  //           fs.unlinkSync('./public' + filepath);
  //           res.status(500).send(error);
  //         }
  //         res.status(200).send({
  //           message:
  //             'Your query has succesfully been sent, please wait and check your notification for our reply!',
  //         });
  //       });
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send(error);
  //   }
  // },
  // update transaction data
  updateTransactionData: (req, res) => {
    try {
      let path = '/images/transaction';

      const upload = uploader(path, 'PRD').fields([{ name: 'file' }]);

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

          let updateTransactionDataQuery = `UPDATE transaction_details td
          INNER JOIN transactions t ON td.transaction_id = t.transaction_id
          INNER JOIN users u ON t.user_id = u.id SET ${dataUpdate} WHERE transactiondetail_id = ${req.params.transactiondetail_id}`;

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

          let updateTransactionDataQuery = `UPDATE transaction_details td
          INNER JOIN transactions t ON td.transaction_id = t.transaction_id
          INNER JOIN users u ON t.user_id = u.id SET ${dataUpdate} WHERE transactiondetail_id = ${req.params.transactiondetail_id}`;

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
  // Delete Data
  deleteTransactionData: (req, res) => {
    let deleteTransactionDataQuery = `DELETE FROM transaction_details WHERE transactiondetail_id = ${req.params.transactiondetail_id}`;

    db.query(deleteTransactionDataQuery, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  },
};
