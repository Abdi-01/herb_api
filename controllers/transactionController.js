const { db } = require("../database/index");

module.exports = {
  getTransaction: (req, res) => {
    let { id } = req.session;
    let getTransactionQuery = `select * from transactions where user_id = ${db.escape(
      id
    )}`;

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
};
