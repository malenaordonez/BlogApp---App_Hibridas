const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true
    },
    contenido: {
        type: String,
        required: [true, 'El contenido del post es obligatorio']
    },
    imagenUrl: {
        type: String,
        default: 'https://via.placeholder.com/800x400?text=Sin+Imagen'
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId, //Guardamos el ID autogenerado del usuario
        ref: 'User', //Le decimos a Mongoose que este ID hace referencia a la colección de Usuarios.
        required: true,
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);