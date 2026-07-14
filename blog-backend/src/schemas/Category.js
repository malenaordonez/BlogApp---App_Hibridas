const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio'],
        unique: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true,
        default: 'Sin descripción'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);