const { db } = require("../database/index");

module.exports = {
  getCart: (req, res) => {
    // console.log(req.session);

    let getQuery = `Select * from carts INNER JOIN cart_details on carts.id = cart_details.id INNER JOIN products on cart_details.product_id = products.product_id where carts.user_id = ${db.escape(
      req.session.id
    )}
    `;
    db.query(getQuery, (err, result) => {
      let dataToString = JSON.stringify(result);
      let dataResult = JSON.parse(dataToString);
      //   console.log(dataResult);
      res.send(dataResult);
    });
  },
  updateQty: (req, res) => {
    let { id, qty, action } = req.body;
    if (action === "increment") {
      qty += 1;
    }
    if (action === "decrement") {
      qty -= 1;
    }
    console.log(qty);
    let updateQtyCart = `update carts set quantity = ${db.escape(
      qty
    )} where id = ${db.escape(id)}`;

    db.query(updateQtyCart, (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(true);
    });
  },
};
