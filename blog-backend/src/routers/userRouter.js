const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//Definimos las rutas. Usamos POST para enviar datos sensibles como contraseñas y que no uqeden expuestos en la URL.
router.post('/registro', userController.registrar);
router.post('/login', userController.login);

module.exports = router;