const { productControllers } = require('../controllers');

const routers = require('express').Router();

// get particular data
routers.get('/get/:product_id', productControllers.getData);
// get all data
routers.get('/get', productControllers.getAllProductData);
// add new transaction
routers.post('/post', productControllers.addData);
// edit transaction
routers.patch('/update/:product_id', productControllers.updateData);
// delete transaction
routers.delete('/delete/:product_id', productControllers.deleteData);

module.exports = routers;
