const { db } = require("../database/index");

module.exports = {
  addTransaction: (req, res) => {
    let {
      userId,
      recipent,
      address,
      totalPrice,
      transactionItems,
      currentDate,
    } = req.body;
    console.log(currentDate);
    transactionItems = JSON.stringify(transactionItems);
    // console.log(userId, recipent, address, totalPrice, transactionItems);
    let addTransactionQuery = `insert into transactions values (null, ${db.escape(
      userId
    )}, ${db.escape(recipent)}, ${db.escape(address)}, ${db.escape(
      totalPrice
    )},${db.escape(transactionItems)},${db.escape(currentDate)},null,"unpaid")`;

    db.query(addTransactionQuery, (err, result) => {
      if (err) {
        console.log(err);
      }
      //   console.log(result);
    });
  },
};
