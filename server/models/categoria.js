const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let categoriaSchm = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'Debes ingresar un nombre para la categoría']

    },
    descripcion: {
        type: String,
        required: false
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },


})

categoriaSchm.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = mongoose.model('Categoria', categoriaSchm)