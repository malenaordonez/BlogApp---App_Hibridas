const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const {verificarToken} = require('../middlewares/authMiddleware');

//Ruta Pública. Cualquiera puede ver las categorías
router.get('/', categoryController.obtenerTodas);

//Ruta Privada. Solo usuarios logueados pueden crearlas.
router.post('/', verificarToken, categoryController.crear);

//Ruta Privada: Actualizar una categoría por su ID
router.put('/:id', verificarToken, categoryController.actualizar);

//Ruta Privada: Borrar una categoría por su ID
router.delete('/:id', verificarToken, categoryController.borrar);
module.exports = router;