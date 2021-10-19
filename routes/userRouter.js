const { userController } = require('../controllers')
const routers = require('express').Router();

routers.get('/', userController.getData) //Get All Data
routers.get('/:id', userController.getDataById) //Get Data By Id
routers.patch('/:id', userController.editData); //Edit Data

module.exports = routers
