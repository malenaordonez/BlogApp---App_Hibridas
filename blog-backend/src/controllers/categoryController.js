const categoryService = require('../services/categoryService');

const formatearNombre = (nombre) => {
    if (!nombre) return nombre;
    const limpio = nombre.trim();
    return limpio.charAt(0).toUpperCase() + limpio.slice(1).toLowerCase();
};

const crear = async (req, res) => {
    try {

        const datos = {
            ...req.body,
            nombre: formatearNombre(req.body.nombre)
        };

        const resultado = await categoryService.crearCategoria(datos);

        if (resultado.exito === false) {
            return res.status(400).json({mensaje: resultado.mensaje});
        }

        res.status(201).json({mensaje: 'Categoría creada con éxito', categoria: resultado.categoria});
    } catch (error) {
        console.log('Error al crear categoria:', error);
        res.status(500).json({mensaje: error.message});        
    }
};

const obtenerTodas = async (req, res) => {
    try {
        const resultado = await categoryService.obtenerCategorias();
        res.status(200).json(resultado.categorias);
    } catch (error) {
        res.status(500).json({mensaje: 'Error interno del servidor'});
    }
};

const actualizar = async (req, res) => {
    try {
        const id = req.params.id;

        //Si se intenta actualizar el nombre, lo formateamos también
        const datos = req.body.nombre ? {...req.body, nombre: formatearNombre(req.body.nombre)} : req.body;
        const resultado = await categoryService.actualizarCategoria(id, datos);

        if (resultado.exito === false) {
            return res.status(404).json({mensaje: resultado.mensaje});
        }

        res.status(200).json({mensaje: 'Categoría actualizada con éxito', categoria: resultado.categoria });
    } catch (error) {
        console.log('Error al actualizar categoria:', error);
        res.status(500).json({mensaje: 'Error interno del servidor'});        
    }
};

const borrar = async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await categoryService.borrarCategoria(id);

        if (resultado.exito === false) {
            return res.status(404).json({mensaje: resultado.mensaje});
        }

        res.status(200).json({mensaje: resultado.mensaje});
    } catch (error) {
        console.log('Error al borrar categoría:', error);
        res.status(500).json({mensaje: 'Error interno del servidor'});
    }
};

module.exports = {crear, obtenerTodas, actualizar, borrar};