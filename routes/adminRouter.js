const { adminController } = require('../controllers')
const routers = require('express').Router();

routers.get('/', adminController.getReportSales) //Get Report Sales
routers.get('/revenue', adminController.getRevenue) //Get Report Revenue

module.exports = routers
