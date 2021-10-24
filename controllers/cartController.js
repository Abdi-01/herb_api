const { db } = require("../database/index");

module.exports = {
  getAllCart: (req, res) => {
    let getAllCartQuery = `select * from carts inner join products on carts.product_id = products.product_id where carts.user_id = ${db.escape(
      req.session.id
    )} `;
    db.query(getAllCartQuery, (err, result) => {
      let dataToString = JSON.stringify(result);
      let dataResult = JSON.parse(dataToString);
      res.send(dataResult);
    });
  },
  getCart: (req, res) => {
    let { userId, productId } = req.query;
    let getCartQuery = `select * from carts where user_id = ${db.escape(
      userId
    )} and product_id = ${db.escape(productId)}`;
    db.query(getCartQuery, (err, result) => {
      if (err) {
        console.log(err);
      }
      let dataToString = JSON.stringify(result);
      let dataResult = JSON.parse(dataToString);
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
  deleteSpecificCart: (req, res) => {
    let { id } = req.params;
    let deleteCartQuery = `delete from carts where id = ${db.escape(id)}`;

    db.query(deleteCartQuery, (err, result) => {
      if (err) {
        console.log(err);
      }
      res.sendStatus(200);
    });
  },
  deleteCarts: (req, res) => {
    let { id } = req.params;
    let deleteCartQuery = `delete from carts where user_id = ${db.escape(id)}`;

    db.query(deleteCartQuery, (err, result) => {
      if (err) {
        console.log(err);
      }
      res.sendStatus(200);
    });
  },
  addCart: (req, res) => {
    let { userId, quantity, productId } = req.body;
    let addCartQuery = `insert into carts values (null, ${db.escape(
      userId
    )},${db.escape(quantity)},${db.escape(productId)})`;

    db.query(addCartQuery, (err, result) => {
      if (err) {
        console.log(err);
      }
      res.sendStatus(200);
    });
  },
};
