const { db } = require('../../database/index');

const { uploader } = require('../../helper/uploader');
const fs = require('fs');

module.exports = {
  getAllProductData: (req, res) => {
    let getAllProductsQuery = `SELECT * FROM sys.products p
      LEFT JOIN sys.brands b ON p.brand_id = b.brand_id
      LEFT JOIN sys.categories c ON p.category_id = c.category_id;`;
    // checking
    db.query(getAllProductsQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
  addData: (req, res) => {
    try {
      let path = '/images/products';
      const upload = uploader(path, 'PRD').fields([{ name: 'file' }]);

      upload(req, res, (error) => {
        // if error
        if (error) {
          console.log(error);
          res.status(500).send(error);
        }
        // console.log(req.files);
        const { file } = req.files;
        const filepath = file ? path + '/' + file[0].filename : null;

        //parsing the data
        let data = JSON.parse(req.body.data);
        data.product_img = filepath;

        let addNewDataQuery = `INSERT INTO sys.products VALUES (null, ${db.escape(
          data.product_name
        )}, ${db.escape(data.product_desc)}, ${db.escape(
          filepath
        )}, ${db.escape(data.stock)}, ${db.escape(data.netto)}, ${db.escape(
          data.netto_total
        )}, ${db.escape(data.unit)}, ${db.escape(
          data.price_per_unit
        )}, ${db.escape(data.price_per_stock)}, ${db.escape(
          data.brand_id
        )}, ${db.escape(data.category_id)});`;

        db.query(addNewDataQuery, (err, results) => {
          if (err) {
            console.log(err);
            fs.unlinkSync('./public' + filepath);
            res.status(500).send(err);
          }
          res
            .status(200)
            .send({ message: 'New Item has succefully been added' });
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
};
