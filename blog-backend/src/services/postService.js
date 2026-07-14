const Post = require('../schemas/Post');

const crearPost = async (datosPost, autorId) => {
    try {
        const nuevoPost = new Post({...datosPost, autor: autorId //El ID lo sacamos del token, garantizando que el autor es quien está logueado.
        });
        await nuevoPost.save();
        return {exito: true, post: nuevoPost};
    } catch (error) {
        return {exito: false, mensaje: 'Error al crear el post'}
    }
};

//el populate 'nombre email' es para traer solo el email que esta asociado a ese nombre 
const obtenerPosts = async () => {
    try {
        const posts = await Post.find()
        .populate('autor', 'nombre email')
        .populate('categoria', 'nombre');
    
        return { exito: true, posts};
    } catch (error) {
        return {exito: false, mensaje: 'Error al obtener los posts'};        
    }
};

const actualizarPost = async (id, datosActualizados) => {
    try {
        //El parametro new le dice a mongoose que devuelva el artículo modificado, no la versión vieja.
        const postActualizado = await Post.findByIdAndUpdate(id, datosActualizados, {new: true});
    
        if (!postActualizado) {
            return {exito: false, mensaje: 'No se encontró el post con ese ID'};
    }
    return { exito: true, post: postActualizado};
    } catch (error) {
    return { exito: false, mensaje: 'Error al actualizar el post' };
    }
};

const borrarPost = async (id) => {
    try {
        const postBorrado = await Post.findByIdAndDelete(id);
    
        if (!postBorrado) {
            return {exito: false, mensaje: 'No se encontró el post con ese ID'};
        }
    
    return {exito: true, mensaje: 'Post eliminado correctamente'};
    } catch (error) {
    return { exito: false, mensaje: 'Error al eliminar el post' };
    }
};

const obtenerPostsPorUsuario = async (autorId) => {
    try {
        //Trae los posts donde el autor coincida con el ID.
        const posts = await Post.find({autor: autorId}).populate('autor', 'nombre').populate('categoria')

        return {exito: true, posts};
    } catch (error) {
        return {exito: false, mensaje: 'Error al buscar post del usuario'}
    }
}

const obtenerPostPorId = async (id) => {
    try {
        const post = await Post.findById(id).populate('autor', 'nombre').populate('categoria', 'nombre');
        if (!post) return {exito: false};
        return {exito: true, post };
    } catch (error) {
        return {exito: false};
    }
};
module.exports = {crearPost, obtenerPosts, actualizarPost, borrarPost, obtenerPostsPorUsuario, obtenerPostPorId};
