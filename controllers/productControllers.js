const { db } = require("../database/index");

const { uploader } = require("../helper/uploader");
const fs = require("fs");

module.exports = {
  getData: (req, res) => {
    let getDataQuery = `SELECT * FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN categories c ON p.category_id = c.category_id WHERE product_id = ${req.params.product_id} `;

    db.query(getDataQuery, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  },
  getAllProductData: (req, res) => {
    let getAllProductsQuery = `SELECT * FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN categories c ON p.category_id = c.category_id;`;

    // checking
    db.query(getAllProductsQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
  addData: (req, res) => {
    try {
      let path = "/images/products";
      const upload = uploader(path, "PRD").fields([{ name: "file" }]);

      upload(req, res, (error) => {
        // if error
        if (error) {
          console.log(error);
          res.status(500).send(error);
        }
        // console.log(req.files);
        const { file } = req.files;
        const filepath = file ? path + "/" + file[0].filename : null;

        //parsing the data
        let data = JSON.parse(req.body.data);
        data.product_img = filepath;

        let netto_total = data.capacity_per_package * data.stock;
        let price_per_unit = data.price_per_stock / data.capacity_per_package;

        let addNewDataQuery = `INSERT INTO products VALUES (null, 
          ${db.escape(data.product_name)}, 
          ${db.escape(data.product_desc)}, 
          ${db.escape(filepath)}, 
          ${db.escape(data.stock)}, 
          ${db.escape(data.capacity_per_package)}, 
          ${db.escape(netto_total)},
          ${db.escape(data.unit)}, 
          ${db.escape(price_per_unit)}, 
          ${db.escape(data.price_per_stock)}, 
          ${db.escape(data.brand_id)}, 
          ${db.escape(data.category_id)});`;

        db.query(addNewDataQuery, (err, results) => {
          if (err) {
            console.log(err);
            fs.unlinkSync("./public" + filepath);
            res.status(500).send(err);
          }
          res
            .status(200)
            .send({ message: "New Item has succefully been added" });
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  updateData: (req, res) => {
    try {
      let path = "/images/products";
      const upload = uploader(path, "PRD").fields([{ name: "file" }]);

      upload(req, res, (error) => {
        // if error
        if (error) {
          console.log(error);
          res.status(500).send(error);
        }

        if (req.files) {
          const { file } = req.files;
          const filepath = file ? path + "/" + file[0].filename : null;

          let data = JSON.parse(req.body.data);
          data.product_img = filepath;

          let dataUpdate = [];

          for (let prop in data) {
            dataUpdate.push(`${prop} = ${db.escape(data[prop])}`);
          }

          let updateDataQuery = `UPDATE products SET ${dataUpdate} WHERE product_id = ${req.params.product_id};`;

          db.query(updateDataQuery, (err, results) => {
            if (err) {
              console.log(err);
              res.status(500).send(err);
              fs.unlinkSync("./public" + filepath);
            }
            res
              .status(200)
              .send({ message: "Item has succefully been updated" });
          });
        } else if (!req.files) {
          let data = req.body;
          let dataUpdate = [];

          for (let prop in data) {
            dataUpdate.push(`${prop} = ${db.escape(data[prop])}`);
          }

          let updateDataQuery = `UPDATE products SET ${dataUpdate} WHERE product_id = ${req.params.product_id};`;

          db.query(updateDataQuery, (err, results) => {
            if (err) {
              console.log(err);
              res.status(500).send(err);
            }
            res.status(200).send({ message: "Succesfully updated item" });
          });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(err);
    }
  },
  deleteData: (req, res) => {
    let deleteDataQuery = `DELETE FROM products WHERE product_id = ${req.params.product_id}`;

    db.query(deleteDataQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
  getRecordData: (req, res) => {
    let getDataQuery = `SELECT 
    DATE_FORMAT(t.transaction_date, "%e %M %Y") AS 'Date',
    td.product_name,
    td.quantity,
    td.capacity_per_package,
    td.unit,
    t.total_price
    from transaction_details td
    join transactions t on t.transaction_id = td.transaction_id
    where t.transaction_type = "custom"
    order by t.transaction_id`;

    db.query(getDataQuery, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  },
};
