const { userController } = require('../controllers')
const routers = require('express').Router();

routers.get('/', userController.getData)
routers.get('/:id', userController.getDataById)
routers.patch('/:id', userController.editData);

module.exports = routers
