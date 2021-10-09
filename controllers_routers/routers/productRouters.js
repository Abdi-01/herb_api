const { productControllers } = require('../controllers');

const routers = require('express').Router();

routers.get('/get', productControllers.getAllProductData);
routers.post('/post', productControllers.addData);

module.exports = routers;
