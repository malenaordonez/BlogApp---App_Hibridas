const { post } = require('../routers/userRouter');
const postService = require('../services/postService');

const crear = async (req, res) => {
    try {
        const autorId = req.usuario.id;
        const resultado = await postService.crearPost(req.body, autorId);
        
        if (resultado.exito === false) {
            return res.status(400).json({ mensaje: resultado.mensaje});
        }

        res.status(201).json({mensaje: 'Post creado con éxito', post: resultado.post});
    } catch (error) {
        res.status(500).json({ mensaje: error.message});
    }
};

const obtenerTodos = async (req,res) => {
    try {
        const resultado = await postService.obtenerPosts();
        res.status(200).json(resultado.posts);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor'});
    }
};

const actualizar = async (req, res) => {
    try {
        const id = req.params.id //Capturamos el ID de la URL
        const resultado = await postService.actualizarPost(id, req.body);

        if (resultado.exito === false) {
            return res.status(404).json({mensaje: resultado.mensaje});
        }

        res.status(200).json({mensaje: 'Post actualizado con éxito', post: resultado.post});
    } catch (error) {
        console.log("Error al actualizar post:", error);
        res.status(500).json({mensaje: 'Error interno del servidor'});
    }
};

const borrar = async (req, res) => {
    try {
        const id = req.params.id //Capturamos el ID de la URL
        const resultado = await postService.borrarPost(id);

        if (resultado.exito === false) {
            return res.status(404).json({mensaje: resultado.mensaje});
        }

        res.status(200).json({mensaje: resultado.mensaje});
    } catch (error) {
        console.log('Error al borrar post:', error);
        res.status(500).json({mensaje: 'Error interno del servidor'});        
    }
};

const obtenerPorUsuario = async (req, res) => {
    try {
        const autorId = req.params.id // Capturamos el ID del auto desde la URL
        const resultado = await postService.obtenerPostsPorUsuario(autorId);

        res.status(200).json(resultado.posts)
    } catch (error) {
        console.log('Error al obtener posts del usuario', error);
        res.status(500).json({mensaje: 'Error interno del servidor'});
    }
};

const obtenerMisPostsAdmin = async (req,res) => {
    try {
        const autorId = req.usuario.id; //El id viene del token asi en el panel de admin, cada usuario solo ve SUS posteos
        const resultado = await postService.obtenerPostsPorUsuario(autorId);
    } catch (error) {
        res.status(500).json({mensaje: 'Error al obtener tus posts'});
    }
}

const obtenerPorId = async (req, res) => {
    const { id } = req.params;
    const resultado = await postService.obtenerPostPorId(id);

    if (!resultado.exito) {
        return res.status(404).json({ mensaje: "Post no encontrado" });
    }
    res.json(resultado.post);
};

module.exports = {crear, obtenerTodos, actualizar, borrar, obtenerPorUsuario, obtenerPorId, obtenerMisPostsAdmin};