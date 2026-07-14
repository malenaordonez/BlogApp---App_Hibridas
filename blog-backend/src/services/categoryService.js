const Category = require('../schemas/Category');

const crearCategoria = async (datosCategoria) => {
    try {
        const nuevaCategoria = new Category(datosCategoria);
        await nuevaCategoria.save();
        return {exito: true, categoria: nuevaCategoria};
    } catch (error) {
        return {exito: false, mensaje: 'Error al crear una nueva categoría'};
    }
};

const obtenerCategorias = async () => {
    try {
        const categorias = await Category.find();
        return {exito: true, categorias};
    } catch (error) {
         return {exito: false, mensaje: 'Error al obtener las categorias'};
    }
};

const actualizarCategoria = async (id, datosActualizados) => {
    try {
        const categoriaActualizada = await Category.findByIdAndUpdate(id, datosActualizados, {new: true});
    
        if (!categoriaActualizada) {
            return {exito: false, mensaje: 'No se encontró la categoría con ese ID'};
        }
    
        return {exito: true, categoria: categoriaActualizada};
    } catch (error) {
        return {exito: false, mensaje: 'Error al actualizar la categoría'};  
    }
};

const borrarCategoria = async (id) => {
    try {
        const categoriaBorrada = await Category.findByIdAndDelete(id);
    
        if (!categoriaBorrada) {
            return {exito: false, mensaje: 'No se encontró la categoría con ese ID'};
        }
    
        return {exito: true, mensaje: 'Categoría eliminada correctamente'};
    } catch (error) {
        return {exito: false, mensaje: 'Error al borrar la categoría'};  
    }
};

module.exports = {crearCategoria, obtenerCategorias, actualizarCategoria, borrarCategoria};