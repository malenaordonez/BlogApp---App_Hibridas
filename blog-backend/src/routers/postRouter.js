const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

//Importamos al middleware para proteger que no cualquiera pueda escribir un post.
const { verificarToken } = require('../middlewares/authMiddleware');

//Ruta Pública: cualquiera puede ver los posts (usamos GET)
router.get('/', postController.obtenerTodos);

//Ruta Privada: para postear primero tienen que pasar por el 'verificarToken'.
router.post('/', verificarToken, postController.crear);

//Ruta Pública para poder ver todos los posteos de un usuario.
router.get('/usuario/:id', postController.obtenerPorUsuario);

router.get('/mis-posts', verificarToken, postController.obtenerMisPostsAdmin)

//Ruta Privada: Actualizar un post por su ID
router.put('/:id', verificarToken, postController.actualizar);

//Ruta Privada: Borrar un post por su ID
router.delete('/:id', verificarToken, postController.borrar)

router.get('/:id', postController.obtenerPorId)

module.exports = router;