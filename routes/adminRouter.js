const { adminController } = require('../controllers')
const routers = require('express').Router();

routers.get('/', adminController.getReportSales) //Get Report Sales

module.exports = routers
