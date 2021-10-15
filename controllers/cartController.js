const { db } = require("../database/index");

module.exports = {
  getCart: (req, res) => {
    // console.log(req.session);

    let getCartQuery = `select * from carts inner join products on carts.product_id = products.product_id where carts.user_id = ${db.escape(
      req.session.id
    )} `;
    db.query(getCartQuery, (err, result) => {
      let dataToString = JSON.stringify(result);
      let dataResult = JSON.parse(dataToString);
      // console.log(dataResult);
      res.send(dataResult);
    });
  },
  updateQty: (req, res) => {
    let { qty, action } = req.body;
    let { id } = req.params;
    if (action === "increment") {
      qty += 1;
    }
    if (action === "decrement" && qty > 1) {
      qty -= 1;
    }
    let updateQtyCart = `update carts set quantity = ${db.escape(
      qty
    )} where id = ${db.escape(id)}`;

    db.query(updateQtyCart, (err, result) => {
      if (err) {
        console.log(err);
      }
      res.sendStatus(200);
    });
  },
  deleteCart: (req, res) => {
    let { id } = req.params;
    console.log(id);
    let deleteCartQuery = `delete from carts where id = ${db.escape(id)}`;

    db.query(deleteCartQuery, (err, result) => {
      if (err) {
        console.log(err);
      }
      res.sendStatus(200);
    });
  },
};
